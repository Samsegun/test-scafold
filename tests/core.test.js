import { it, expect, describe } from "vitest";
import { calculateDiscount, getCoupons } from "../src/core";

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
    it("should return discounted price if given valid code", () => {
        const result = calculateDiscount(100, "SAVE10");
        expect(result).toBe(90);
    });
});
