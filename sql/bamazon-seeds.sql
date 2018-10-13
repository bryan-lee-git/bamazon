
DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
    item_id INT(10) NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(40) NOT NULL UNIQUE,
    dept_name VARCHAR(40) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT(10) NOT NULL,
    product_sales INT(10) DEFAULT '0',
    PRIMARY KEY(item_id)
);

-- 4. Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).
-- 5. Then create a Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

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

CREATE TABLE departments (
    dept_id INT(10) NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(40),
    overhead_costs DECIMAL(10,2),
    PRIMARY KEY(dept_id)
);

INSERT INTO departments (department_name, overhead_costs)
VALUES ("Electronics", 5000),
("Food/Grocery", 1000),
("Bedroom Furniture", 750),
("Kitchen Supplies", 300),
("Home Goods", 500),
("Musical Instruments", 350),
("Office Furniture", 7000),
("Hardware/Tools", 500),
("Office Supplies", 1200);