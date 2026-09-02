const Lot = require("../models/lot.model");


// ==========================================
// GET ALL LOTS
// PAGINATION + FILTERING + SEARCH
// ==========================================
const getAllLots = async(
    page,
    limit,
    status,
    searchTerm
) => {

    return await Lot.findAll(
        page,
        limit,
        status,
        searchTerm
    );
};


// ==========================================
// GET LOT BY ID
// ==========================================
const getLotById = async(id) => {

    return await Lot.findById(id);
};


// ==========================================
// SEARCH LOTS
// ==========================================
const searchLots = async(searchTerm) => {

    return await Lot.search(searchTerm);
};


// ==========================================
// CREATE LOT
// ==========================================
const createLot = async(lot, userId) => {

    return await Lot.create(
        lot,
        userId
    );
};


// ==========================================
// UPDATE LOT
// OPTIMISTIC CONCURRENCY CONTROL
// ==========================================
const updateLot = async(id, lot) => {

    // Validate version
    if (
        lot.version === undefined ||
        lot.version === null ||
        !Number.isInteger(Number(lot.version)) ||
        Number(lot.version) < 1
    ) {

        return {
            success: false,
            statusCode: 400,
            message: "Valid version is required"
        };
    }

    // Check whether lot exists
    const currentLot = await Lot.findById(id);

    if (!currentLot) {

        return {
            success: false,
            statusCode: 404,
            message: "Lot not found"
        };
    }

    // Check stale version before update
    if (
        Number(lot.version) !==
        Number(currentLot.version)
    ) {

        return {
            success: false,
            statusCode: 409,
            message: "Conflict: lot has been modified by another user",
            currentLot
        };
    }

    // Atomic update with version check
    const result = await Lot.update(
        id,
        lot
    );

    // Update failed because another request
    // changed the version
    if (!result.updated) {

        const latestLot =
            await Lot.findById(id);

        return {
            success: false,
            statusCode: 409,
            message: "Conflict: lot has been modified by another user",
            currentLot: latestLot
        };
    }

    // Get updated lot
    const updatedLot =
        await Lot.findById(id);

    return {
        success: true,
        statusCode: 200,
        message: "Lot updated successfully",
        data: updatedLot
    };
};


// ==========================================
// UPDATE LOT STATUS
// OPTIMISTIC CONCURRENCY CONTROL
// ==========================================
const updateLotStatus = async(
    id,
    newStatus,
    userId,
    version
) => {

    // Allowed statuses
    const allowedStatuses = [
        "RECEIVED",
        "PROCESSING",
        "COMPLETED",
        "REJECTED"
    ];

    // Validate status
    if (!allowedStatuses.includes(newStatus)) {

        return {
            success: false,
            statusCode: 400,
            message: "Invalid status"
        };
    }

    // Validate version
    if (
        version === undefined ||
        version === null ||
        !Number.isInteger(Number(version)) ||
        Number(version) < 1
    ) {

        return {
            success: false,
            statusCode: 400,
            message: "Valid version is required"
        };
    }

    // Get current lot
    const lot = await Lot.findById(id);

    if (!lot) {

        return {
            success: false,
            statusCode: 404,
            message: "Lot not found"
        };
    }

    // Allowed transitions
    const allowedTransitions = {

        RECEIVED: [
            "PROCESSING",
            "REJECTED"
        ],

        PROCESSING: [
            "COMPLETED",
            "REJECTED"
        ],

        COMPLETED: [],

        REJECTED: []
    };

    const allowedNextStatuses =
        allowedTransitions[lot.status] || [];

    // Validate transition
    if (!allowedNextStatuses.includes(newStatus)) {

        return {
            success: false,
            statusCode: 400,
            message: `Invalid status transition from ${lot.status} to ${newStatus}`
        };
    }

    // Update status
    const result =
        await Lot.updateStatus(
            id,
            newStatus,
            userId,
            version
        );

    // Lot not found
    if (!result.found) {

        return {
            success: false,
            statusCode: 404,
            message: "Lot not found"
        };
    }

    // Concurrency conflict
    if (result.conflict) {

        const currentLot =
            await Lot.findById(id);

        return {
            success: false,
            statusCode: 409,
            message: "Conflict: lot has been modified by another user",
            currentLot
        };
    }

    // Success
    return {
        success: true,
        statusCode: 200,
        message: "Lot status updated successfully",
        data: {
            previousStatus: result.currentStatus,

            newStatus: newStatus,

            version: result.newVersion
        }
    };
};


// ==========================================
// GET LOT TRACKING
// ==========================================
const getLotTracking = async(id) => {

    const lot =
        await Lot.findById(id);

    if (!lot) {

        return {
            success: false,
            statusCode: 404,
            message: "Lot not found"
        };
    }

    const history =
        await Lot.getStatusHistory(id);

    return {
        success: true,
        statusCode: 200,
        data: {
            lot,
            history
        }
    };
};


// ==========================================
// DELETE LOT
// ==========================================
const deleteLot = async(id) => {

    return await Lot.delete(id);
};


module.exports = {

    getAllLots,
    getLotById,
    searchLots,
    createLot,
    updateLot,
    updateLotStatus,
    getLotTracking,
    deleteLot

};