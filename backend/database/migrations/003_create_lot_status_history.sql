USE lot_tracker;

CREATE TABLE lot_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lot_id INT NOT NULL,
    from_status ENUM(
        'RECEIVED',
        'PROCESSING',
        'COMPLETED',
        'REJECTED'
    ) NULL,
    to_status ENUM(
        'RECEIVED',
        'PROCESSING',
        'COMPLETED',
        'REJECTED'
    ) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_lot_status_history_lot
        FOREIGN KEY (lot_id)
        REFERENCES lots(id)
        ON DELETE CASCADE
);