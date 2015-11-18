// @target: es6
// @noImplicitAny: true

class C {
    constructor(private num: number) {}

    call constructor(): C {
        let result = new C(10);
        return result;
    }
}

let c1 = new C(10);
let c2 = C();
let eq = c1 === c2;