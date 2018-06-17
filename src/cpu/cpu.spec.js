/* eslint-env mocha */

const { expect } = require('chai');

const Newton = require('./cpu');

describe("Newton", () => {
    describe("constructor", () => {
        it("has the initial state when created", () => {
            const n = new Newton();

            expect(n.getState()).to.be.deep.equal({
                b: 0,
                c: 0,
                d: 0,
                e: 0,
                h: 0,
                l: 0,
                pc: 0,
                sp: 0,
                cb: 0,
                a: 0,
                sb: 0,
                zb: 0,
                pb: 0,
                memory: new Uint8Array(65536),
            });
        });
    });

    describe("getState", () => {
        it("returns the properties which represent the CPU state", () => {
            const n = new Newton();

            n.b = 1;
            n.c = 2;
            n.d = 3;
            n.e = 4;
            n.h = 5;
            n.l = 6;
            n.pc = 7;
            n.sp = 8;
            n.cb = 9;
            n.a = 10;
            n.sb = 11;
            n.zb = 12;
            n.pb = 13;
            n.memory = new Uint8Array([0xff]);

            expect(n.getState()).to.be.deep.equal({
                b: 1,
                c: 2,
                d: 3,
                e: 4,
                h: 5,
                l: 6,
                pc: 7,
                sp: 8,
                cb: 9,
                a: 10,
                sb: 11,
                zb: 12,
                pb: 13,
                memory: new Uint8Array([0xff])
            });
        });
    });

    describe("OP Codes", () => {
        let n;

        beforeEach(() => {
            n = new Newton();
        });

        it("NOP", () => {
            expect(n.NOP()).to.be.equal(4);
            expect(n.getState()).to.be.deep.equal((new Newton()).getState());
        });
    });
});
