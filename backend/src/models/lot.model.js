const db = require("../config/db");

const Lot = {

    // ==========================================
    // FIND ALL LOTS
    // PAGINATION + FILTERING + SEARCH
    // ==========================================
    async findAll(page = 1, limit = 10, status = null, searchTerm = null) {

        const offset = (page - 1) * limit;

        let whereConditions = [];
        let queryParams = [];

        // Filter by status
        if (status) {

            whereConditions.push(
                "status = ?"
            );

            queryParams.push(status);
        }

        // Search
        if (searchTerm) {

            const term = `%${searchTerm}%`;

            whereConditions.push(
                `(lot_number LIKE ?
                OR supplier LIKE ?
                OR material_type LIKE ?
                OR status LIKE ?)`
            );

            queryParams.push(
                term,
                term,
                term,
                term
            );
        }

        // Build WHERE clause
        let whereClause = "";

        if (whereConditions.length > 0) {

            whereClause =
                "WHERE " +
                whereConditions.join(" AND ");
        }

        // Get total records
        const [countRows] = await db.query(
            `SELECT COUNT(*) AS total
             FROM lots
             ${whereClause}`,
            queryParams
        );

        const total = countRows[0].total;

        // Get paginated lots
        const [rows] = await db.query(
            `SELECT *
             FROM lots
             ${whereClause}
             ORDER BY id DESC
             LIMIT ? OFFSET ?`, [
                ...queryParams,
                limit,
                offset
            ]
        );

        return {
            data: rows,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },


    // ==========================================
    // FIND LOT BY ID
    // ==========================================
    async findById(id) {

        const [rows] = await db.query(
            "SELECT * FROM lots WHERE id = ?", [id]
        );

        return rows[0];
    },


    // ==========================================
    // SEARCH LOTS
    // ==========================================
    async search(searchTerm) {

        const term = `%${searchTerm}%`;

        const [rows] = await db.query(
            `SELECT *
             FROM lots
             WHERE lot_number LIKE ?
                OR supplier LIKE ?
                OR material_type LIKE ?
                OR status LIKE ?
             ORDER BY id DESC`, [
                term,
                term,
                term,
                term
            ]
        );

        return rows;
    },


    // ==========================================
    // CREATE LOT
    // TRANSACTION + INITIAL AUDIT
    // ==========================================
    async create(lot, userId) {

        const connection = await db.getConnection();

        try {

            await connection.beginTransaction();

            const [result] = await connection.query(
                `INSERT INTO lots
                (
                    lot_number,
                    supplier,
                    material_type,
                    weight,
                    status,
                    received_date
                )
                VALUES (?, ?, ?, ?, ?, ?)`, [
                    lot.lot_number,
                    lot.supplier,
                    lot.material_type,
                    lot.weight,
                    lot.status || "RECEIVED",
                    lot.received_date
                ]
            );

            // Initial audit record
            await connection.query(
                `INSERT INTO lot_status_history
                (
                    lot_id,
                    user_id,
                    from_status,
                    to_status
                )
                VALUES (?, ?, ?, ?)`, [
                    result.insertId,
                    userId,
                    null,
                    lot.status || "RECEIVED"
                ]
            );

            await connection.commit();

            return result.insertId;

        } catch (error) {

            await connection.rollback();

            throw error;

        } finally {

            connection.release();
        }
    },


    // ==========================================
    // UPDATE LOT
    // OPTIMISTIC CONCURRENCY CONTROL
    // TRANSACTION
    // ==========================================
    async update(id, lot) {

        const connection = await db.getConnection();

        try {

            await connection.beginTransaction();

            const [result] = await connection.query(
                `UPDATE lots
                 SET supplier = ?,
                     material_type = ?,
                     weight = ?,
                     received_date = ?,
                     version = version + 1
                 WHERE id = ?
                 AND version = ?`, [
                    lot.supplier,
                    lot.material_type,
                    lot.weight,
                    lot.received_date,
                    id,
                    lot.version
                ]
            );

            // No row updated means:
            // - lot does not exist
            // OR
            // - version is stale
            if (result.affectedRows === 0) {

                await connection.rollback();

                return {
                    updated: false
                };
            }

            await connection.commit();

            return {
                updated: true
            };

        } catch (error) {

            await connection.rollback();

            throw error;

        } finally {

            connection.release();
        }
    },


    // ==========================================
    // UPDATE STATUS
    // TRANSACTION
    // + FOR UPDATE
    // + OPTIMISTIC CONCURRENCY
    // + AUDIT
    // ==========================================
    async updateStatus(id, status, userId, version) {

        const connection = await db.getConnection();

        try {

            await connection.beginTransaction();

            // Lock the lot row
            const [rows] = await connection.query(
                `SELECT status, version
                 FROM lots
                 WHERE id = ?
                 FOR UPDATE`, [id]
            );

            // Lot does not exist
            if (rows.length === 0) {

                await connection.rollback();

                return {
                    found: false
                };
            }

            const currentStatus = rows[0].status;
            const currentVersion = rows[0].version;

            // Check version
            if (
                Number(version) !==
                Number(currentVersion)
            ) {

                await connection.rollback();

                return {
                    found: true,
                    updated: false,
                    conflict: true,
                    currentStatus,
                    currentVersion
                };
            }

            // Update status and version
            const [result] = await connection.query(
                `UPDATE lots
                 SET status = ?,
                     version = version + 1
                 WHERE id = ?
                 AND version = ?`, [
                    status,
                    id,
                    version
                ]
            );

            // Concurrency conflict
            if (result.affectedRows === 0) {

                await connection.rollback();

                return {
                    found: true,
                    updated: false,
                    conflict: true
                };
            }

            // Insert audit record
            await connection.query(
                `INSERT INTO lot_status_history
                (
                    lot_id,
                    user_id,
                    from_status,
                    to_status
                )
                VALUES (?, ?, ?, ?)`, [
                    id,
                    userId,
                    currentStatus,
                    status
                ]
            );

            // Commit both changes together
            await connection.commit();

            return {
                found: true,
                updated: true,
                conflict: false,
                currentStatus,
                currentVersion,
                newVersion: Number(currentVersion) + 1
            };

        } catch (error) {

            await connection.rollback();

            throw error;

        } finally {

            connection.release();
        }
    },


    // ==========================================
    // GET STATUS HISTORY
    // ==========================================
    async getStatusHistory(id) {

        const [rows] = await db.query(
            `SELECT
                h.id,
                h.lot_id,
                h.user_id,
                u.name AS user_name,
                u.email AS user_email,
                h.from_status,
                h.to_status,
                h.changed_at
             FROM lot_status_history h
             INNER JOIN users u
                 ON h.user_id = u.id
             WHERE h.lot_id = ?
             ORDER BY h.changed_at ASC, h.id ASC`, [id]
        );

        return rows;
    },


    // ==========================================
    // DELETE LOT
    // ==========================================
    async delete(id) {

        const [result] = await db.query(
            "DELETE FROM lots WHERE id = ?", [id]
        );

        return result;
    }

};

module.exports = Lot;