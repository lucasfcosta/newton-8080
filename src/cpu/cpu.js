function Newton() {
    // Accumulator
    this.a = 0;

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
    this.acb = 0;

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
        a: this.a,
        b: this.b,
        c: this.c,
        d: this.d,
        e: this.e,
        h: this.h,
        l: this.l,
        pc: this.pc,
        sp: this.sp,
        cb: this.cb,
        acb: this.acb,
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

Newton.prototype.push = function push(...args) {
    for (let i = 1; i <= args.length; i++) {
        this.sp -= 1;
        this.writeBytes(this.sp, args[i - 1]);
    };

    return 11;
};

// TODO check D8 meaning on all MOV_REGs and maybe remove it
Newton.prototype.moveImmediateRegister = function moveImmediateRegister(reg) {
    this[reg] = this.readBytes(1, this.pc - 1);
    return 7;
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
    return this.moveImmediateRegister('a');
};

Newton.prototype.MVI_B_D8 = function MVI_B_D8() {
    return this.moveImmediateRegister('b');
};

Newton.prototype.MVI_C_D8 = function MVI_C_D8() {
    return this.moveImmediateRegister('c');
};

Newton.prototype.MVI_D_D8 = function MVI_D_D8() {
    return this.moveImmediateRegister('d');
};

Newton.prototype.MVI_E_D8 = function MVI_E_D8() {
    return this.moveImmediateRegister('e');
};

Newton.prototype.MVI_H_D8 = function MVI_H_D8() {
    return this.moveImmediateRegister('h');
};

Newton.prototype.MVI_L_D8 = function MVI_L_D8() {
    return this.moveImmediateRegister('l');
};

Newton.prototype.MVI_M_D8 = function MVI_M_D8() {
    const m = this.h << 8 | this.l;
    const v = this.readBytes(1, this.pc - 1);
    this.writeBytes(m, v);
    return 10;
};

Newton.prototype.STA = function STA() {
    const m = this.readBytes(2, this.pc - 1);
    this.writeBytes(m, this.a);
    return 13;
};

Newton.prototype.LXI_H = function LXI_H() {
    this.h = this.readBytes(2, this.pc - 2);
    return 10;
};

Newton.prototype.DCR_M = function DCR_M() {
    const m = this.h << 8 | this.l;
    const result = (this.readBytes(1, m) - 1) & 0xFF;
    this.writeBytes(m, result);

    this.acb = (result & 0xF) === 0 ? 1 : 0;
    this.zb = (result & 255) === 0 ? 1 : 0;
    this.sb = (result & 128) > 0 ? 1 : 0;

    return 10;
};

Newton.prototype.CALL = function CALL() {
    this.push(this.pc)
    this.pc = this.readBytes(2, this.pc - 2);
    return 17;
}

Newton.prototype.RRC = function RRC() {
    this.a = (this.a >> 1) | (this.a << 7) & 0xff;
    this.cb = this.a & 0x80;
    return 4;
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
        case 0x36: { this.pc += 2; return this.MVI_M_D8(); }
        case 0x32: { this.pc += 3; return this.STA(); }
        case 0x21: { this.pc += 3; return this.LXI_H(); }
        case 0x35: { this.pc += 1; return this.DCR_M(); }
        case 0xcd: { this.pc += 3; return this.CALL(); }
        case 0x0f: { this.pc += 1; return this.RRC(); }
        default: throw new Error('Unknown OP Code');
    }
};

module.exports = Newton;
