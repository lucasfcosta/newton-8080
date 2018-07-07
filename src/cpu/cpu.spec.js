/* eslint-env mocha */

const { expect } = require('chai');

const Newton = require('./cpu');

describe('Newton', () => {
    describe('constructor', () => {
        it('has the initial state when created', () => {
            const n = new Newton();

            expect(n.getState()).to.be.deep.equal({
                a: 0,
                b: 0,
                c: 0,
                d: 0,
                e: 0,
                h: 0,
                l: 0,
                pc: 0,
                sp: 0,
                cb: 0,
                acb: 0,
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

            n.a = 1;
            n.b = 2;
            n.c = 3;
            n.d = 4;
            n.e = 5;
            n.h = 6;
            n.l = 7;
            n.pc = 8;
            n.sp = 9;
            n.cb = 10;
            n.acb = 11;
            n.sb = 12;
            n.zb = 13;
            n.pb = 14;
            n.memory = new Uint8Array([0xff]);

            expect(n.getState()).to.be.deep.equal({
                a: 1,
                b: 2,
                c: 3,
                d: 4,
                e: 5,
                h: 6,
                l: 7,
                pc: 8,
                sp: 9,
                cb: 10,
                acb: 11,
                sb: 12,
                zb: 13,
                pb: 14,
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

        it('MVI_M_D8', () => {
            n.memory = [0x36, 0xdd, 0xff];
            n.h = 0x00;
            n.l = 0x02;

            mirrorState.pc = 2;
            mirrorState.memory = [0x36, 0xdd, 0xdd];
            mirrorState.h = 0x00;
            mirrorState.l = 0x02;

            expect(n.runNextInstruction()).to.be.equal(10);
            expect(n.getState()).to.be.deep.equal(mirrorState);
        });

        it('STA', () => {
            n.memory = [0xff, 0x00, 0x32, 0x01, 0x00];
            n.a = 0xdd;
            n.pc = 2;

            mirrorState.pc = 5;
            mirrorState.memory = [0xdd, 0x00, 0x32, 0x01, 0x00];
            mirrorState.a = 0xdd;

            expect(n.runNextInstruction()).to.be.equal(13);
            expect(n.getState()).to.be.deep.equal(mirrorState);
        });

        it('LXI_H', () => {
            n.memory = [0x21, 0x12, 0x34];

            mirrorState.pc = 3;
            mirrorState.memory = [0x21, 0x12, 0x34];
            mirrorState.h = 0x3412;

            expect(n.runNextInstruction()).to.be.equal(10);
            expect(n.getState()).to.be.deep.equal(mirrorState);
        });

        describe('DCR M', () => {
            it('decrements the value at the correct memory location', () => {
                n.memory = [0x35, 0x02];
                n.h = 0x0000;
                n.l = 0x0001;

                expect(n.runNextInstruction()).to.be.equal(10);
                expect(n.getState().pc).to.be.deep.equal(1);
                expect(n.getState().memory).to.be.deep.equal([0x35, 0x01]);
                expect(n.getState().h).to.be.deep.equal(0x0000);
                expect(n.getState().l).to.be.deep.equal(0x0001);
            });

            it('sets the auxiliary carry bit to indicate the carry out of bit 3', () => {
                n.memory = [0x35, 0xf1];
                n.h = 0x0000;
                n.l = 0x0001;

                expect(n.runNextInstruction()).to.be.equal(10);
                expect(n.getState().acb).to.be.equal(1);
            });

            it('sets the zero bit when the result is 0', () => {
                n.memory = [0x35, 0x01];
                n.h = 0x0000;
                n.l = 0x0001;

                expect(n.runNextInstruction()).to.be.equal(10);
                expect(n.getState().zb).to.be.equal(1);
            });

            it('sets the sign bit to 1 when result is negative', () => {
                n.memory = [0x35, 0x00];
                n.h = 0x0000;
                n.l = 0x0001;

                expect(n.runNextInstruction()).to.be.equal(10);
                expect(n.getState().sb).to.be.equal(1);
            });
        });

        it('CALL', () => {
            n.memory = [0xcd, 0x04, 0x00, 0xdd, 0xdd];
            n.sp = 4;

            mirrorState.pc = 4;
            mirrorState.memory = [0xcd, 0x04, 0x00, 0x03, 0xdd];
            mirrorState.sp = 3;

            expect(n.runNextInstruction()).to.be.equal(17);
            expect(n.getState()).to.be.deep.equal(mirrorState);
        });

        it('RRC', () => {
            n.memory = [0x0f, 0xdd, 0x10];
            n.a = 0xf2;
            n.cb = 0;

            mirrorState.pc = 1;
            mirrorState.a = 0x79;
            mirrorState.cb = 0;
            mirrorState.memory = [0x0f, 0xdd, 0x10];

            expect(n.runNextInstruction()).to.be.equal(4);
            expect(n.getState()).to.be.deep.equal(mirrorState);
        });

        describe('JC', () => {
            it('jumps if carry bit is 1', () => {
                n.memory = [0xda, 0xdd, 0x11];
                n.cb = 1;

                mirrorState.pc = 0x11dd;
                mirrorState.cb = 1;
                mirrorState.memory = [0xda, 0xdd, 0x11];

                expect(n.runNextInstruction()).to.be.equal(10);
                expect(n.getState()).to.be.deep.equal(mirrorState);
            });

            it('does not jump if carry bit is 0', () => {
                n.memory = [0xda, 0xdd, 0x11];
                n.cb = 0;

                mirrorState.pc = 3;
                mirrorState.cb = 0;
                mirrorState.memory = [0xda, 0xdd, 0x11];

                expect(n.runNextInstruction()).to.be.equal(10);
                expect(n.getState()).to.be.deep.equal(mirrorState);
            });
        });

        describe('JNC', () => {
            it('jumps if carry bit is 0', () => {
                n.memory = [0xd2, 0xdd, 0x11];
                n.cb = 0;

                mirrorState.pc = 0x11dd;
                mirrorState.cb = 0;
                mirrorState.memory = [0xd2, 0xdd, 0x11];

                expect(n.runNextInstruction()).to.be.equal(10);
                expect(n.getState()).to.be.deep.equal(mirrorState);
            });

            it('does not jump if carry bit is 1', () => {
                n.memory = [0xd2, 0xdd, 0x11];
                n.cb = 1;

                mirrorState.pc = 3;
                mirrorState.cb = 1;
                mirrorState.memory = [0xd2, 0xdd, 0x11];

                expect(n.runNextInstruction()).to.be.equal(10);
                expect(n.getState()).to.be.deep.equal(mirrorState);
            });
        });
    });
});
