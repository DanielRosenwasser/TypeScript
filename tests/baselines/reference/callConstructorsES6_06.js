//// [callConstructorsES6_06.ts]

const C = class C {
    call
    constructor() { }
};

let c1 = new C();
let c2 = C();

//// [callConstructorsES6_06.js]
const C = class C {
}
;
let c1 = new C();
let c2 = C();
