
namespace ts.codefix {
    registerCodeFix({
        errorCodes: [Diagnostics.Property_0_does_not_exist_on_type_1.code],
        getCodeActions,
    });

    function getCodeActions(context: CodeFixContext): CodeAction[] | undefined {
        const token = getTokenAtPosition(context.sourceFile, context.span.start);

        if (token.kind !== SyntaxKind.Identifier && (token as Identifier).text !== "propTypes") {
            return undefined;
        }

        const propAccess = getAncestor(token, SyntaxKind.PropertyAccessExpression) as PropertyAccessExpression | undefined;
        if (!propAccess) {
            return undefined;
        }

        const parent = propAccess.parent;
        if (!isAssignmentExpression(parent) || parent.right.kind !== SyntaxKind.ObjectLiteralExpression) {
            return undefined;
        }

        checker = context.program.getTypeChecker();
        const symbol = checker.getSymbolAtLocation(propAccess.expression);
        if (!symbol || !symbol.valueDeclaration) {
            return undefined;
        }

        const containingStatement = getAncestorWhere(symbol.valueDeclaration, isStatement);
        const declaration = tryGetClassOrFunction(symbol.valueDeclaration);
        if (!declaration) {
            return undefined;
        }

        let extendsClause;
        if (isClassLike(declaration)) {
            extendsClause = getClassExtendsHeritageClauseElement(declaration);

            if (!extendsClause) {
                return undefined;
            }
            const extendsExpression = extendsClause.expression
            if (!isIdentifier(extendsExpression) && !isPropertyAccessExpression(extendsExpression)) {
                return undefined;
            }
        }

        //const defaultExport = context.program.getTypeChecker().tryGetMemberInModuleExports("default", context.sourceFile.symbol);

        //const nameBase = defaultExport === symbol ?
        //    "Props" :
        //    "PropsProps" // TODO
        //    //(declaration.name as Identifier).text + "Props";
        //const name = createUniqueName(nameBase);
        const identifierName = createUniqueName("Props");
        const result = shapeToObjectType(parent.right, identifierName);

        // TODO: This currently doesn't work - probably because there's some sharing of nodes.
        //const changeTracker = textChanges.ChangeTracker.fromCodeFixContext(context);
        //changeTracker.insertNodeBefore(context.sourceFile, declaration.getFirstToken(context.sourceFile), result, {
        //    suffix: context.newLineCharacter + context.newLineCharacter,
        //});
        const printer = createPrinter();
        const typeDeclaration =
            context.newLineCharacter +
            context.newLineCharacter +
            printer.printNode(EmitHint.Unspecified, result, context.sourceFile) +
            context.newLineCharacter;

        // TODO: skip whitespace but not comments.
        const resultChanges = [{ newText: typeDeclaration, span: { start: containingStatement.getFullStart(), length: 0 } }];

        if (isFunctionLike(declaration) && declaration.parameters.length === 1 && !declaration.parameters[0].type) {
            if (isVariableDeclaration(declaration.parent)) {
                // TODO: Ensure type-checking for React.Component type.
                const varDecl = declaration.parent;

                if (!varDecl.type) {
                    resultChanges.push({
                        newText: `: React.StatelessComponent<${printTypeName()}>`,
                        span: { start: varDecl.name.end, length: 0 },
                    })
                }
            }
            else {
                const annotation = ": " + printTypeName();
                resultChanges.push({
                    newText: annotation,
                    span: { start: declaration.parameters[0].name.end, length: 0 },
                });
            }
        }
        else if (isClassLike(declaration)) {
            if (extendsClause.typeArguments) {
                const typeArg = firstOrUndefined(extendsClause.typeArguments)!;
                resultChanges.push({
                    newText: printTypeName(),
                    span: {
                        start: typeArg.getStart(),
                        length: typeArg.getWidth(),
                    }
                })
            }
            else {
                const typeArguments = [createTypeReferenceNode(identifierName)]
                const replacementNode = createExpressionWithTypeArguments(typeArguments, extendsClause.expression);
                const replacement = printer.printNode(EmitHint.Unspecified, replacementNode, context.sourceFile);
                resultChanges.push({
                    newText: replacement,
                    span: {
                        start: extendsClause.getStart(),
                        length: extendsClause.getWidth(),
                    }
                })
            }
        }

        return [
            {
                description: "Extract type declaration from 'propTypes'.",
                changes: [
                    { fileName: context.sourceFile.path, textChanges: resultChanges }
                ]
                //changes: changeTracker.getChanges(),
            }
        ];

        function printTypeName() {
            return printer.printNode(EmitHint.Unspecified, identifierName, context.sourceFile);
        }
    }

    let checker: TypeChecker;

    let _anyFunctionTypeNode;
    let _anyArrayTypeNode;
    function getAnyArrayTypeNode() {
        _anyArrayTypeNode = createArrayTypeNode(createKeywordTypeNode(SyntaxKind.AnyKeyword))
        return _anyArrayTypeNode;
    }
    function getAnyFunctionTypeNode() {
        const param = createParameter(
            /*decorators*/ undefined,
            /*modifiers*/ undefined,
            createToken(SyntaxKind.DotDotDotToken),
            "args",
            /*questionToken*/ undefined,
            getAnyArrayTypeNode());
        _anyFunctionTypeNode = createFunctionTypeNode(
                /*typeParameters*/ undefined,
                /*parameters*/[param],
                /*type*/ createKeywordTypeNode(SyntaxKind.AnyKeyword));
        return _anyFunctionTypeNode;
    }

    function createPropTypeFromRootProperty(name: string) {
        switch (name) {
            case "bool":
                return createKeywordTypeNode(SyntaxKind.BooleanKeyword);
            case "number":
                return createKeywordTypeNode(SyntaxKind.NumberKeyword);
            case "string":
                return createKeywordTypeNode(SyntaxKind.StringKeyword);
            case "object":
                return createKeywordTypeNode(SyntaxKind.ObjectKeyword);
            case "symbol":
                return createKeywordTypeNode(SyntaxKind.SymbolKeyword);
            case "any":
                return createKeywordTypeNode(SyntaxKind.AnyKeyword);
            case "array":
                return getAnyArrayTypeNode();
            case "node":
                // TODO: React.ReactChild and import if necessary
                return createKeywordTypeNode(SyntaxKind.AnyKeyword);
            case "element":
                // TODO: React.ReactElement and import if necessary
                return createKeywordTypeNode(SyntaxKind.ObjectKeyword);

            case "func":
                return getAnyFunctionTypeNode();
        }
        return createKeywordTypeNode(SyntaxKind.AnyKeyword);
    }

    function propTypeToType(expr: ts.Expression): TypeNode {
        while (expr.kind === SyntaxKind.ParenthesizedExpression) {
            expr = (expr as ParenthesizedExpression).expression;
        }

        switch (expr.kind) {
            case ts.SyntaxKind.PropertyAccessExpression:
                const { expression: left, name } = expr as PropertyAccessExpression;
                if (name.text === "isRequired") {
                    return propTypeToType(left);
                }
                if (isPropTypesRoot(left)) {
                    return createPropTypeFromRootProperty(name.text);
                }
                return createKeywordTypeNode(SyntaxKind.AnyKeyword);
            case ts.SyntaxKind.CallExpression:
                const { expression: callTarget, arguments: args } = (expr as ts.CallExpression);
                if (callTarget.kind === ts.SyntaxKind.PropertyAccessExpression) {
                    const calledPropType = (callTarget as ts.PropertyAccessExpression).name;
                    return propTypeCallToType(calledPropType.text, args);
                }
        }
        return createKeywordTypeNode(SyntaxKind.AnyKeyword);
    }

    /**
     * Creates an literal type if given an object literal, or the `object` type otherwise.
     */
    function shapeToObjectType(arg: ts.Expression): TypeLiteralNode | KeywordTypeNode;
    /**
     * Creates an interface declaration if given an object literal, or a type alias to `object` otherwise.
     */
    function shapeToObjectType(arg: ts.Expression, declarationName: Identifier): InterfaceDeclaration | TypeAliasDeclaration;
    function shapeToObjectType(arg: ts.Expression, declarationName?: Identifier) {
        if (arg.kind !== SyntaxKind.ObjectLiteralExpression) {
            const fallbackType = createKeywordTypeNode(SyntaxKind.ObjectKeyword);
            if (declarationName) {
                return createTypeAliasDeclaration(declarationName, /*typeParameters*/ undefined, fallbackType);
            }
            return fallbackType;
        }

        const obj = arg as ObjectLiteralExpression;
        const props = [];
        for (const prop of obj.properties) {
            const propDecl = propTypesPropertyToObjectTypeProperty(prop);
            if (propDecl) {
                props.push(propDecl);
            }
        }

        if (declarationName) {
            return createInterfaceDeclaration(
                /*decorators*/ undefined,
                /*modifiers*/[createToken(SyntaxKind.ExportKeyword)],
                declarationName,
                /*typeParameters*/ undefined,
                /*typeParameters*/ undefined,
                props,
            )
        }
        return createTypeLiteralNode(props);
    }

    function propTypesPropertyToObjectTypeProperty(prop: ObjectLiteralElementLike): PropertySignature | undefined {
        if (!prop.name || prop.name.kind !== ts.SyntaxKind.Identifier) {
            return undefined;
        }
        if (!isPropertyAssignment(prop)) {
            return createPropertySignature(
                prop.name,
                createToken(SyntaxKind.QuestionToken),
                createKeywordTypeNode(SyntaxKind.AnyKeyword),
                /*initializer*/ undefined);
        }
        let isOptional = true;
        let expr = prop.initializer;
        if (isRequiredProperty(expr)) {
            isOptional = false;
        }

        const typeOfProperty = propTypeToType(expr);
        return createPropertySignature(
            prop.name,
            isOptional ? createToken(SyntaxKind.QuestionToken) : undefined,
            typeOfProperty,
            /*initializer*/ undefined,
        );
    }

    function isRequiredProperty(node: ts.Expression) {
        return node.kind === ts.SyntaxKind.PropertyAccessExpression && (node as ts.PropertyAccessExpression).name.text === "isRequired";
    }

    /**
     * `true` if any of th
     */
    function isPropTypesRoot(expr: ts.Expression) {
        // TODO: Actually verify these things come from React using types!
        if (expr.kind === ts.SyntaxKind.Identifier && (expr as Identifier).text === "PropTypes") {
            return true;
        }

        if (expr.kind !== SyntaxKind.PropertyAccessExpression) {
            return false;
        }
        const propAccess = expr as PropertyAccessExpression;
        return propAccess.name.text == "PropTypes" &&
            isIdentifier(propAccess.expression) &&
            propAccess.expression.text === "React";
    }

    function propTypeCallToType(accessedName: string, args: ts.Expression[]) {
        if (args.length < 1) {
            return createKeywordTypeNode(SyntaxKind.AnyKeyword);
        }
        switch (accessedName) {
            case "instanceOf":
                const ctor = args[0];
                return tryGetConstructedType(ctor);
            case "oneOf":
                // PropTypes.oneOf(['News', 'Photos', 42, (43)]),
                return oneOfValueOrTypeToType(args[0], valueToType);
            case "oneOfType":
                // PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Message)])
                return oneOfValueOrTypeToType(args[0], propTypeToType);
            case "arrayOf":
                const elementType = propTypeToType(args[0]);
                return createArrayTypeNode(elementType);
            case "objectOf":
                const outputType = propTypeToType(args[0]);
                const typeArgs = [
                    ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
                    outputType
                ];
                return createTypeReferenceNode("Record", typeArgs);
            case "shape":
                return shapeToObjectType(args[0]);
        }
        return createKeywordTypeNode(SyntaxKind.AnyKeyword);
    }

    /**
     * If given an identifier, returns a local type reference to the given
     */
    function tryGetConstructedType(expr: ts.Expression) {
        // TODO: Support property accesses which can be converted into qualified names.
        if (expr.kind === ts.SyntaxKind.Identifier && checker.getTypeAtLocation(expr).getConstructSignatures().length) {
            return createTypeReferenceNode(expr as Identifier);
        }
        return createKeywordTypeNode(SyntaxKind.ObjectKeyword);
    }

    function oneOfValueOrTypeToType(arg: ts.Expression, mapper: (expr: Expression) => TypeNode) {
        if (!isArrayLiteralExpression(arg)) {
            return createKeywordTypeNode(SyntaxKind.AnyKeyword);
        }
        const propTypes = arg.elements;
        const actualTypes = propTypes.map(mapper);
        return ts.createUnionOrIntersectionTypeNode(ts.SyntaxKind.UnionType, actualTypes);
    }

    /**
     * Attempts to unwrap literal
     */
    function valueToType(expr: Expression): TypeNode {
        while (expr.kind === SyntaxKind.ParenthesizedExpression) {
            expr = (expr as ParenthesizedExpression).expression;
        }
        switch (expr.kind) {
            case ts.SyntaxKind.StringLiteral:
            case ts.SyntaxKind.NumericLiteral:
            case ts.SyntaxKind.TrueKeyword:
            case ts.SyntaxKind.FalseKeyword:
            case ts.SyntaxKind.UndefinedKeyword:
            case ts.SyntaxKind.NullKeyword:
                return createLiteralTypeNode(expr);
        }

        // Try to create a type query (i.e. `typeof some.expr`) if the expression isn't simple.
        const entityName = tryGetEntityNameFromExpression(expr);
        if (entityName) {
            return createTypeQueryNode(entityName);
        }

        return createKeywordTypeNode(SyntaxKind.AnyKeyword);
    }

    /**
     * A property access can be expressed as an entity name if its root expression is an identifier.
     *
     * Potential improvement: this is somewhat limited now.
     * Some expressions may be more complex, but still expressible with an EntityName.
     * We can be more general if we leverage the type system to get this.
     *
     * TL;DR: Experiment with `TypeChecker#typeToString`.
     */
    function tryGetEntityNameFromExpression(expr: Expression): EntityName | undefined {
        if (isIdentifier(expr)) {
            return expr;
        }
        if (isPropertyAccessExpression(expr)) {
            const entityName = tryGetEntityNameFromExpression(expr.expression);
            if (entityName) {
                return createQualifiedName(entityName, expr.name);
            }
        }
        return undefined;
    }

    function tryGetClassOrFunction(node: Node): ClassLikeDeclaration | FunctionLikeDeclaration | undefined {
        if (isClassLike(node) || isFunctionLike(node)) {
            return node;
        }
        if (isVariableDeclaration(node)) {
            return tryGetClassOrFunction(node.initializer);
        }
        if (node.kind === SyntaxKind.ParenthesizedExpression) {
            return tryGetClassOrFunction((node as ParenthesizedExpression).expression);
        }
        return undefined;
    }
}