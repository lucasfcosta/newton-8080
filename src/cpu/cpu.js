function Newton() {
    // General Purpose Registers
    this.b = 0;
    this.c = 0;
    this.d = 0;
    this.e = 0;
    this.h = 0;
    this.l = 0;

    // Program Counter
    this.pc = 0;

    // Stack Pointer
    this.sp = 0;

    // Carry Bit
    this.cb = 0;

    // Auxiliary Carry Bit
    this.a = 0;

    // Signal Bit
    this.sb = 0;

    // Zero Bit
    this.zb = 0;

    // Parity Bit
    this.pb = 0;

    // Memory
    this.memory = new Uint8Array(65536);
}

Newton.prototype.getState = function getState() {
    return {
        b: this.b,
        c: this.c,
        d: this.d,
        e: this.e,
        h: this.h,
        l: this.l,
        pc: this.pc,
        sp: this.sp,
        cb: this.cb,
        a: this.a,
        sb: this.sb,
        zb: this.zb,
        pb: this.pb,
        memory: this.memory
    };
};

Newton.prototype.readBytes = function readBytes(n, offset) {
    let result = this.memory[offset];
    for (let i = 1; i < n; i++) {
        result = this.memory[offset + i] << 8 | result;
    }

    return result;
};

Newton.prototype.NOP = function NOP() {
    return 4;
};

module.exports = Newton;
