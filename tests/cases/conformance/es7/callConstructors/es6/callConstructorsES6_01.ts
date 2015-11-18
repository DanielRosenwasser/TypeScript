// @target: es6
// @noImplicitAny: true

class C {
    call constructor() {
        let result = new C();
        return result;
    }
}

let c1 = new C();
let c2 = C();
let eq = c1 === c2;