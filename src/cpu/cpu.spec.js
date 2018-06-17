/* eslint-env mocha */

const { expect } = require('chai');

const Newton = require('./cpu');

describe("Newton", () => {
    describe("constructor", () => {
        it("has the initial state when created", () => {
            const n = new Newton();

            expect(n).to.be.deep.equal({
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
});
