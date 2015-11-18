// @target: es6
// @noImplicitAny: true

class C<T> {
    constructor(x: T) {
    }

    call constructor(x: T): T {
        return x;
    }
};

let num = C(10);
let c2 = new C(num);
