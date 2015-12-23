//// [callConstructorsES6_09.ts]

const C = class C {
    static call constructor() {
        return new C;
    }
};

let c1 = new C(10);
let c2 = C();
let c3 = C(100);

//// [callConstructorsES6_09.js]
const C = class C {
}
;
let c1 = new C(10);
let c2 = C();
let c3 = C(100);
