// @target: es6
// @noImplicitAny: true

const C = class C<T> {
    constructor(private x: T) {
    }

    call constructor<T>(x?: T) {
        return new C<T>(x);
    }
};

let c1 = new C(10);
let c2 = C();
let c3 = C(100);