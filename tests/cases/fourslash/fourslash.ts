// Welcome to the FourSlash syntax guide!

// A line in the source text is indicated by four slashes (////)
// Tip: Hit Ctrl-K Ctrl-C Ctrl-K Ctrl-C to prefix-slash any selected block of text in Visual Studio
//// This is a line in the source text!
// Files are terminated by any entirely blank line (e.g.
// interspersed //-initiated comments are allowed)

// You can indicate a 'marker' with /**/
//// function./**/
// ... goTo.marker();

// Optionally, markers may have names:
//// function.go(/*1*/x, /*2*/y);
// goTo.marker('1');
// Marker names may consist of any alphanumeric characters

// File metadata must occur directly before the first line of source text
// and is indicated by an @ symbol:
// @Filename: lib.d.ts
//// this is the first line of my file

// Global options may appear anywhere
// @Module: Node
// @Target: ES5

// In the imperative section, you can write any valid TypeScript code.

//---------------------------------------
// For API editors:
// When editting this file, and only while editing this file, enable the reference comments
// and comment out the declarations in this section to get proper type information.
// Undo these changes before compiling/committing/editing any other fourslash tests.
// The test suite will likely crash if you try 'jake runtests' with reference comments enabled.
//
// Explanation:
// We want type-completion while we edit this file, but at compile time/while editting fourslash tests,
// we don't want to include the following reference because we are compiling this file in "--out" mode and don't want to rope
// in the entire codebase into the compilation each fourslash test. Additionally, we don't want to expose the
// src/harness/fourslash.ts API's (or the rest of the compiler) because they are unstable and complicate the
// fourslash testing DSL. Finally, in this case, runtime reflection is (much) faster.
//
// TODO: figure out a better solution to the API exposure problem.

/// <reference path="../../../src/compiler/diagnosticInformationMap.generated.ts" />

declare module ts {
    export type MapKey = string | number;
    export interface Map<T> {
        forEach(action: (value: T, key: string) => void): void;
        get(key: MapKey): T;
        has(key: MapKey): boolean;
        set(key: MapKey, value: T): this;
        delete(key: MapKey): boolean;
        clear(): void;
    }

    interface SymbolDisplayPart {
        text: string;
        kind: string;
    }

    enum IndentStyle {
        None = 0,
        Block = 1,
        Smart = 2,
    }

    const enum InlayHintKind {
        Type = "Type",
        Parameter = "Parameter",
        Enum = "Enum",
    }

    enum SemicolonPreference {
        Ignore = "ignore",
        Insert = "insert",
        Remove = "remove",
    }

    interface OutputFile {
        name: string;
        writeByteOrderMark: boolean;
        text: string;
    }

    enum DiagnosticCategory {
        Warning,
        Error,
        Suggestion,
        Message
    }

    interface DiagnosticMessage {
        key: string;
        category: DiagnosticCategory;
        code: number;
        message: string;
        reportsUnnecessary?: {};
    }

    interface LineAndCharacter {
        line: number;
        character: number;
    }

    interface CompletionEntryData {
        fileName?: string;
        ambientModuleName?: string;
        isPackageJsonImport?: true;
        exportName: string;
    }

    interface CompilerOptions {
        module?: string;
        target?: string;
        jsx?: string;
        allowJs?: boolean;
        maxNodeModulesJsDepth?: number;
        strictNullChecks?: boolean;
        sourceMap?: boolean;
        allowSyntheticDefaultImports?: boolean;
        allowNonTsExtensions?: boolean;
        resolveJsonModule?: boolean;
        [key: string]: string | number | boolean | undefined;
    }

    function flatMap<T, U>(array: ReadonlyArray<T>, mapfn: (x: T, i: number) => U | ReadonlyArray<U> | undefined): U[];
}

declare namespace FourSlashInterface {
    interface Marker {
        fileName: string;
        position: number;
        data?: any;
    }
    enum IndentStyle {
        None = 0,
        Block = 1,
        Smart = 2,
    }
    interface EditorOptions {
        BaseIndentSize?: number,
        IndentSize: number;
        TabSize: number;
        NewLineCharacter: string;
        ConvertTabsToSpaces: boolean;
    }
    interface EditorSettings {
        baseIndentSize?: number;
        indentSize?: number;
        tabSize?: number;
        newLineCharacter?: string;
        convertTabsToSpaces?: boolean;
        indentStyle?: IndentStyle;
        trimTrailingWhitespace?: boolean;
    }
    interface FormatCodeOptions extends EditorOptions {
        InsertSpaceAfterCommaDelimiter: boolean;
        InsertSpaceAfterSemicolonInForStatements: boolean;
        InsertSpaceBeforeAndAfterBinaryOperators: boolean;
        InsertSpaceAfterKeywordsInControlFlowStatements: boolean;
        InsertSpaceAfterFunctionKeywordForAnonymousFunctions: boolean;
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: boolean;
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: boolean;
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyBraces: boolean;
        InsertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces: boolean;
        InsertSpaceAfterTypeAssertion: boolean;
        PlaceOpenBraceOnNewLineForFunctions: boolean;
        PlaceOpenBraceOnNewLineForControlBlocks: boolean;
        insertSpaceBeforeTypeAnnotation: boolean;
        [s: string]: boolean | number | string | undefined;
    }
    interface FormatCodeSettings extends EditorSettings {
        readonly insertSpaceAfterCommaDelimiter?: boolean;
        readonly insertSpaceAfterSemicolonInForStatements?: boolean;
        readonly insertSpaceBeforeAndAfterBinaryOperators?: boolean;
        readonly insertSpaceAfterConstructor?: boolean;
        readonly insertSpaceAfterKeywordsInControlFlowStatements?: boolean;
        readonly insertSpaceAfterFunctionKeywordForAnonymousFunctions?: boolean;
        readonly insertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis?: boolean;
        readonly insertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets?: boolean;
        readonly insertSpaceAfterOpeningAndBeforeClosingNonemptyBraces?: boolean;
        readonly insertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces?: boolean;
        readonly insertSpaceAfterOpeningAndBeforeClosingJsxExpressionBraces?: boolean;
        readonly insertSpaceAfterTypeAssertion?: boolean;
        readonly insertSpaceBeforeFunctionParenthesis?: boolean;
        readonly placeOpenBraceOnNewLineForFunctions?: boolean;
        readonly placeOpenBraceOnNewLineForControlBlocks?: boolean;
        readonly insertSpaceBeforeTypeAnnotation?: boolean;
        readonly indentMultiLineObjectLiteralBeginningOnBlankLine?: boolean;
        readonly semicolons?: ts.SemicolonPreference;
    }
    interface Range {
        fileName: string;
        pos: number;
        end: number;
        marker?: Marker;
    }
    interface TextSpan {
        start: number;
        end: number;
    }
    class test_ {
        markers(): Marker[];
        markerNames(): string[];
        markerName(m: Marker): string;
        marker(name?: string): Marker;
        ranges(): Range[];
        rangesInFile(fileName?: string): Range[];
        spans(): Array<{ start: number, length: number }>;
        rangesByText(): ts.Map<Range[]>;
        markerByName(s: string): Marker;
        symbolsInScope(range: Range): any[];
        setTypesRegistry(map: { [key: string]: void }): void;
    }
    class config {
        configurePlugin(pluginName: string, configuration: any): void;
        setCompilerOptionsForInferredProjects(options: ts.CompilerOptions)
    }
    class goTo {
        marker(name?: string | Marker): void;
        eachMarker(markers: ReadonlyArray<string>, action: (marker: Marker, index: number) => void): void;
        eachMarker(action: (marker: Marker, index: number) => void): void;
        rangeStart(range: Range): void;
        eachRange(action: (range: Range) => void): void;
        bof(): void;
        eof(): void;
        implementation(): void;
        position(position: number, fileIndex?: number): any;
        position(position: number, fileName?: string): any;
        position(lineAndCharacter: ts.LineAndCharacter, fileName?: string): void;
        file(index: number, content?: string, scriptKindName?: string): any;
        file(name: string, content?: string, scriptKindName?: string): any;
        select(startMarker: string, endMarker: string): void;
        selectRange(range: Range): void;
        /**
         * Selects a line at a given index, not including any newline characters.
         * @param index 0-based
         */
        selectLine(index: number): void;
    }
    class verifyNegatable {
        private negative;
        not: verifyNegatable;
        allowedClassElementKeywords: string[];
        allowedConstructorParameterKeywords: string[];
        constructor(negative?: boolean);
        errorExistsBetweenMarkers(startMarker: string, endMarker: string): void;
        errorExistsAfterMarker(markerName?: string): void;
        errorExistsBeforeMarker(markerName?: string): void;
        quickInfoExists(): void;
        typeDefinitionCountIs(expectedCount: number): void;
        implementationListIsEmpty(): void;
        isValidBraceCompletionAtPosition(openingBrace?: string): void;
        jsxClosingTag(map: { [markerName: string]: { readonly newText: string } | undefined }): void;
        isInCommentAtPosition(onlyMultiLineDiverges?: boolean): void;
        codeFix(options: {
            description: string | [string, ...(string | number)[]] | DiagnosticIgnoredInterpolations,
            newFileContent?: NewFileContent,
            newRangeContent?: string,
            errorCode?: number,
            index?: number,
            preferences?: UserPreferences,
            applyChanges?: boolean,
            commands?: {}[],
        });
        codeFixAvailable(options?: ReadonlyArray<VerifyCodeFixAvailableOptions> | string): void;
        codeFixAllAvailable(fixName: string): void;
        applicableRefactorAvailableAtMarker(markerName: string): void;
        codeFixDiagnosticsAvailableAtMarkers(markerNames: string[], diagnosticCode?: number): void;
        applicableRefactorAvailableForRange(): void;

        refactorAvailable(name: string, actionName?: string): void;
        refactorAvailableForTriggerReason(triggerReason: RefactorTriggerReason, name: string, action?: string): void;
        refactorKindAvailable(refactorKind: string, expected: string[], preferences?: {}): void;
    }
    class verify extends verifyNegatable {
        assertHasRanges(ranges: Range[]): void;
        caretAtMarker(markerName?: string): void;
        completions(...options: CompletionsOptions[]): void;
        applyCodeActionFromCompletion(markerName: string, options: {
            name: string,
            source?: string,
            data?: ts.CompletionEntryData,
            description: string,
            newFileContent?: string,
            newRangeContent?: string,
            preferences?: UserPreferences,
        });
        indentationIs(numberOfSpaces: number): void;
        indentationAtPositionIs(fileName: string, position: number, numberOfSpaces: number, indentStyle?: ts.IndentStyle, baseIndentSize?: number): void;
        textAtCaretIs(text: string): void;
        /**
         * Compiles the current file and evaluates 'expr' in a context containing
         * the emitted output, then compares (using ===) the result of that expression
         * to 'value'. Do not use this function with external modules as it is not supported.
         */
        eval(expr: string, value: any): void;
        currentLineContentIs(text: string): void;
        currentFileContentIs(text: string): void;
        formatDocumentChangesNothing(): void;
        /** Verifies that goToDefinition at the current position would take you to `endMarker`. */
        goToDefinitionIs(endMarkers: ArrayOrSingle<string>): void;
        goToDefinitionName(name: string, containerName: string): void;
        /**
         * `verify.goToDefinition("a", "b");` verifies that go-to-definition at marker "a" takes you to marker "b".
         * `verify.goToDefinition(["a", "aa"], "b");` verifies that markers "a" and "aa" have the same definition "b".
         * `verify.goToDefinition("a", ["b", "bb"]);` verifies that "a" has multiple definitions available.
         */
        goToDefinition(startMarkerNames: ArrayOrSingle<string>, fileResult: { file: string, unverified?: boolean }): void;
        goToDefinition(startMarkerNames: ArrayOrSingle<string>, endMarkerNames: ArrayOrSingle<string | { marker: string, unverified?: boolean }>): void;
        goToDefinition(startMarkerNames: ArrayOrSingle<string>, endMarkerNames: ArrayOrSingle<string>, range: Range): void;
        /** Performs `goToDefinition` for each pair. */
        goToDefinition(startsAndEnds: [ArrayOrSingle<string>, ArrayOrSingle<string>][]): void;
        /** Performs `goToDefinition` on each key and value. */
        goToDefinition(startsAndEnds: { [startMarkerName: string]: ArrayOrSingle<string> }): void;
        /** Verifies goToDefinition for each `${markerName}Reference` -> `${markerName}Definition` */
        goToDefinitionForMarkers(...markerNames: string[]): void;
        goToType(startsAndEnds: { [startMarkerName: string]: ArrayOrSingle<string> }): void;
        goToType(startMarkerNames: ArrayOrSingle<string>, endMarkerNames: ArrayOrSingle<string>): void;
        verifyGetEmitOutputForCurrentFile(expected: string): void;
        verifyGetEmitOutputContentsForCurrentFile(expected: ts.OutputFile[]): void;
        baselineFindAllReferences(...markerNames: string[]): void;
        baselineGetFileReferences(fileName: string): void;
        symbolAtLocation(startRange: Range, ...declarationRanges: Range[]): void;
        typeOfSymbolAtLocation(range: Range, symbol: any, expected: string): void;
        /** @deprecated Use baselineFindAllReferences instead */
        singleReferenceGroup(definition: ReferencesDefinition, ranges?: Range[] | string): void;
        rangesAreOccurrences(isWriteAccess?: boolean, ranges?: Range[]): void;
        rangesWithSameTextAreRenameLocations(...texts: string[]): void;
        rangesAreRenameLocations(options?: Range[] | { findInStrings?: boolean, findInComments?: boolean, ranges?: Range[], providePrefixAndSuffixTextForRename?: boolean });
        findReferencesDefinitionDisplayPartsAtCaretAre(expected: ts.SymbolDisplayPart[]): void;
        noSignatureHelp(...markers: (string | Marker)[]): void;
        noSignatureHelpForTriggerReason(triggerReason: SignatureHelpTriggerReason, ...markers: (string | Marker)[]): void
        signatureHelpPresentForTriggerReason(triggerReason: SignatureHelpTriggerReason, ...markers: (string | Marker)[]): void
        signatureHelp(...options: VerifySignatureHelpOptions[], ): void;
        // Checks that there are no compile errors.
        noErrors(): void;
        errorExistsAtRange(range: Range, code: number, message?: string): void;
        numberOfErrorsInCurrentFile(expected: number): void;
        baselineCurrentFileBreakpointLocations(): void;
        baselineCurrentFileNameOrDottedNameSpans(): void;
        baselineGetEmitOutput(insertResultsIntoVfs?: boolean): void;
        baselineSyntacticDiagnostics(): void;
        baselineSyntacticAndSemanticDiagnostics(): void;
        getEmitOutput(expectedOutputFiles: ReadonlyArray<string>): void;
        baselineCompletions(): void;
        baselineQuickInfo(): void;
        baselineSmartSelection(): void;
        baselineSignatureHelp(): void;
        nameOrDottedNameSpanTextIs(text: string): void;
        outliningSpansInCurrentFile(spans: Range[], kind?: "comment" | "region" | "code" | "imports"): void;
        outliningHintSpansInCurrentFile(spans: Range[]): void;
        todoCommentsInCurrentFile(descriptors: string[]): void;
        matchingBracePositionInCurrentFile(bracePosition: number, expectedMatchPosition: number): void;
        noMatchingBracePositionInCurrentFile(bracePosition: number): void;
        docCommentTemplateAt(markerName: string | FourSlashInterface.Marker, expectedOffset: number, expectedText: string, options?: VerifyDocCommentTemplateOptions): void;
        noDocCommentTemplateAt(markerName: string | FourSlashInterface.Marker): void;
        rangeAfterCodeFix(expectedText: string, includeWhiteSpace?: boolean, errorCode?: number, index?: number): void;
        codeFixAll(options: { fixId: string, fixAllDescription: string, newFileContent: NewFileContent, commands?: {}[] }): void;
        fileAfterApplyingRefactorAtMarker(markerName: string, expectedContent: string, refactorNameToApply: string, actionName: string, formattingOptions?: FormatCodeOptions): void;
        rangeIs(expectedText: string, includeWhiteSpace?: boolean): void;
        fileAfterApplyingRefactorAtMarker(markerName: string, expectedContent: string, refactorNameToApply: string, formattingOptions?: FormatCodeOptions): void;
        getAndApplyCodeFix(errorCode?: number, index?: number): void;
        importFixAtPosition(expectedTextArray: string[], errorCode?: number, options?: UserPreferences): void;
        importFixModuleSpecifiers(marker: string, moduleSpecifiers: string[], options?: UserPreferences): void;

        navigationBar(json: any, options?: { checkSpans?: boolean }): void;
        navigationTree(json: any, options?: { checkSpans?: boolean }): void;
        navigateTo(...options: VerifyNavigateToOptions[]);
        occurrencesAtPositionContains(range: Range, isWriteAccess?: boolean): void;
        occurrencesAtPositionCount(expectedCount: number): void;
        rangesAreDocumentHighlights(ranges?: Range[], options?: VerifyDocumentHighlightsOptions): void;
        rangesWithSameTextAreDocumentHighlights(): void;
        documentHighlightsOf(startRange: Range, ranges: Range[], options?: VerifyDocumentHighlightsOptions): void;
        /** Prefer semanticClassificationsAre for more descriptive tests */
        encodedSemanticClassificationsLength(format: "original" | "2020", length: number)
        /**
         * This method *requires* a contiguous, complete, and ordered stream of classifications for a file.
         */
        syntacticClassificationsAre(...classifications: {
            classificationType: string;
            text?: string;
        }[]): void;
        /**
         * This method *requires* an ordered stream of classifications for a file, and spans are highly recommended.
         */
        semanticClassificationsAre(format: "original" | "2020", ...classifications: {
            classificationType: string | number;
            text?: string;
            textSpan?: TextSpan;
        }[]): void;
        /** Edits the current testfile and replaces with the semantic classifications */
        replaceWithSemanticClassifications(format: "2020")
        renameInfoSucceeded(displayName?: string, fullDisplayName?: string, kind?: string, kindModifiers?: string, fileToRename?: string, range?: Range, allowRenameOfImportPath?: boolean): void;
        renameInfoFailed(message?: string, allowRenameOfImportPath?: boolean): void;
        renameLocations(startRanges: ArrayOrSingle<Range>, options: RenameLocationsOptions): void;
        baselineRename(marker: string, options: RenameOptions): void;

        /** Verify the quick info available at the current marker. */
        quickInfoIs(expectedText: string, expectedDocumentation?: string, expectedTags?: { name: string; text: string; }[]): void;
        /** Goto a marker and call `quickInfoIs`. */
        quickInfoAt(markerName: string | Range, expectedText?: string, expectedDocumentation?: string, expectedTags?: { name: string; text: string; }[]): void;
        /**
         * Call `quickInfoAt` for each pair in the object.
         * (If the value is an array, it is [expectedText, expectedDocumentation].)
         */
        quickInfos(namesAndTexts: { [name: string]: string | [string, string] }): void;
        verifyQuickInfoDisplayParts(kind: string, kindModifiers: string, textSpan: {
            start: number;
            length: number;
        }, displayParts: ts.SymbolDisplayPart[], documentation: ts.SymbolDisplayPart[], tags: { name: string, text?: string }[] | undefined): void;
        getInlayHints(expected: readonly VerifyInlayHintsOptions[], textSpan?: {
            start: number;
            length: number;
        }, preference?: InlayHintsOptions);
        getSyntacticDiagnostics(expected: ReadonlyArray<Diagnostic>): void;
        getSemanticDiagnostics(expected: ReadonlyArray<Diagnostic>): void;
        getSuggestionDiagnostics(expected: ReadonlyArray<Diagnostic>): void;
        ProjectInfo(expected: string[]): void;
        allRangesAppearInImplementationList(markerName: string): void;
        getEditsForFileRename(options: {
            readonly oldPath: string;
            readonly newPath: string;
            readonly newFileContents: { readonly [fileName: string]: string };
            readonly preferences?: UserPreferences;
        }): void;
        baselineCallHierarchy(): void;
        moveToNewFile(options: {
            readonly newFileContents: { readonly [fileName: string]: string };
            readonly preferences?: UserPreferences;
        }): void;
        noMoveToNewFile(): void;

        generateTypes(...options: GenerateTypesOptions[]): void;

        organizeImports(newContent: string): void;

        toggleLineComment(newFileContent: string): void;
        toggleMultilineComment(newFileContent: string): void;
        commentSelection(newFileContent: string): void;
        uncommentSelection(newFileContent: string): void;
    }
    class edit {
        backspace(count?: number): void;
        deleteAtCaret(times?: number): void;
        replace(start: number, length: number, text: string): void;
        paste(text: string): void;
        insert(text: string): void;
        insertLine(text: string): void;
        insertLines(...lines: string[]): void;
        /** @param index 0-based */
        deleteLine(index: number): void;
        /**
         * @param startIndex 0-based
         * @param endIndexInclusive 0-based
         */
        deleteLineRange(startIndex: number, endIndexInclusive: number): void;
        /** @param index 0-based */
        replaceLine(index: number, text: string): void;
        moveRight(count?: number): void;
        moveLeft(count?: number): void;
        enableFormatting(): void;
        disableFormatting(): void;

        applyRefactor(options: { refactorName: string, actionName: string, actionDescription: string, newContent: NewFileContent, triggerReason?: RefactorTriggerReason }): void;
    }
    class debug {
        printCurrentParameterHelp(): void;
        printCurrentFileState(): void;
        printCurrentFileStateWithWhitespace(): void;
        printCurrentFileStateWithoutCaret(): void;
        printCurrentQuickInfo(): void;
        printCurrentSignatureHelp(): void;
        printCompletionListMembers(options?: { includeExternalModuleExports: boolean }): void;
        printAvailableCodeFixes(): void;
        printBreakpointLocation(pos: number): void;
        printBreakpointAtCurrentLocation(): void;
        printNameOrDottedNameSpans(pos: number): void;
        printErrorList(): void;
        printNavigationBar(): void;
        printNavigationItems(searchValue?: string): void;
        printScriptLexicalStructureItems(): void;
        printOutliningSpans(): void;
        printReferences(): void;
        printContext(): void;
    }
    class format {
        document(): void;
        copyFormatOptions(): FormatCodeOptions;
        setFormatOptions(options: FormatCodeOptions | FormatCodeSettings): any;
        selection(startMarker: string, endMarker: string): void;
        onType(posMarker: string, key: string): void;
        setOption(name: keyof FormatCodeOptions, value: number | string | boolean): void;
    }
    class cancellation {
        resetCancelled(): void;
        setCancelled(numberOfCalls?: number): void;
    }

    interface ModernClassificationFactory {
        semanticToken(identifier: string, name: string)
    }

    interface ClassificationFactory {
        comment(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        identifier(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        keyword(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        numericLiteral(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        operator(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        stringLiteral(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        whiteSpace(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        text(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        punctuation(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        docCommentTagName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        className(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        enumName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        interfaceName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        moduleName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        typeParameterName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        parameterName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        typeAliasName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        jsxOpenTagName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        jsxCloseTagName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        jsxSelfClosingTagName(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        jsxAttribute(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        jsxText(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
        jsxAttributeStringLiteralValue(text: string, position?: number): {
            classificationType: string;
            text: string;
            textSpan?: TextSpan;
        };
    }

    interface ReferenceGroup {
        readonly definition: ReferencesDefinition;
        readonly ranges: ReadonlyArray<Range>;
    }
    type ReferencesDefinition = string | {
        text: string;
        range: Range;
    }
    interface Diagnostic {
        message: string;
        /** @default `test.ranges()[0]` */
        range?: Range;
        code: number;
        reportsUnnecessary?: true;
        reportsDeprecated?: true;
    }
    interface VerifyDocumentHighlightsOptions {
        filesToSearch?: ReadonlyArray<string>;
    }
    interface UserPreferences {
        readonly quotePreference?: "auto" | "double" | "single";
        readonly includeCompletionsForModuleExports?: boolean;
        readonly includeCompletionsForImportStatements?: boolean;
        readonly includeCompletionsWithSnippetText?: boolean;
        readonly includeCompletionsWithInsertText?: boolean;
        readonly includeCompletionsWithClassMemberSnippets?: boolean;
        readonly includeCompletionsWithObjectLiteralMethodSnippets?: boolean;
        readonly allowIncompleteCompletions?: boolean;
        /** @deprecated use `includeCompletionsWithInsertText` */
        readonly includeInsertTextCompletions?: boolean;
        readonly includeAutomaticOptionalChainCompletions?: boolean;
        readonly importModuleSpecifierPreference?: "shortest" | "project-relative" | "relative" | "non-relative";
        readonly importModuleSpecifierEnding?: "minimal" | "index" | "js";
        readonly jsxAttributeCompletionStyle?: "auto" | "braces" | "none";
    }
    interface InlayHintsOptions extends UserPreferences {
        readonly includeInlayParameterNameHints?: "none" | "literals" | "all";
        readonly includeInlayParameterNameHintsWhenArgumentMatchesName?: boolean;
        readonly includeInlayFunctionParameterTypeHints?: boolean;
        readonly includeInlayVariableTypeHints?: boolean;
        readonly includeInlayPropertyDeclarationTypeHints?: boolean;
        readonly includeInlayFunctionLikeReturnTypeHints?: boolean;
        readonly includeInlayEnumMemberValueHints?: boolean;
    }
    interface CompletionsOptions {
        readonly marker?: ArrayOrSingle<string | Marker>;
        readonly isNewIdentifierLocation?: boolean;
        readonly isGlobalCompletion?: boolean;
        readonly optionalReplacementSpan?: Range;
        /** Must provide all completion entries in order. */
        readonly exact?: ArrayOrSingle<ExpectedCompletionEntry>;
        /** Must provide all completion entries, but order doesn't matter. */
        readonly unsorted?: readonly ExpectedCompletionEntry[];
        readonly includes?: ArrayOrSingle<ExpectedCompletionEntry>;
        readonly excludes?: ArrayOrSingle<string>;
        readonly preferences?: UserPreferences;
        readonly triggerCharacter?: string;
    }
    type ExpectedCompletionEntry = string | ExpectedCompletionEntryObject;
    interface ExpectedCompletionEntryObject {
        readonly name: string;
        readonly source?: string;
        readonly insertText?: string;
        readonly replacementSpan?: Range;
        readonly hasAction?: boolean;
        readonly isRecommended?: boolean;
        readonly isFromUncheckedFile?: boolean;
        readonly kind?: string;
        readonly kindModifiers?: string;
        readonly sortText?: completion.SortText;
        readonly isPackageJsonImport?: boolean;
        readonly isSnippet?: boolean;

        // details
        readonly text?: string;
        readonly documentation?: string;
        readonly tags?: ReadonlyArray<JSDocTagInfo>;
        readonly sourceDisplay?: string;
    }

    interface VerifySignatureHelpOptions {
        marker?: ArrayOrSingle<string | Marker>;
        /** @default 1 */
        overloadsCount?: number;
        docComment?: string;
        text?: string;
        parameterName?: string;
        parameterSpan?: string;
        parameterDocComment?: string;
        parameterCount?: number;
        argumentCount?: number;
        isVariadic?: boolean;
        tags?: ReadonlyArray<JSDocTagInfo>;
        triggerReason?: SignatureHelpTriggerReason;
        overrideSelectedItemIndex?: number;
    }

    interface VerifyDocCommentTemplateOptions {
        generateReturnInDocTemplate?: boolean;
    }

    export type SignatureHelpTriggerReason =
        | SignatureHelpInvokedReason
        | SignatureHelpCharacterTypedReason
        | SignatureHelpRetriggeredReason;

    /**
     * Signals that the user manually requested signature help.
     * The language service will unconditionally attempt to provide a result.
     */
    export interface SignatureHelpInvokedReason {
        kind: "invoked",
        triggerCharacter?: undefined,
    }

    /**
     * Signals that the signature help request came from a user typing a character.
     * Depending on the character and the syntactic context, the request may or may not be served a result.
     */
    export interface SignatureHelpCharacterTypedReason {
        kind: "characterTyped",
        /**
         * Character that was responsible for triggering signature help.
         */
        triggerCharacter: string,
    }

    /**
     * Signals that this signature help request came from typing a character or moving the cursor.
     * This should only occur if a signature help session was already active and the editor needs to see if it should adjust.
     * The language service will unconditionally attempt to provide a result.
     * `triggerCharacter` can be `undefined` for a retrigger caused by a cursor move.
     */
    export interface SignatureHelpRetriggeredReason {
        kind: "retrigger",
        /**
         * Character that was responsible for triggering signature help.
         */
        triggerCharacter?: string,
    }

    export type RefactorTriggerReason = "implicit" | "invoked";

    export interface VerifyCodeFixAvailableOptions {
        readonly description: string;
        readonly actions?: ReadonlyArray<{ readonly type: string, readonly data: {} }>;
        readonly commands?: ReadonlyArray<{}>;
    }

    export interface VerifyInlayHintsOptions {
        text: string;
        position: number;
        kind?: ts.InlayHintKind;
        whitespaceBefore?: boolean;
        whitespaceAfter?: boolean;
    }

    interface VerifyNavigateToOptions {
        readonly pattern: string;
        readonly fileName?: string;
        readonly expected: ReadonlyArray<ExpectedNavigateToItem>;
    }
    interface ExpectedNavigateToItem {
        readonly name: string;
        readonly kind: string;
        readonly kindModifiers?: string; // default: ""
        readonly matchKind?: string; // default: "exact"
        readonly isCaseSensitive?: boolean; // default: "true"
        readonly range: Range;
        readonly containerName?: string; // default: ""
        readonly containerKind?: string; // default: ScriptElementKind.unknown
    }

    interface JSDocTagInfo {
        readonly name: string;
        readonly text: string | ts.SymbolDisplayPart[] | undefined;
    }

    interface GenerateTypesOptions {
        readonly name?: string;
        readonly value: unknown;
        readonly global?: boolean;
        readonly output?: string | undefined;
        readonly outputBaseline?: string;
    }

    type ArrayOrSingle<T> = T | ReadonlyArray<T>;
    type NewFileContent = string | { readonly [fileName: string]: string };

    type RenameLocationsOptions = ReadonlyArray<RenameLocationOptions> | {
        readonly findInStrings?: boolean;
        readonly findInComments?: boolean;
        readonly ranges: ReadonlyArray<RenameLocationOptions>;
        readonly providePrefixAndSuffixTextForRename?: boolean;
    };

    type RenameOptions = { readonly findInStrings?: boolean, readonly findInComments?: boolean, readonly providePrefixAndSuffixTextForRename?: boolean };
    type RenameLocationOptions = Range | { readonly range: Range, readonly prefixText?: string, readonly suffixText?: string };
    type DiagnosticIgnoredInterpolations = { template: string }
}
/** Wraps a diagnostic message to be compared ignoring interpolated strings */
declare function ignoreInterpolations(diagnostic: string | ts.DiagnosticMessage): FourSlashInterface.DiagnosticIgnoredInterpolations;
declare function verifyOperationIsCancelled(f: any): void;
declare var test: FourSlashInterface.test_;
declare var config: FourSlashInterface.config;
declare var goTo: FourSlashInterface.goTo;
declare var verify: FourSlashInterface.verify;
declare var edit: FourSlashInterface.edit;
declare var debug: FourSlashInterface.debug;
declare var format: FourSlashInterface.format;
declare var cancellation: FourSlashInterface.cancellation;
declare function classification(format: "original"): FourSlashInterface.ClassificationFactory;
declare function classification(format: "2020"): FourSlashInterface.ModernClassificationFactory;
declare namespace completion {
    type Entry = FourSlashInterface.ExpectedCompletionEntryObject;
    interface GlobalsPlusOptions {
        noLib?: boolean;
    }
    export type SortText = string & { __sortText: any };
    export const SortText: {
        LocalDeclarationPriority: SortText,
        LocationPriority: SortText,
        OptionalMember: SortText,
        MemberDeclaredBySpreadAssignment: SortText,
        SuggestedClassMembers: SortText,
        GlobalsOrKeywords: SortText,
        AutoImportSuggestions: SortText,
        ClassMemberSnippets: SortText,
        JavascriptIdentifiers: SortText,

        Deprecated(sortText: SortText): SortText,
        ObjectLiteralProperty(presetSortText: SortText, symbolDisplayName: string): SortText,
        SortBelow(sortText: SortText): SortText,
    };

    export const enum CompletionSource {
        ThisProperty = "ThisProperty/",
        ClassMemberSnippet = "ClassMemberSnippet/",
        TypeOnlyAlias = "TypeOnlyAlias/",
        ObjectLiteralMethodSnippet = "ObjectLiteralMethodSnippet/",
    }
    export const globalThisEntry: Entry;
    export const undefinedVarEntry: Entry;
    export const globals: ReadonlyArray<Entry>;
    export const globalsInJs: ReadonlyArray<Entry>;
    export const globalKeywords: ReadonlyArray<Entry>;
    export const globalInJsKeywords: ReadonlyArray<Entry>;
    export const insideMethodKeywords: ReadonlyArray<Entry>;
    export const insideMethodInJsKeywords: ReadonlyArray<Entry>;
    export const globalsVars: ReadonlyArray<Entry>;
    export function sorted(entries: ReadonlyArray<FourSlashInterface.ExpectedCompletionEntry>): ReadonlyArray<FourSlashInterface.ExpectedCompletionEntry>;
    export function globalsInsideFunction(plus: ReadonlyArray<FourSlashInterface.ExpectedCompletionEntry>, options?: GlobalsPlusOptions): ReadonlyArray<FourSlashInterface.ExpectedCompletionEntry>;
    export function globalsInJsInsideFunction(plus: ReadonlyArray<FourSlashInterface.ExpectedCompletionEntry>, options?: GlobalsPlusOptions): ReadonlyArray<FourSlashInterface.ExpectedCompletionEntry>;
    export function globalsPlus(plus: ReadonlyArray<FourSlashInterface.ExpectedCompletionEntry>, options?: GlobalsPlusOptions): ReadonlyArray<FourSlashInterface.ExpectedCompletionEntry>;
    export function globalsInJsPlus(plus: ReadonlyArray<FourSlashInterface.ExpectedCompletionEntry>, options?: GlobalsPlusOptions): ReadonlyArray<FourSlashInterface.ExpectedCompletionEntry>;
    export const keywordsWithUndefined: ReadonlyArray<Entry>;
    export const keywords: ReadonlyArray<Entry>;
    export const typeKeywords: ReadonlyArray<Entry>;
    export function typeKeywordsPlus(plus: ReadonlyArray<FourSlashInterface.ExpectedCompletionEntry>): ReadonlyArray<Entry>;
    export const globalTypes: ReadonlyArray<Entry>;
    export function globalTypesPlus(plus: ReadonlyArray<FourSlashInterface.ExpectedCompletionEntry>): ReadonlyArray<Entry>;
    export const typeAssertionKeywords: ReadonlyArray<Entry>;
    export const classElementKeywords: ReadonlyArray<Entry>;
    export const classElementInJsKeywords: ReadonlyArray<Entry>;
    export const constructorParameterKeywords: ReadonlyArray<Entry>;
    export const functionMembers: ReadonlyArray<Entry>;
    export function functionMembersPlus(plus: ReadonlyArray<FourSlashInterface.ExpectedCompletionEntry>): ReadonlyArray<FourSlashInterface.ExpectedCompletionEntry>;
    export const functionMembersWithPrototype: ReadonlyArray<Entry>;
    export function functionMembersWithPrototypePlus(plus: ReadonlyArray<FourSlashInterface.ExpectedCompletionEntry>): ReadonlyArray<FourSlashInterface.ExpectedCompletionEntry>;
    export const stringMembers: ReadonlyArray<Entry>;
    export const statementKeywordsWithTypes: ReadonlyArray<Entry>;
    export const statementKeywords: ReadonlyArray<Entry>;
    export const statementInJsKeywords: ReadonlyArray<Entry>;
}
