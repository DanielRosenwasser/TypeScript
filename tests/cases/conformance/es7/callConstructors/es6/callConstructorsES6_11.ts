// @target: es6
// @noImplicitAny: true

class C {
    call constructor(): this {
        return this;
    }
}

let c1 = new C();
let c2 = C();