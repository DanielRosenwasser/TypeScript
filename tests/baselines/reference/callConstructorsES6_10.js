//// [callConstructorsES6_10.ts]

class C {
    call constructor<T>(x: T) {
        return x;
    }
}

let c1 = new C();
let c2 = C("hello");
let num = C(100);

//// [callConstructorsES6_10.js]
class C {
}
let c1 = new C();
let c2 = C("hello");
let num = C(100);
