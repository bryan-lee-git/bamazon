SELECT department_name AS 'Department', SUM(product_sales) AS 'Total Sales', overhead_costs AS 'Overhead', (SUM(product_sales) - overhead_costs) AS 'Profit' FROM bamazon.products LEFT JOIN bamazon.departments
ON bamazon.products.dept_name=bamazon.departments.department_name
GROUP BY department_name
ORDER BY PROFIT DESC;