SELECT
	item_id AS 'Product ID',
    product_name AS 'Product Name',
    (product_sales / price) AS '# Sold',
    stock_quantity AS '# In Stock'
FROM
	bamazon.products
WHERE
	product_sales > 0;