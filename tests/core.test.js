import {
  it,
  expect,
  describe,
  beforeEach,
  beforeAll,
  afterAll,
  afterEach,
} from 'vitest';
import {
  calculateDiscount,
  canDrive,
  fetchData,
  getCoupons,
  isPriceInRange,
  isValidUsername,
  Stack,
  validateUserInput,
} from '../src/core';

describe('coupons', () => {
  const coupons = getCoupons();

  it('should return array and with a length greater than 0', () => {
    expect(Array.isArray(coupons)).toBe(true);

    expect(coupons.length).toBeGreaterThan(0);
  });

  it('should return an array with valid coupon codes', () => {
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('code');
      expect(coupon.code.trim).not.toBe('');

      // code is a string and not empty
      expect(typeof coupon.code).toBe('string');
      expect(coupon.code).toBeTruthy();
    });
  });

  it('should return an array with valid coupon discounts', () => {
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty('discount');
      expect(typeof coupon.discount).toBe('number');

      // discount is between 0 and 1
      expect(coupon.discount).toBeGreaterThan(0);
      expect(coupon.discount).toBeLessThan(1);
    });
  });
});

describe('calculateDiscount', () => {
  // positive testing
  it('should return discounted price if given valid code', () => {
    expect(calculateDiscount(100, 'SAVE10')).toBe(90);
    expect(calculateDiscount(100, 'SAVE20')).toBe(80);
  });

  // negative testing
  it('should handle non-numeric price', () => {
    expect(calculateDiscount('100', 'SAVE10')).toMatch(/invalid/i);
  });
  it('should handle negative price', () => {
    expect(calculateDiscount(-10, 'SAVE10')).toMatch(/invalid/i);
  });
  it('should handle non-string discount code', () => {
    expect(calculateDiscount(50, 20)).toMatch(/invalid/i);
  });
  it('should handle invalid discount code', () => {
    expect(calculateDiscount(50, 'SAVE2')).toBe(50);
  });
});

describe('userInput', () => {
  // positive test
  it('should match validation successful', () => {
    expect(validateUserInput('sam', 20)).toMatch(/successful/i);
  });

  // negative tests
  it('should return an error if username is not a string', () => {
    expect(validateUserInput(200, 19)).toMatch(/invalid/i);
  });
  it('should return an error if username is less than 3 characters', () => {
    expect(validateUserInput('pi', 19)).toMatch(/invalid/i);
  });
  it('should return an error if username is longer than 256 characters', () => {
    expect(validateUserInput('a'.repeat(256), 19)).toMatch(/invalid/i);
  });

  it('should return an error if age is not a number', () => {
    expect(validateUserInput('john', '20')).toMatch(/invalid/i);
  });
  it('should return an error if age is less than 18', () => {
    expect(validateUserInput('john', 17)).toMatch(/invalid/i);
  });
  it('should return an error if age is greater than 100', () => {
    expect(validateUserInput('john', 101)).toMatch(/invalid/i);
  });

  it('should return an error if age and username is invalid', () => {
    expect(validateUserInput('', 2)).toMatch(/invalid username/i);
    expect(validateUserInput('', 2)).toMatch(/invalid age/i);
  });
});

describe('isPriceInRange', () => {
  it.each([
    { scenario: 'price is less than min', price: -10, result: false },
    { scenario: 'price is equals min', price: 0, result: true },
    { scenario: 'price is between min and max', price: 50, result: true },
    { scenario: 'price is equals max', price: 100, result: true },
    { scenario: 'price is greater than max', price: 200, result: false },
  ])('should return $result when $scenario', ({ price, result }) => {
    expect(isPriceInRange(price, 0, 100)).toBe(result);
  });
});

describe('isValidUsername', () => {
  const minLength = 5;
  const maxLength = 15;

  it('should return false when username is outside range', () => {
    // username is too short
    expect(isValidUsername('a'.repeat(minLength - 1))).toBe(false);
    // username is too long
    expect(isValidUsername('a'.repeat(maxLength + 1))).toBe(false);
  });

  it('should return true when username when is equal to min or max', () => {
    expect(isValidUsername('a'.repeat(minLength))).toBe(true);
    expect(isValidUsername('a'.repeat(maxLength))).toBe(true);
  });

  it('should return true when username is within range', () => {
    // username is neither short or long
    expect(isValidUsername('a'.repeat(minLength + 1))).toBe(true);
    expect(isValidUsername('a'.repeat(maxLength - 1))).toBe(true);
  });

  it('should return false for invalid input types', () => {
    expect(isValidUsername(null)).toBe(false);
    expect(isValidUsername(undefined)).toBe(false);
    expect(isValidUsername(1)).toBe(false);
  });
});

describe('canDrive', () => {
  it.each([
    { age: 16, country: 'US', result: true },
    { age: 17, country: 'US', result: true },
    { age: 15, country: 'US', result: false },
    { age: 17, country: 'UK', result: true },
    { age: 18, country: 'UK', result: true },
    { age: 16, country: 'UK', result: false },
  ])('should return $result for $age, $country', ({ age, country, result }) => {
    expect(canDrive(age, country)).toBe(result);
  });

  it('should return false when countryCode is invalid', () => {
    expect(canDrive(18, 'NG')).toMatch(/invalid/i);
  });
});

describe('fetchData', () => {
  it('should return a promise that resolves to an array of numbers', async () => {
    try {
      const result = await fetchData();

      // expect(Array.isArray(result)).toBe(true);
      // expect(result.length).toBeGreaterThan(0);
    } catch (error) {
      expect(error).toHaveProperty('reason');
      expect(error.reason).toMatch(/failed/i);
    }
  });
});

describe('test suite', () => {
  beforeEach(() => {
    console.log('beforeEach called');
  });
  beforeAll(() => {
    console.log('beforeAll called');
  });

  afterAll(() => {
    console.log('afterAll called');
  });
  afterEach(() => {
    console.log('afterEach called');
  });

  it('test case 1', () => {});

  it('test case 2', () => {});
});

describe('stack', () => {
  let stack;

  beforeEach(() => {
    stack = new Stack();
  });

  it('should return true if length is greater than 0', () => {
    stack.push(1);
    expect(stack.size()).toBe(1);
  });

  it('should return true if length is 0', () => {
    stack.push(1);
    stack.pop();
    expect(stack.size()).toBe(0);
  });

  it('should throw error if stack is empty', () => {
    expect(() => stack.pop()).toThrow(/empty/i);
  });

  it('should return true if peeked value is 1', () => {
    stack.push(1);
    expect(stack.peek()).toBe(1);
  });

  it('should return true if stack is empty', () => {
    stack.push(1);
    stack.pop();

    expect(stack.isEmpty()).toBe(true);
  });

  it('should return true if stack size is 0', () => {
    expect(stack.size()).toBe(0);
  });

  it('should return cleared', () => {
    stack.push(2);
    stack.clear();
    expect(stack.size()).toBe(0);
  });
});
