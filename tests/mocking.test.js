import { vi, it, expect, describe, beforeEach } from "vitest";
import {
    getDiscount,
    getPriceInCurrency,
    getShippingInfo,
    isOnline,
    login,
    renderPage,
    signUp,
    submitOrder,
} from "../src/mocking";
import { getExchangeRate } from "../src/libs/currency";
import { getShippingQuote } from "../src/libs/shipping";
import { trackPageView } from "../src/libs/analytics";
import { charge } from "../src/libs/payment";
import { sendEmail } from "../src/libs/email";
import security from "../src/libs/security";

vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");
vi.mock("../src/libs/analytics");
vi.mock("../src/libs/payment");
vi.mock("../src/libs/email", async importOriginal => {
    const originalModule = await importOriginal();

    return {
        ...originalModule,
        sendEmail: vi.fn(),
    };
});

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

describe("signUp", () => {
    const email = "name@domain.com";

    // beforeEach(() => {
    //     vi.mocked(sendEmail).mockClear();
    // });

    it("should return false if email is not valid", async () => {
        const result = await signUp("part");

        expect(result).toBe(false);
    });

    it("should return true if email is valid", async () => {
        const result = await signUp(email);

        expect(result).toBe(true);
    });

    it("should send the welcome email if email is valid", async () => {
        const result = await signUp(email);

        expect(sendEmail).toHaveBeenCalledOnce();

        const args = vi.mocked(sendEmail).mock.calls[0];
        expect(args[0]).toBe(email);
        expect(args[1]).toMatch(/welcome/i);
    });
});

describe("login", () => {
    it("should email the one-time login code", async () => {
        const email = "name@domain.com";

        const spy = vi.spyOn(security, "generateCode");

        await login(email);

        const securityCode = spy.mock.results[0].value.toString();
        expect(sendEmail).toHaveBeenCalledWith(email, securityCode);
    });
});

describe("isOnline", () => {
    it("should return false if currentHour is outside opening hours", () => {
        vi.setSystemTime("2025-04-04 07:59");
        expect(isOnline()).toBe(false);

        vi.setSystemTime("2025-04-04 20:01");
        expect(isOnline()).toBe(false);
    });

    it("should return true if currentHour is within opening hours", () => {
        vi.setSystemTime("2025-04-04 08:00");
        expect(isOnline()).toBe(true);

        vi.setSystemTime("2025-04-04 19:59");
        expect(isOnline()).toBe(true);
    });
});

describe("getDiscount", () => {
    it("should return 0.2 discount if it is christmas day", () => {
        vi.setSystemTime("2025-12-25 00:01");
        expect(getDiscount()).toBe(0.2);

        vi.setSystemTime("2025-12-25 23:59");
        expect(getDiscount()).toBe(0.2);
    });

    it("should return 0 discount if it is not christmas day", () => {
        vi.setSystemTime("2025-12-24 23:59");
        expect(getDiscount()).toBe(0);

        vi.setSystemTime("2025-12-26 00:01");
        expect(getDiscount()).toBe(0);
    });
});
