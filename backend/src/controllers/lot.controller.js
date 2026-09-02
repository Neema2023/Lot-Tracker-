const lotService = require("../services/lot.service");


// ==========================================
// GET ALL LOTS
// PAGINATION + FILTERING + SEARCH
// ==========================================
const getAllLots = async(req, res) => {

    try {

        let {
            page = 1,
                limit = 10,
                status,
                search
        } = req.query;

        page = Number(page);
        limit = Number(limit);

        // Validate page
        if (!Number.isInteger(page) ||
            page < 1
        ) {

            return res.status(400).json({
                message: "Page must be a positive integer"
            });
        }

        // Validate limit
        if (!Number.isInteger(limit) ||
            limit < 1 ||
            limit > 100
        ) {

            return res.status(400).json({
                message: "Limit must be between 1 and 100"
            });
        }

        // Validate status
        if (status) {

            const validStatuses = [
                "RECEIVED",
                "PROCESSING",
                "COMPLETED",
                "REJECTED"
            ];

            if (!validStatuses.includes(status)) {

                return res.status(400).json({
                    message: "Invalid status"
                });
            }
        }

        const result =
            await lotService.getAllLots(
                page,
                limit,
                status,
                search
            );

        res.status(200).json(result);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch lots"
        });
    }
};


// ==========================================
// GET LOT BY ID
// ==========================================
const getLotById = async(req, res) => {

    try {

        const lot =
            await lotService.getLotById(
                req.params.id
            );

        if (!lot) {

            return res.status(404).json({
                message: "Lot not found"
            });
        }

        res.status(200).json(lot);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch lot"
        });
    }
};


// ==========================================
// SEARCH LOTS
// ==========================================
const searchLots = async(req, res) => {

    try {

        const { q } = req.query;

        if (!q || !q.trim()) {

            return res.status(400).json({
                message: "Search query is required"
            });
        }

        const lots =
            await lotService.searchLots(
                q.trim()
            );

        res.status(200).json(lots);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to search lots"
        });
    }
};


// ==========================================
// CREATE LOT
// ==========================================
const createLot = async(req, res) => {

    try {

        const userId = req.user.id;

        const lotId =
            await lotService.createLot(
                req.body,
                userId
            );

        res.status(201).json({
            message: "Lot created successfully",
            id: lotId
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to create lot"
        });
    }
};


// ==========================================
// UPDATE LOT
// OPTIMISTIC CONCURRENCY CONTROL
// ==========================================
const updateLot = async(req, res) => {

    try {

        const result =
            await lotService.updateLot(
                req.params.id,
                req.body
            );

        if (!result.success) {

            return res.status(
                result.statusCode
            ).json({
                message: result.message,
                currentLot: result.currentLot
            });
        }

        res.status(200).json({
            message: result.message,
            data: result.data
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update lot"
        });
    }
};


// ==========================================
// UPDATE LOT STATUS
// OPTIMISTIC CONCURRENCY CONTROL
// ==========================================
const updateLotStatus = async(req, res) => {

    try {

        const {
            status,
            version
        } = req.body;

        const userId = req.user.id;

        if (!status) {

            return res.status(400).json({
                message: "Status is required"
            });
        }

        const validStatuses = [
            "RECEIVED",
            "PROCESSING",
            "COMPLETED",
            "REJECTED"
        ];

        if (!validStatuses.includes(status)) {

            return res.status(400).json({
                message: "Invalid status"
            });
        }

        if (
            version === undefined ||
            version === null ||
            !Number.isInteger(
                Number(version)
            ) ||
            Number(version) < 1
        ) {

            return res.status(400).json({
                message: "Valid version is required"
            });
        }

        const result =
            await lotService.updateLotStatus(
                req.params.id,
                status,
                userId,
                version
            );

        if (!result.success) {

            return res.status(
                result.statusCode
            ).json({
                message: result.message,
                currentLot: result.currentLot
            });
        }

        res.status(200).json({
            message: result.message,
            data: result.data
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update lot status"
        });
    }
};


// ==========================================
// GET LOT TRACKING
// ==========================================
const getLotTracking = async(req, res) => {

    try {

        const result =
            await lotService.getLotTracking(
                req.params.id
            );

        if (!result.success) {

            return res.status(
                result.statusCode
            ).json({
                message: result.message
            });
        }

        res.status(200).json(
            result.data
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch lot tracking"
        });
    }
};


// ==========================================
// DELETE LOT
// ==========================================
const deleteLot = async(req, res) => {

    try {

        const result =
            await lotService.deleteLot(
                req.params.id
            );

        if (result.affectedRows === 0) {

            return res.status(404).json({
                message: "Lot not found"
            });
        }

        res.status(200).json({
            message: "Lot deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to delete lot"
        });
    }
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