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


    
});

