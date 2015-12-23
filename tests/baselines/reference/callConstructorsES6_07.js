//// [callConstructorsES6_07.ts]

const C = class C {
    protected call
    constructor() { }
};

let c1 = new C();
let c2 = C();

//// [callConstructorsES6_07.js]
const C = class C {
}
;
let c1 = new C();
let c2 = C();
