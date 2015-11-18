//// [callConstructorsES6_04.ts]

class C<T> {
    constructor(x: T) {
    }

    call constructor(x: T): T {
        return x;
    }
};

let num = C(10);
let c2 = new C(num);


//// [callConstructorsES6_04.js]
class C {
    constructor(x) {
    }
}
;
let num = C(10);
let c2 = new C(num);
