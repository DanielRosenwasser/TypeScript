//// [callConstructorsES6_11.ts]

class C {
    call constructor(): this {
        return this;
    }
}

let c1 = new C();
let c2 = C();

//// [callConstructorsES6_11.js]
class C {
}
let c1 = new C();
let c2 = C();
