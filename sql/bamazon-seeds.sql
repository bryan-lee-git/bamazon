DROP DATABASE IF EXISTS
	bamazon;
CREATE DATABASE
	bamazon;
USE
	bamazon;
    
CREATE TABLE 
	products (
		item_id INT(10) NOT NULL AUTO_INCREMENT,
		product_name VARCHAR(40) NOT NULL UNIQUE,
		dept_name VARCHAR(40) NOT NULL,
		price DECIMAL(10,2) NOT NULL,
		stock_quantity INT(10) NOT NULL,
		product_sales INT(10) DEFAULT '0',
		PRIMARY KEY(item_id)
	);
    
CREATE VIEW
	customer_storefront
AS SELECT
	product_name AS 'Product Name',
    item_id AS 'Item ID',
    price AS 'Price ($)' 
FROM
	products
WHERE
	stock_quantity > 0;
    
CREATE VIEW
	manager_storefront
AS SELECT
	item_id AS 'ID',
    product_name AS 'Product',
    dept_name AS 'Department',
    price AS 'Price/Unit',
    stock_quantity AS 'In Stock',
    product_sales AS 'Sales'
FROM
	products;
    
CREATE VIEW
	low_inventory
AS SELECT
	item_id AS 'ID',
    product_name AS 'Product',
    dept_name AS 'Department',
    price AS 'Price/Unit',
    stock_quantity AS 'In Stock',
    product_sales AS 'Sales'
FROM
	products
WHERE
	stock_quantity < 5
ORDER BY
	stock_quantity ASC;
    
CREATE VIEW
	sales_by_product
AS SELECT
	item_id AS 'Product ID',
    product_name AS 'Product Name',
    (product_sales / price) AS '# Sold',
    product_sales AS 'Total Sales',
    stock_quantity AS '# In Stock'
FROM
	bamazon.products
ORDER BY
	product_sales DESC;

INSERT INTO
	products (product_name, dept_name, price, stock_quantity)
VALUES
	("Phillips Hue Lights", "Electronics", 50, 20),
	("Canned Tomatoes", "Food/Grocery", 0.99, 1000),
	("Purple Mattress", "Bedroom Furniture", 750, 10),
	("Rubbermaid Pitcher 2-Pack", "Kitchen Supplies", 2, 300),
	("Flower Vase","Home Goods", 30, 5),
	("Acer Computer Monitor", "Electronics", 175, 7),
	("Seagull Acoustic Guitar", "Musical Instruments", 350, 3),
	("Computer Desk", "Office Furniture", 75, 25),
	("Metric Socket Wrench Set", "Hardware/Tools", 15, 500),
	("Printer Paper", "Office Supplies", 5, 1200);

CREATE TABLE
	departments (
		dept_id INT(10) NOT NULL AUTO_INCREMENT,
		department_name VARCHAR(40) NOT NULL,
		overhead_costs DECIMAL(10,2) NOT NULL,
		PRIMARY KEY(dept_id)
	);
    
CREATE VIEW
	all_depts 
AS SELECT
    dept_id AS 'Dept ID',
    department_name AS 'Dept Name',
    overhead_costs AS 'Overhead Costs ($)'
FROM
	bamazon.departments;
    
CREATE VIEW
	sales_by_dept
AS SELECT
	dept_id AS 'Dept ID',
    department_name AS 'Dept Name',
    SUM(product_sales) AS 'Total Sales',
    overhead_costs AS 'Overhead',
    (SUM(product_sales) - overhead_costs) AS 'Profit'
FROM 
	bamazon.products
LEFT JOIN
	bamazon.departments
ON
	bamazon.products.dept_name=bamazon.departments.department_name
GROUP BY 
	department_name
ORDER BY
	profit DESC;

INSERT INTO
	departments (department_name, overhead_costs)
VALUES
	("Electronics", 5000),
	("Food/Grocery", 1000),
	("Bedroom Furniture", 750),
	("Kitchen Supplies", 300),
	("Home Goods", 500),
	("Musical Instruments", 350),
	("Office Furniture", 7000),
	("Hardware/Tools", 500),
	("Office Supplies", 1200);
    
CREATE TABLE
	users (
		user_id INT(10) NOT NULL AUTO_INCREMENT,
        user_name VARCHAR(40) NOT NULL UNIQUE,
        user_role VARCHAR(40) NOT NULL,
        user_pw VARCHAR(40) NOT NULL,
        PRIMARY KEY (user_id)
	);
    
INSERT INTO
	users (user_name, user_role, user_pw)
VALUES
	("usertest", "Customer", "usertest!"),
	("managertest", "Manager", "managertest!"),
	("supervisortest", "Supervisor", "supervisortest!");