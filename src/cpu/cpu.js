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

Newton.prototype.writeBytes = function writeBytes(offset, v) {
    this.memory[offset] = v;
    return this.memory;
};

Newton.prototype.push = function push(reg1, reg2) {
    this.writeBytes(this.sp - 1, reg1);
    this.writeBytes(this.sp - 2, reg2);
    this.sp -= 2;
    return 11;
};

// TODO check D8 meaning on all MOV_REGs and maybe remove it
Newton.prototype.moveImmediate = function moveImmediate(reg) {
    this[reg] = this.readBytes(1, this.pc - 1);
    return 10;
};

Newton.prototype.NOP = function NOP() {
    return 4;
};

Newton.prototype.JMP = function JMP() {
    this.pc = this.readBytes(2, this.pc - 2);
    return 10;
};

Newton.prototype.PUSH_B = function PUSH_B() {
    return this.push(this.b, this.c);
};

Newton.prototype.PUSH_D = function PUSH_D() {
    return this.push(this.d, this.e);
};

Newton.prototype.PUSH_H = function PUSH_D() {
    return this.push(this.h, this.l);
};

Newton.prototype.MVI_A_D8 = function MVI_A_D8() {
    return this.moveImmediate('a');
};

Newton.prototype.MVI_B_D8 = function MVI_B_D8() {
    return this.moveImmediate('b');
};

Newton.prototype.MVI_C_D8 = function MVI_C_D8() {
    return this.moveImmediate('c');
};

Newton.prototype.MVI_D_D8 = function MVI_D_D8() {
    return this.moveImmediate('d');
};

Newton.prototype.MVI_E_D8 = function MVI_E_D8() {
    return this.moveImmediate('e');
};

Newton.prototype.MVI_H_D8 = function MVI_H_D8() {
    return this.moveImmediate('h');
};

Newton.prototype.MVI_L_D8 = function MVI_L_D8() {
    return this.moveImmediate('l');
};

Newton.prototype.runNextInstruction = function runNextInstruction() {
    switch (this.memory[this.pc]) {
        case 0x00: { this.pc += 1; return this.NOP(); }
        case 0xc3: { this.pc += 3; return this.JMP(); }
        case 0xc5: { this.pc += 1; return this.PUSH_B(); }
        case 0xd5: { this.pc += 1; return this.PUSH_D(); }
        case 0xe5: { this.pc += 1; return this.PUSH_H(); }
        case 0x3e: { this.pc += 2; return this.MVI_A_D8(); }
        case 0x06: { this.pc += 2; return this.MVI_B_D8(); }
        case 0x0e: { this.pc += 2; return this.MVI_C_D8(); }
        case 0x16: { this.pc += 2; return this.MVI_D_D8(); }
        case 0x1e: { this.pc += 2; return this.MVI_E_D8(); }
        case 0x26: { this.pc += 2; return this.MVI_H_D8(); }
        case 0x2e: { this.pc += 2; return this.MVI_L_D8(); }
        default: throw new Error('Unknown OP Code');
    }
};

module.exports = Newton;
