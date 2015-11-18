//// [callConstructorsES6_03.ts]

class C {
    call constructor(): C;
    call constructor(x: number): C
    call constructor(x?: number): any {
        if (x !== undefined) {
            return x;
        }
        
        let result = new C(10);
        return result;
    }
}

let c1 = new C(10);
let c2 = C();
let num = C(100);

//// [callConstructorsES6_03.js]
class C {
}
let c1 = new C(10);
let c2 = C();
let num = C(100);
