//// [callConstructorsES6_01.ts]

class C {
    call constructor() {
        let result = new C();
        return result;
    }
}

let c1 = new C();
let c2 = C();
let eq = c1 === c2;

//// [callConstructorsES6_01.js]
class C {
}
let c1 = new C();
let c2 = C();
let eq = c1 === c2;
