// @target: es6
// @noImplicitAny: true

const C = class C {
    static call constructor() {
        return new C;
    }
};

let c1 = new C(10);
let c2 = C();
let c3 = C(100);