
DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
    item_id INT(10) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(40),
    dept_name VARCHAR(40),
    price DECIMAL(10,2),
    stock_quantity INT(10),
    product_sales INT(10),
    PRIMARY KEY(item_id)
);

-- 4. Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).
-- 5. Then create a Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

INSERT INTO products (product_name, dept_name, price, stock_quantity, product_sales)
VALUES ("Phillips Hue Lights", "Electronics", 50, 20, 0),
("Canned Tomatoes", "Food/Grocery", 0.99, 1000, 0),
("Purple Mattress", "Bedroom Furniture", 750, 10, 0),
("Rubbermaid Pitcher 2-Pack", "Kitchen Supplies", 2, 300, 0),
("Flower Vase","Home Goods", 30, 5, 0),
("Acer Computer Monitor", "Electronics", 175, 7, 0),
("Seagull Acoustic Guitar", "Musical Instruments", 350, 3, 0),
("Computer Desk", "Office Furniture", 75, 25, 0),
("Metric Socket Wrench Set", "Hardware/Tools", 15, 500, 0),
("Printer Paper", "Office Supplies", 5, 1200, 0);

CREATE TABLE departments (
    dept_id INT(10) NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(40),
    overhead_costs DECIMAL(10,2),
    PRIMARY KEY(dept_id)
);