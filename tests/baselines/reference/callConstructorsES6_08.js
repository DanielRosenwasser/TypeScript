//// [callConstructorsES6_08.ts]

const C = class C<T> {
    constructor(private x: T) {
    }

    call constructor<T>(x?: T) {
        return new C<T>(x);
    }
};

let c1 = new C(10);
let c2 = C();
let c3 = C(100);

//// [callConstructorsES6_08.js]
const C = class C {
    constructor(x) {
        this.x = x;
    }
}
;
let c1 = new C(10);
let c2 = C();
let c3 = C(100);
