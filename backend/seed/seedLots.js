require("dotenv").config();

const mysql = require("mysql2/promise");

const TOTAL_LOTS = 100000;
const BATCH_SIZE = 1000;

// User responsible for seeded audit records
const SEED_USER_ID = 2;

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const suppliers = [
    "Supplier A",
    "Supplier B",
    "Supplier C",
    "Supplier D",
    "Supplier E"
];

const materialTypes = [
    "Steel",
    "Aluminum",
    "Copper",
    "Iron",
    "Plastic"
];

const statuses = [
    "RECEIVED",
    "PROCESSING",
    "COMPLETED",
    "REJECTED"
];

function randomItem(items) {
    return items[
        Math.floor(Math.random() * items.length)
    ];
}

function randomWeight() {
    return (
        Math.random() * 4900 + 100
    ).toFixed(2);
}

function randomDate() {
    const start =
        new Date("2025-01-01");

    const end =
        new Date("2026-09-01");

    const timestamp =
        start.getTime() +
        Math.random() *
        (end.getTime() - start.getTime());

    return new Date(timestamp)
        .toISOString()
        .slice(0, 10);
}


async function seedLots() {

    console.log(
        `Starting seed for ${TOTAL_LOTS} lots...`
    );

    const connection =
        await pool.getConnection();

    try {

        await connection.beginTransaction();


        for (
            let start = 1; start <= TOTAL_LOTS; start += BATCH_SIZE
        ) {

            const values = [];

            const end = Math.min(
                start + BATCH_SIZE - 1,
                TOTAL_LOTS
            );


            for (
                let i = start; i <= end; i++
            ) {

                const lotNumber =
                    `SEED-${String(i).padStart(6, "0")}`;

                values.push([
                    lotNumber,
                    randomItem(suppliers),
                    randomItem(materialTypes),
                    randomWeight(),
                    randomItem(statuses),
                    randomDate()
                ]);

            }


            /*
            ==================================================
            INSERT LOTS
            ==================================================
            */

            await connection.query(
                `INSERT INTO lots
                (
                    lot_number,
                    supplier,
                    material_type,
                    weight,
                    status,
                    received_date
                )
                VALUES ?`, [values]
            );


            /*
            ==================================================
            INSERT INITIAL AUDIT RECORDS
            ==================================================
            */

            await connection.query(
                `INSERT INTO lot_status_history
                (
                    lot_id,
                    user_id,
                    from_status,
                    to_status,
                    changed_at
                )
                SELECT
                    l.id,
                    ?,
                    NULL,
                    l.status,
                    l.created_at
                FROM lots l
                WHERE l.lot_number >= ?
                  AND l.lot_number <= ?`, [
                    SEED_USER_ID,
                    `SEED-${String(start).padStart(6, "0")}`,
                    `SEED-${String(end).padStart(6, "0")}`
                ]
            );


            console.log(
                `Inserted ${end} / ${TOTAL_LOTS} lots and audit records`
            );

        }


        await connection.commit();


        console.log(
            "100,000 lots and audit records inserted successfully!"
        );


    } catch (error) {

        await connection.rollback();

        console.error(
            "Seed failed:",
            error
        );

    } finally {

        connection.release();

        await pool.end();

    }

}


seedLots();