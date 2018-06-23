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

    describe('writeBytes', () => {
        it('writes one byte to a memory address', () => {
            const n = new Newton();
            n.memory = [0xff, 0x30, 0x88, 0x45];

            n.writeBytes(0x03, 0x11);
            n.writeBytes(0x01, 0x77);

            expect(n.memory[0x01]).to.be.equal(0x77);
            expect(n.memory[0x03]).to.be.equal(0x11);
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


        it('JMP', () => {
            n.memory = [0xc3, 0x33, 0x44];

            mirrorState.pc = 0x4433;
            mirrorState.memory = [0xc3, 0x33, 0x44];

            expect(n.runNextInstruction()).to.be.equal(10);
            expect(n.getState()).to.be.deep.equal(mirrorState);
        });

        it('PUSH_B', () => {
            n.memory = [0xc5, 0x00, 0x00, 0x00];
            n.sp = 3;
            n.b = 0xbb;
            n.c = 0xcc;

            mirrorState.pc = 1;
            mirrorState.memory = [0xc5, 0xcc, 0xbb, 0x00];
            mirrorState.sp = 1;
            mirrorState.b = 0xbb;
            mirrorState.c = 0xcc;

            expect(n.runNextInstruction()).to.be.equal(11);
            expect(n.getState()).to.be.deep.equal(mirrorState);
        });

        it('PUSH_D', () => {
            n.memory = [0xd5, 0x00, 0x00, 0x00];
            n.sp = 3;
            n.d = 0xdd;
            n.e = 0xee;

            mirrorState.pc = 1;
            mirrorState.memory = [0xd5, 0xee, 0xdd, 0x00];
            mirrorState.sp = 1;
            mirrorState.d = 0xdd;
            mirrorState.e = 0xee;

            expect(n.runNextInstruction()).to.be.equal(11);
            expect(n.getState()).to.be.deep.equal(mirrorState);
        });

        it('PUSH_H', () => {
            n.memory = [0xe5, 0x00, 0x00, 0x00];
            n.sp = 3;
            n.h = 0x11;
            n.l = 0x22;

            mirrorState.pc = 1;
            mirrorState.memory = [0xe5, 0x22, 0x11, 0x00];
            mirrorState.sp = 1;
            mirrorState.h = 0x11;
            mirrorState.l = 0x22;

            expect(n.runNextInstruction()).to.be.equal(11);
            expect(n.getState()).to.be.deep.equal(mirrorState);
        });

        it('MVI_A_D8', () => {
            n.memory = [0x3e, 0x03, 0x00, 0x11];

            mirrorState.pc = 2;
            mirrorState.memory = [0x3e, 0x03, 0x00, 0x11];
            mirrorState.a = 0x03;

            expect(n.runNextInstruction()).to.be.equal(7);
            expect(n.getState()).to.be.deep.equal(mirrorState);
        });

        it('MVI_B_D8', () => {
            n.memory = [0x06, 0x03, 0x00, 0x11];

            mirrorState.pc = 2;
            mirrorState.memory = [0x06, 0x03, 0x00, 0x11];
            mirrorState.b = 0x03;

            expect(n.runNextInstruction()).to.be.equal(7);
            expect(n.getState()).to.be.deep.equal(mirrorState);
        });

        it('MVI_C_D8', () => {
            n.memory = [0x0e, 0x03, 0x00, 0x11];

            mirrorState.pc = 2;
            mirrorState.memory = [0x0e, 0x03, 0x00, 0x11];
            mirrorState.c = 0x03;

            expect(n.runNextInstruction()).to.be.equal(7);
            expect(n.getState()).to.be.deep.equal(mirrorState);
        });

        it('MVI_D_D8', () => {
            n.memory = [0x16, 0x03, 0x00, 0x11];

            mirrorState.pc = 2;
            mirrorState.memory = [0x16, 0x03, 0x00, 0x11];
            mirrorState.d = 0x03;

            expect(n.runNextInstruction()).to.be.equal(7);
            expect(n.getState()).to.be.deep.equal(mirrorState);
        });

        it('MVI_E_D8', () => {
            n.memory = [0x1e, 0x03, 0x00, 0x11];

            mirrorState.pc = 2;
            mirrorState.memory = [0x1e, 0x03, 0x00, 0x11];
            mirrorState.e = 0x03;

            expect(n.runNextInstruction()).to.be.equal(7);
            expect(n.getState()).to.be.deep.equal(mirrorState);
        });

        it('MVI_H_D8', () => {
            n.memory = [0x26, 0x03, 0x00, 0x11];

            mirrorState.pc = 2;
            mirrorState.memory = [0x26, 0x03, 0x00, 0x11];
            mirrorState.h = 0x03;

            expect(n.runNextInstruction()).to.be.equal(7);
            expect(n.getState()).to.be.deep.equal(mirrorState);
        });

        it('MVI_L_D8', () => {
            n.memory = [0x2e, 0x03, 0x00, 0x11];

            mirrorState.pc = 2;
            mirrorState.memory = [0x2e, 0x03, 0x00, 0x11];
            mirrorState.l = 0x03;

            expect(n.runNextInstruction()).to.be.equal(7);
            expect(n.getState()).to.be.deep.equal(mirrorState);
        });
    });
});
