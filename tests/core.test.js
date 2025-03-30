import { it, expect, describe } from "vitest";
import { calculateDiscount, getCoupons, validateUserInput } from "../src/core";

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
