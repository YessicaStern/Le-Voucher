import { jest } from "@jest/globals";
import voucherRepository from "repositories/voucherRepository";
import voucherService from "services/voucherService";

describe("Voucher unit test suite ", () => {
    it("should do not create voucher",() => {
        
        const voucher = {
            code: "test",
            discount: 20
        }

        jest
            .spyOn(voucherRepository, "getVoucherByCode")
            .mockImplementationOnce((): any => { return voucher });

        const response = voucherService.createVoucher(voucher.code, voucher.discount);

        expect(response).rejects.toEqual({type:"conflict", message: "Voucher already exist."});

    });

    it("should create voucher", async () => {
        jest
            .spyOn(voucherRepository, "getVoucherByCode")
            .mockImplementationOnce((): any => { });

        jest
            .spyOn(voucherRepository, "createVoucher")
            .mockImplementationOnce((): any => { });

        await voucherService.createVoucher("test", 20);
        expect(voucherRepository.createVoucher).toBeCalled();
    });
    

    it("should voucher does not exist", () => {
        jest
            .spyOn(voucherRepository, "getVoucherByCode")
            .mockImplementation((): any => { return undefined });

        const response = voucherService.applyVoucher("test", 20);

        expect(response).rejects.toEqual({type: "conflict", message: "Voucher does not exist." });
        
    });

    it("should voucher applied to purchases greater than 100", async ()=> {
        const amount = 1;
        const voucher = {
            code: "test",
            discount: 20,
            used: false
        }

        jest
            .spyOn(voucherRepository, "getVoucherByCode")
            .mockImplementationOnce((): any => { return voucher });

        const applyVoucher =  await voucherService.applyVoucher(voucher.code, amount);

        expect(applyVoucher.amount).toBe(amount);
        expect(applyVoucher.discount).toBe(voucher.discount);
        expect(applyVoucher.applied).toBe(voucher.used);
        expect(applyVoucher.finalAmount).toBe(amount);

    });

    it("should apply disccount", async () => {

        const voucher = {
            code: "test",
            discount: 20,
            used: false
        }
        const amount = 150

        jest
            .spyOn(voucherRepository, "getVoucherByCode")
            .mockImplementationOnce((): any => { return voucher });

        jest
            .spyOn(voucherRepository, "useVoucher")
            .mockImplementationOnce((): any => { });

        
        const applyVoucher =  await voucherService.applyVoucher(voucher.code, amount);

        expect(applyVoucher.amount).toBe(amount);
        expect(applyVoucher.discount).toBe(voucher.discount);
        expect(applyVoucher.applied).toBe(!voucher.used);
        expect(applyVoucher.finalAmount).toBe(amount - (voucher.discount * amount)/100);
    });
    
});

