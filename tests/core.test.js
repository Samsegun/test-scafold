import { it, expect, describe } from "vitest";
import {
    calculateDiscount,
    canDrive,
    getCoupons,
    isPriceInRange,
    isValidUsername,
    validateUserInput,
} from "../src/core";

describe("coupons", () => {
    const coupons = getCoupons();

    it("should return array and with a length greater than 0", () => {
        expect(Array.isArray(coupons)).toBe(true);

        expect(coupons.length).toBeGreaterThan(0);
    });

    it("should return an array with valid coupon codes", () => {
        coupons.forEach(coupon => {
            expect(coupon).toHaveProperty("code");
            expect(coupon.code.trim).not.toBe("");

            // code is a string and not empty
            expect(typeof coupon.code).toBe("string");
            expect(coupon.code).toBeTruthy();
        });
    });

    it("should return an array with valid coupon discounts", () => {
        coupons.forEach(coupon => {
            expect(coupon).toHaveProperty("discount");
            expect(typeof coupon.discount).toBe("number");

            // discount is between 0 and 1
            expect(coupon.discount).toBeGreaterThan(0);
            expect(coupon.discount).toBeLessThan(1);
        });
    });
});

describe("calculateDiscount", () => {
    // positive testing
    it("should return discounted price if given valid code", () => {
        expect(calculateDiscount(100, "SAVE10")).toBe(90);
        expect(calculateDiscount(100, "SAVE20")).toBe(80);
    });

    // negative testing
    it("should handle non-numeric price", () => {
        expect(calculateDiscount("100", "SAVE10")).toMatch(/invalid/i);
    });
    it("should handle negative price", () => {
        expect(calculateDiscount(-10, "SAVE10")).toMatch(/invalid/i);
    });
    it("should handle non-string discount code", () => {
        expect(calculateDiscount(50, 20)).toMatch(/invalid/i);
    });
    it("should handle invalid discount code", () => {
        expect(calculateDiscount(50, "SAVE2")).toBe(50);
    });
});

describe("userInput", () => {
    // positive test
    it("should match validation successful", () => {
        expect(validateUserInput("sam", 20)).toMatch(/successful/i);
    });

    // negative tests
    it("should return an error if username is not a string", () => {
        expect(validateUserInput(200, 19)).toMatch(/invalid/i);
    });
    it("should return an error if username is less than 3 characters", () => {
        expect(validateUserInput("pi", 19)).toMatch(/invalid/i);
    });
    it("should return an error if username is longer than 256 characters", () => {
        expect(validateUserInput("a".repeat(256), 19)).toMatch(/invalid/i);
    });

    it("should return an error if age is not a number", () => {
        expect(validateUserInput("john", "20")).toMatch(/invalid/i);
    });
    it("should return an error if age is less than 18", () => {
        expect(validateUserInput("john", 17)).toMatch(/invalid/i);
    });
    it("should return an error if age is greater than 100", () => {
        expect(validateUserInput("john", 101)).toMatch(/invalid/i);
    });

    it("should return an error if age and username is invalid", () => {
        expect(validateUserInput("", 2)).toMatch(/invalid username/i);
        expect(validateUserInput("", 2)).toMatch(/invalid age/i);
    });
});

describe("isPriceInRange", () => {
    it("should return false when price is outside range", () => {
        expect(isPriceInRange(-10, 0, 100)).toBe(false);
        expect(isPriceInRange(200, 0, 100)).toBe(false);
    });

    it("should return true when price is equal to min or max", () => {
        expect(isPriceInRange(0, 0, 100)).toBe(true);
        expect(isPriceInRange(100, 0, 100)).toBe(true);
    });
    it("should return true when price is within range", () => {
        expect(isPriceInRange(50, 0, 100)).toBe(true);
    });
});

describe("isValidUsername", () => {
    const minLength = 5;
    const maxLength = 15;

    it("should return false when username is outside range", () => {
        // username is too short
        expect(isValidUsername("a".repeat(minLength - 1))).toBe(false);
        // username is too long
        expect(isValidUsername("a".repeat(maxLength + 1))).toBe(false);
    });

    it("should return true when username when is equal to min or max", () => {
        expect(isValidUsername("a".repeat(minLength))).toBe(true);
        expect(isValidUsername("a".repeat(maxLength))).toBe(true);
    });

    it("should return true when username is within range", () => {
        // username is neither short or long
        expect(isValidUsername("a".repeat(minLength + 1))).toBe(true);
        expect(isValidUsername("a".repeat(maxLength - 1))).toBe(true);
    });

    it("should return false for invalid input types", () => {
        expect(isValidUsername(null)).toBe(false);
        expect(isValidUsername(undefined)).toBe(false);
        expect(isValidUsername(1)).toBe(false);
    });
});

describe("canDrive", () => {
    const age = 16;
    const countryCode = ["US", "UK"];

    it("should return true when age is equal or greater than 16 and countryCode is US", () => {
        // age is equal 16
        expect(canDrive(age, countryCode[0])).toBe(true);
        // age is above 16
        expect(canDrive(age + 10, countryCode[0])).toBe(true);
    });
    it("should return false when age is less than 16 and countryCode is US", () => {
        expect(canDrive(age - 1, countryCode[0])).toBe(false);
    });

    it("should return true when age is equal or greater than 17 and countryCode is UK", () => {
        // age is equal 17
        expect(canDrive(age + 1, countryCode[1])).toBe(true);
        // age is above 17
        expect(canDrive(age + 20, countryCode[1])).toBe(true);
    });
    it("should return false when age is less than 17 and countryCode is UK", () => {
        expect(canDrive(age, countryCode[1])).toBe(false);
    });

    it("should return false when countryCode is invalid", () => {
        expect(canDrive(age, "NG")).toMatch(/invalid/i);
    });
});
