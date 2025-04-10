import { describe, test, it, expect } from 'vitest';
import { calculateAverage, factorial, fizzBuzz, max } from '../src/intro';

describe('max', () => {
  it('should return first argument if it is greater', () => {
    // Arrange, Act and Assert
    expect(max(2, 1)).toBe(2);
  });

  it('should return second argument if it is greater', () => {
    // Arrange, Act and Assert
    expect(max(1, 2)).toBe(2);
  });

  it('should return first argument if arguments are equal', () => {
    // Arrange, Act and Assert
    expect(max(2, 2)).toBe(2);
  });
});

describe('fizzbuzz', () => {
  it('should return FizzBuzz when argument is divisible by 3 and 5', () => {
    expect(fizzBuzz(15)).toBe('FizzBuzz');
  });

  it('should return Fizz when argument is divisible by 3', () => {
    expect(fizzBuzz(9)).toBe('Fizz');
  });

  it('should return Buzz when argument is divisible by 5', () => {
    expect(fizzBuzz(10)).toBe('Buzz');
  });

  it('should return the string value of argument if not divisble by 3 or 5', () => {
    expect(fizzBuzz(17)).toBe('17');
  });
});

describe('calculateAverage', () => {
  it('should return NaN if given an empty array', () => {
    expect(calculateAverage([])).toBe(NaN);
  });

  it('should return average of numbers', () => {
    expect(calculateAverage([1, 2, 3])).toBe(2);
  });
});

describe('factorial', () => {
  it('should return 1', () => {
    expect(factorial(0)).toBe(1);
  });

  it('should return 1', () => {
    expect(factorial(1)).toBe(1);
  });

  it('should return 2', () => {
    expect(factorial(2)).toBe(2);
  });

  it('should return 6', () => {
    expect(factorial(3)).toBe(6);
  });

  it('should return 120', () => {
    expect(factorial(5)).toBe(120);
  });

  it('should return undefined if given a negative number', () => {
    expect(factorial(-1)).toBeUndefined();
  });
});

// describe("test suite", () => {
//     // it("should return result", () => {
//     //     const result = "The requested file was not found!";

//     //     // loose assertion
//     //     expect(result).toBeDefined();

//     //     // tight assertion(too specific)
//     //     // expect(result).toBe("The requested file was not found.");

//     //     // better assertion
//     //     expect(result).toMatch(/not found/i);
//     // });

//     it("test case", () => {
//         // const result = [1, 2, 3];
//         // better assertion
//         // expect(result).toEqual(expect.arrayContaining([3, 1]));
//         // expect(result.length).toBeGreaterThan(0);

//         const result = { name: "Segun", id: 1 };
//         expect(typeof result.name).toBe("string");
//     });
// });
