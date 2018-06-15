/**
 * LS-8 v2.0 emulator skeleton code
 */

// OP CODES
const LDI = 0b10011001;
const PRN = 0b01000011;
const HLT = 0b00000001;
const MUL = 0b10101010;
const MULT2PRINT = 0b10101000;
const PUSH = 0b01001101;
const POP = 0b01001100;
const CALL = 0b01001000;
const RET = 0b00001001;
const CMP = 0b10100000;
const JMP = 0b01010000;
const JEQ = 0b01010001;
const JNE = 0b01010010;

/**
 * Class for simulating a simple Computer (CPU & memory)
 */
class CPU {
  /**
   * Initialize the CPU
   */
  constructor(ram) {
    this.ram = ram;

    this.reg = new Array(8).fill(0); // General-purpose registers R0-R7

    // Special-purpose registers
    this.PC = 0; // Program Counter

    // flags
    this.E = 0; // equal
    this.L = 0; // less than
    this.G = 0; // greater than
  }

  /**
   * Store value in memory address, useful for program loading
   */
  poke(address, value) {
    this.ram.write(address, value);
  }

  /**
   * Starts the clock ticking on the CPU
   */
  startClock() {
    this.clock = setInterval(() => {
      this.tick();
    }, 1); // 1 ms delay == 1 KHz clock == 0.000001 GHz
  }

  /**
   * Stops the clock
   */
  stopClock() {
    clearInterval(this.clock);
  }

  /**
   * ALU functionality
   *
   * The ALU is responsible for math and comparisons.
   *
   * If you have an instruction that does math, i.e. MUL, the CPU would hand
   * it off to it's internal ALU component to do the actual work.
   *
   * op can be: ADD SUB MUL DIV INC DEC CMP
   */
  alu(op, regA, regB) {
    switch (op) {
      case "MUL":
        // !!! IMPLEMENT ME
        regA = (regA * regB) & 0xff;
        return regA;
        break;
      case "CMP":
        // values are the same
        if (regA === regB) {
          this.E = 1;
        }
        // registerA less than registerB
        if (regA < regB) {
          this.L = 1;
        }
        // register A greater than register B
        if (regA > regB) {
          this.G = 1;
        }
        break;
    }
  }

  /**
   * Advances the CPU one cycle
   */
  tick() {
    // Load the instruction register (IR--can just be a local variable here)
    // from the memory address pointed to by the PC. (I.e. the PC holds the
    // index into memory of the instruction that's about to be executed
    // right now.)

    // !!! IMPLEMENT ME
    const IR = this.ram.read(this.PC);
    // Debugging output
    // console.log(`${this.PC}: ${IR.toString(2)}`);

    // Get the two bytes in memory _after_ the PC in case the instruction
    // needs them.

    // !!! IMPLEMENT ME
    const operandA = this.ram.read(this.PC + 1);
    const operandB = this.ram.read(this.PC + 2);

    // console.log(`operandA: ${operandA}`);
    // console.log(`operandB: ${operandB}`);

    // Execute the instruction. Perform the actions for the instruction as
    // outlined in the LS-8 spec.

    // !!! IMPLEMENT ME
    switch (IR) {
      case LDI: // LDI - register immediate
        this.reg[operandA] = operandB;
        this.PC += 3;
        break;
      case PRN: // PRN - register pseudo-instruction
        console.log(this.reg[operandA]);
        this.PC += 2;
        break;
      case HLT: // HLT -  halt cpu and exit emulator/ stop cycling
        this.stopClock();
        this.PC += 1;
        break;
      case MUL: // MUL - multiply
        this.reg[operandA] = this.alu(
          "MUL",
          this.reg[operandA],
          this.reg[operandB]
        );
        this.PC += 3;
        break;
      case MULT2PRINT: // MULT2PRINT - multiply a value by 2
        this.reg[operandA] = this.alu("MUL", this.reg[operandA], 2);
        this.PC += 3;
        break;
      case PUSH: // PUSH - push the given register on the stack
        // if (!this.reg[7]) {
        //   // stack pointer is empty
        //   this.reg[7] = 0xf4;
        // }
        // this.reg[7] = this.reg[7] - 1;
        // this.ram[this.reg[7]] = this.reg[operandA];
        this.pushValue(this.reg[operandA]);
        this.PC += 2;
        break;
      case POP: // POP - pop the value at the top of the stack
        this.reg[operandA] = this.ram[this.reg[7]];
        this.reg[7] = this.reg[7] + 1;
        this.PC += 2;
        break;
      case CALL: // CALL - calls a subroutine at the address stored in the register
        // push address after subroutine onto the stack
        this.pushValue(this.PC + 2);
        // set the PC to the address stored in the given register (operandA)
        this.PC = this.reg[operandA];
        break;
      case RET: // RET - return from a subroutine; pop value from top of stack and store it in the PC
        this.PC = this.ram[this.reg[7]];
        break;
      case CMP: // CMP - compare values in 2 registers
        this.alu("CMP", this.reg[operandA], this.reg[operandB]);
        this.PC += 3;
        break;
      case JMP: // JMP - jump to the address stored in the given register
        // set PC to the stored address
        this.PC = operandA;
        break;
      case JEQ: // JEQ - if equal flag is true, jump to an address
        if (this.E) {
          this.PC = this.reg[operandA];
        } else {
          this.PC += 2;
        }
        break;
      case JNE: // JNE - if equal flag is false, jump to an address
        if (!this.E) {
          this.PC = this.reg[operandA];
        } else {
          this.PC += 2;
        }
        break;
      default:
        console.log(`unknown instruction: ${IR.toString(2)}`);
        this.stopClock();
        return;
    }

    // Increment the PC register to go to the next instruction. Instructions
    // can be 1, 2, or 3 bytes long. Hint: the high 2 bits of the
    // instruction byte tells you how many bytes follow the instruction byte
    // for any particular instruction.

    // !!! IMPLEMENT ME
  }

  pushValue(val) {
    if (!this.reg[7]) {
      this.reg[7] = 0xf4;
    }
    this.reg[7] = this.reg[7] - 1;
    this.ram[this.reg[7]] = val;
  }
}

module.exports = CPU;
