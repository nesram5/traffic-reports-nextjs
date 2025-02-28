-- Create types table
CREATE TABLE types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(255) NOT NULL UNIQUE
);

-- Create items table
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    zabbix_item VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL UNIQUE,
    type_id INT NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    display_position FLOAT NOT NULL UNIQUE,
    FOREIGN KEY (type_id) REFERENCES types(id)
);

-- Create dates table
CREATE TABLE dates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_date TIMESTAMP NOT NULL UNIQUE
);

-- Create traffic_reports table
CREATE TABLE traffic_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id INT NOT NULL,
    mbps BIGINT,
    report_date_id INT NOT NULL, -- Reference to the dates table via ID
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE,
    FOREIGN KEY (report_date_id) REFERENCES dates(id) ON DELETE CASCADE
);

-- Add indexes for better performance
CREATE INDEX idx_items_name ON items(name);
CREATE INDEX idx_items_display_name ON items(display_name);
CREATE INDEX idx_traffic_reports_item_id ON traffic_reports(item_id);
CREATE INDEX idx_traffic_reports_report_date_id ON traffic_reports(report_date_id);
CREATE INDEX idx_dates_report_date ON dates(report_date);


-- Insert into types
INSERT INTO types (type) VALUES ('FTTH'), ('DSL'), ('Fiber');

-- Insert into items
INSERT INTO items (zabbix_item, name, type_id, display_name, display_position) VALUES
('481188', 'Cogent', 3, 'Cogent (70 Gbps)', 2);


('521371', 'Valencia-DSL', 2, 'Valencia (DSL-1)', 1),
('521372', 'Caracas-Fiber', 3, 'Caracas (Fiber-1)', 2);

-- Insert into dates
INSERT INTO dates (report_date) VALUES
('2023-08-01 00:01:00'),
('2023-08-01 00:02:00'),
('2023-08-01 00:03:00');

-- Insert into traffic_reports
INSERT INTO traffic_reports (item_id, mbps, report_date_id) VALUES
(1, null, 1), -- '2023-08-01 00:01:00'
(2, 95.3, 1),  -- '2023-08-01 00:01:00'
(3, 150.0, 1), -- '2023-08-01 00:01:00'
(1, 110.2, 2), -- '2023-08-01 00:02:00'
(2, 90.1, 2),  -- '2023-08-01 00:02:00'
(3, 145.7, 3); -- '2023-08-01 00:03:00'

SELECT 
    tr.mbps,
    i.name AS item_name,
    i.display_name,
    i.display_position,
    t.type,
    d.report_date
FROM 
    traffic_reports tr
JOIN 
    items i ON tr.item_id = i.id
JOIN 
    types t ON i.type_id = t.id
JOIN 
    dates d ON tr.report_date_id = d.id
WHERE 
    d.report_date = '2025-02-25 17:18:00'
ORDER BY
    i.display_position;

SELECT 
    tr.id AS report_id,
    tr.mbps,
    d.report_date,
    t.type,
    i.display_name
FROM 
    traffic_reports tr
JOIN 
    items i ON tr.item_id = i.id
JOIN 
    types t ON i.type_id = t.id
JOIN 
    dates d ON tr.report_date_id = d.id
WHERE 
    i.name = 'Tocuyito-FTTH';


SELECT 
    tr.id AS report_id,
    tr.mbps,
    d.report_date,
    i.name AS item_name,
    t.type
FROM 
    traffic_reports tr
JOIN 
    items i ON tr.item_id = i.id
JOIN 
    types t ON i.type_id = t.id
JOIN 
    dates d ON tr.report_date_id = d.id
WHERE 
    d.report_date BETWEEN '2023-08-01 00:00:00' AND '2023-08-01 23:59:59';