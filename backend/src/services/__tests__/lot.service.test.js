const lotService = require("../lot.service");
const Lot = require("../../models/lot.model");

jest.mock("../../models/lot.model");

describe("Lot Service - Status Transition", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("should allow RECEIVED to PROCESSING", async() => {

        Lot.findById.mockResolvedValue({
            id: 10,
            status: "RECEIVED",
            version: 2
        });

        Lot.updateStatus.mockResolvedValue({
            found: true,
            updated: true,
            conflict: false,
            currentStatus: "RECEIVED",
            currentVersion: 2,
            newVersion: 3
        });

        const result =
            await lotService.updateLotStatus(
                10,
                "PROCESSING",
                2,
                2
            );

        expect(result.success).toBe(true);
        expect(result.statusCode).toBe(200);

        expect(result.data.previousStatus)
            .toBe("RECEIVED");

        expect(result.data.newStatus)
            .toBe("PROCESSING");

        expect(result.data.version)
            .toBe(3);
    });


    test("should reject RECEIVED to COMPLETED", async() => {

        Lot.findById.mockResolvedValue({
            id: 10,
            status: "RECEIVED",
            version: 2
        });

        const result =
            await lotService.updateLotStatus(
                10,
                "COMPLETED",
                2,
                2
            );

        expect(result.success).toBe(false);
        expect(result.statusCode).toBe(400);

        expect(result.message)
            .toBe(
                "Invalid status transition from RECEIVED to COMPLETED"
            );

        expect(Lot.updateStatus)
            .not.toHaveBeenCalled();
    });


    test("should reject stale version with 409 conflict", async() => {

        Lot.findById
            .mockResolvedValueOnce({
                id: 10,
                status: "RECEIVED",
                version: 3
            })
            .mockResolvedValueOnce({
                id: 10,
                status: "RECEIVED",
                version: 3
            });

        Lot.updateStatus.mockResolvedValue({
            found: true,
            updated: false,
            conflict: true
        });

        const result =
            await lotService.updateLotStatus(
                10,
                "PROCESSING",
                2,
                2
            );

        expect(result.success).toBe(false);
        expect(result.statusCode).toBe(409);

        expect(result.message)
            .toBe(
                "Conflict: lot has been modified by another user"
            );

        expect(result.currentLot.version)
            .toBe(3);

        expect(Lot.updateStatus)
            .toHaveBeenCalledWith(
                10,
                "PROCESSING",
                2,
                2
            );
    });


    test("should reject invalid status", async() => {

        const result =
            await lotService.updateLotStatus(
                10,
                "INVALID_STATUS",
                2,
                2
            );

        expect(result.success).toBe(false);
        expect(result.statusCode).toBe(400);

        expect(result.message)
            .toBe("Invalid status");

        expect(Lot.findById)
            .not.toHaveBeenCalled();

        expect(Lot.updateStatus)
            .not.toHaveBeenCalled();
    });


    test("should reject missing version", async() => {

        const result =
            await lotService.updateLotStatus(
                10,
                "PROCESSING",
                2,
                undefined
            );

        expect(result.success).toBe(false);
        expect(result.statusCode).toBe(400);

        expect(result.message)
            .toBe("Valid version is required");

        expect(Lot.findById)
            .not.toHaveBeenCalled();

        expect(Lot.updateStatus)
            .not.toHaveBeenCalled();
    });


    test("should reject invalid version", async() => {

        const result =
            await lotService.updateLotStatus(
                10,
                "PROCESSING",
                2,
                0
            );

        expect(result.success).toBe(false);
        expect(result.statusCode).toBe(400);

        expect(result.message)
            .toBe("Valid version is required");

        expect(Lot.findById)
            .not.toHaveBeenCalled();

        expect(Lot.updateStatus)
            .not.toHaveBeenCalled();
    });


    test("should return 404 when lot does not exist", async() => {

        Lot.findById.mockResolvedValue(null);

        const result =
            await lotService.updateLotStatus(
                999999,
                "PROCESSING",
                2,
                1
            );

        expect(result.success).toBe(false);
        expect(result.statusCode).toBe(404);

        expect(result.message)
            .toBe("Lot not found");

        expect(Lot.updateStatus)
            .not.toHaveBeenCalled();
    });


    test("should allow PROCESSING to REJECTED", async() => {

        Lot.findById.mockResolvedValue({
            id: 10,
            status: "PROCESSING",
            version: 3
        });

        Lot.updateStatus.mockResolvedValue({
            found: true,
            updated: true,
            conflict: false,
            currentStatus: "PROCESSING",
            currentVersion: 3,
            newVersion: 4
        });

        const result =
            await lotService.updateLotStatus(
                10,
                "REJECTED",
                2,
                3
            );

        expect(result.success).toBe(true);
        expect(result.statusCode).toBe(200);

        expect(result.data.previousStatus)
            .toBe("PROCESSING");

        expect(result.data.newStatus)
            .toBe("REJECTED");

        expect(result.data.version)
            .toBe(4);
    });


    test("should reject COMPLETED to PROCESSING", async() => {

        Lot.findById.mockResolvedValue({
            id: 10,
            status: "COMPLETED",
            version: 4
        });

        const result =
            await lotService.updateLotStatus(
                10,
                "PROCESSING",
                2,
                4
            );

        expect(result.success).toBe(false);
        expect(result.statusCode).toBe(400);

        expect(result.message)
            .toBe(
                "Invalid status transition from COMPLETED to PROCESSING"
            );

        expect(Lot.updateStatus)
            .not.toHaveBeenCalled();
    });


    test("should reject REJECTED to PROCESSING", async() => {

        Lot.findById.mockResolvedValue({
            id: 10,
            status: "REJECTED",
            version: 4
        });

        const result =
            await lotService.updateLotStatus(
                10,
                "PROCESSING",
                2,
                4
            );

        expect(result.success).toBe(false);
        expect(result.statusCode).toBe(400);

        expect(result.message)
            .toBe(
                "Invalid status transition from REJECTED to PROCESSING"
            );

        expect(Lot.updateStatus)
            .not.toHaveBeenCalled();
    });

});