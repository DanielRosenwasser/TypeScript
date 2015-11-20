// @target: es6
// @noImplicitAny: true

class C {
    call constructor<T>(x: T) {
        return x;
    }
}

let c1 = new C();
let c2 = C("hello");
let num = C(100);