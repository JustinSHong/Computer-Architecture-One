const RAM = require("./ram");
const CPU = require("./cpu");
const fs = require("fs");

/**
 * Load an LS8 program into memory
 *
 * TODO: load this from a file on disk instead of having it hardcoded
 */
function loadMemory() {
  // Hardcoded program to print the number 8 on the console

  // const program = [ // print8.ls8
  //     "10011001", // LDI R0,8  Store 8 into R0
  //     "00000000",
  //     "00001000",
  //     "01000011", // PRN R0    Print the value in R0
  //     "00000000",
  //     "00000001"  // HLT       Halt and quit
  // ];

  // const program = [
  //     "10011001", // LDI R0,8
  //     "00000000",
  //     "00001000",
  //     "10011001", // LDI R1,9
  //     "00000001",
  //     "00001001",
  //     "10101010", // MUL R0,R1 <---
  //     "00000000",
  //     "00000001",
  //     "01000011", // PRN R0
  //     "00000000",
  //     "00000001"  // HLT
  // ];

  // check user provides a valid file
  if (process.argv.length !== 3) {
    console.log("Invalid usage. Please provide: node ls8 filename");
    process.exit(1);
  }

  // load a specific file
  const file = fs
    .readFileSync(`${process.argv[2]}`, "utf8")
    .trim()
    .split(/[\n]/);
  console.log(file);

  const program = [];
  // clean up file lines
  for (let line of file) {
    let value;
    // check each line with parseInt
    if (isNaN(parseInt(line, 2))) {
      continue; // do not consider this line to be in the program
    }
    // check to see if a line has a "#"
    // if so, extract up to the # and trim
    if (/#/.test(line)) {
      value = line.slice(0, line.indexOf("#"));
    } else {
      value = line;
    }
    value.trim();
    // console.log(`value: ${value}`);
    // check to see if the line has nums other than 0 or 1
    // if so, print an error message to the user
    if (/[2-9]/.test(value)) {
      console.log(
        "Invalid program instruction. Please provide instruction in binary"
      );
      process.exit(1);
    }
    program.push(value);
  }
  // console.log(`program: ${program}`);

  // Load the program into the CPU's memory a byte at a time
  for (let i = 0; i < program.length; i++) {
    cpu.poke(i, parseInt(program[i], 2));
  }
}

/**
 * Main
 */

let ram = new RAM(256);
let cpu = new CPU(ram);

// TODO: get name of ls8 file to load from command line

loadMemory(cpu);

cpu.startClock();
