-- Bamazon Database Structure Seeds
DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
    item_id INT(10) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(40),
    dept_name VARCHAR(40),
    price DECIMAL(10,2),
    stock_quantity INT(10),
    PRIMARY KEY(item_id)
);

-- Mock Data for Development
INSERT INTO products (product_name, dept_name, price, stock_quantity)
VALUES ("Phillips Hue Lights", "Electronics", 50, 20),
("Canned Tomatoes", "Food/Grocery", 0.99, 1000),
("Purple Mattress", "Bedroom Furniture", 750, 10),
("Rubbermaid Pitcher 2-Pack", "Kitchen Supplies", 2, 300),
("Flower Vase","Home Goods", 30, 5),
("Acer Computer Monitor", "Electronics", 175, 7),
("Seagull Acoustic Guitar", "Musical Instruments", 350, 3),
("Computer Desk", "Office Furniture", 75, 25),
("Metric Socket Wrench Set", "Hardware/Tools", 15, 500),
("Printer Paper", "Office Supplies", 5, 1200);