import { vi, it, expect, describe } from "vitest";
import {
    getPriceInCurrency,
    getShippingInfo,
    renderPage,
    submitOrder,
} from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";
import { trackPageView } from "../src/libs/analytics";
import { charge } from "../src/libs/payment";

vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");
vi.mock("../src/libs/analytics");
vi.mock("../src/libs/payment");

describe("test suite", () => {
    it("test case", () => {
        const greet = vi.fn();

        /**3 ways of mocking a function
         * mockReturnedValue()
         * mockResolvedValue()
         * mockImplementation()
         */

        // greet.mockResolvedValue("hey");

        // greet().then(result => console.log(result));
        greet.mockImplementation(name => `Hey ${name}`);
        const result = greet("sam");

        expect(greet).toHaveBeenCalledWith("sam");
    });
});

describe("getPriceInCurrency", () => {
    it("should return price in target currency", () => {
        vi.mocked(getExchangeRate).mockReturnValue(1.5);

        const price = getPriceInCurrency(10, "AUD");

        expect(price).toBe(15);
    });
});

describe("getShippingInfo", () => {
    it("should match 'shipping unavailable' when quote is undefined", () => {
        // arrange
        vi.mocked(getShippingQuote).mockReturnValue();

        //  act
        const shippingInfo = getShippingInfo("germany");

        // assert
        expect(shippingInfo).toMatch(/unavailable/i);
    });

    it("should return shipping info when quote is defined", () => {
        // arrange
        vi.mocked(getShippingQuote).mockReturnValue({
            cost: 18,
            estimatedDays: 4,
        });

        // act
        const shippingInfo = getShippingInfo("US");

        // assert
        expect(shippingInfo).toMatch("$18");
        expect(shippingInfo).toMatch(/4 days/i);

        // expect(shippingInfo).toMatch(/shipping cost: \$18 \(4 days\)/i);
    });
});

describe("renderPage", () => {
    it("should return correct content", async () => {
        const result = await renderPage();

        expect(result).toMatch(/content/i);
    });

    it("should call analytics", async () => {
        await renderPage();

        expect(trackPageView).toHaveBeenCalledWith("/home");
    });
});

describe("submitOrder", () => {
    const order = { totalAmount: 200 };
    const creditCard = { creditCardNumber: "844" };

    it("should have called charge with creditCard and order", async () => {
        vi.mocked(charge).mockResolvedValue({ status: "success" });

        const result = await submitOrder(order, creditCard);

        expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
    });

    it("should return payment_error if payment failed", async () => {
        vi.mocked(charge).mockResolvedValue({ status: "failed" });

        const result = await submitOrder(order, creditCard);

        expect(result).toEqual({ success: false, error: "payment_error" });
    });

    it("should return success if payment is successful", async () => {
        vi.mocked(charge).mockResolvedValue({ status: "success" });

        const result = await submitOrder(order, creditCard);

        expect(result).toEqual({ success: true });
    });
});
