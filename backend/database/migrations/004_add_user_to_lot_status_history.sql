USE lot_tracker;

ALTER TABLE lot_status_history
ADD COLUMN user_id INT NOT NULL AFTER lot_id;

ALTER TABLE lot_status_history
ADD CONSTRAINT fk_lot_status_history_user
FOREIGN KEY (user_id) REFERENCES users(id);