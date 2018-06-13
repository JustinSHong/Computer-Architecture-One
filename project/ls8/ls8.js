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
  const file = fs.readFileSync(`${process.argv[2]}`, "utf8").split("\n");
  // console.log(file);

  const program = [];
  // clean up file lines
  for (let i = 2; i < file.length; i++) {
    // console.log(`line ${i}: ${file[i]}`);
    if (file[i].includes(" ")) {
      program.push(file[i].slice(0, file[i].indexOf(" ")));
    } else {
      program.push(file[i]);
    }
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
