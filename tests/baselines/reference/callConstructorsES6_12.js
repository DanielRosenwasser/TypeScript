//// [callConstructorsES6_12.ts]

class C {
    call constructor() {
        return this;
    }
}

let a = C();

//// [callConstructorsES6_12.js]
class C {
}
let a = C();
