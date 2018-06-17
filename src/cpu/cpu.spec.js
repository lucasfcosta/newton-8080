/* eslint-env mocha */

const { expect } = require('chai');

const Newton = require('./cpu');

describe('Newton', () => {
    describe('constructor', () => {
        it('has the initial state when created', () => {
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

    describe('getState', () => {
        it('returns the properties which represent the CPU state', () => {
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

    describe('readBytes', () => {
        it('reads single bytes correctly', () => {
            const n = new Newton();
            n.memory = [0xff, 0x40, 0x7f];
            expect(n.readBytes(1, 0)).to.be.equal(0xff);
            expect(n.readBytes(1, 1)).to.be.equal(0x40);
            expect(n.readBytes(1, 2)).to.be.equal(0x7f);
        });

        it('reads two bytes as a single number correctly', () => {
            const n = new Newton();
            n.memory = [0xff, 0x40, 0x7f];
            expect(n.readBytes(2, 0)).to.be.equal(0x40ff);
            expect(n.readBytes(2, 1)).to.be.equal(0x7f40);
        });
    });

    describe('OP Codes', () => {
        let n, mirrorState;

        beforeEach(() => {
            n = new Newton();
            mirrorState = (new Newton()).getState();
        });

        it('NOP', () => {
            n.memory = [0x00];

            mirrorState.pc = 1;
            mirrorState.memory = [0x00];

            expect(n.runNextInstruction()).to.be.equal(4);
            expect(n.getState()).to.be.deep.equal(mirrorState);
        });
    });
});
