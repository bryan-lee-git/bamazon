var mysql = require("mysql");
var inquirer = require("inquirer");

// database connection config
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

// log products table to console
function displayItems(searchType) {
    console.log("Loading data...");
    switch(searchType) {
        case "default":
            var search = "SELECT item_id AS 'ID', product_name AS 'Product', dept_name AS 'Department', price AS 'Price/Unit', stock_quantity AS 'In Stock', product_sales AS 'Sales' FROM products";
        break;
        case "lowInv":
            var search = "SELECT item_id AS 'ID', product_name AS 'Product', dept_name AS 'Department', price AS 'Price/Unit', stock_quantity AS 'In Stock', product_sales AS 'Sales' FROM products WHERE stock_quantity < 5";
        break;
    };
    connection.query(search, (err, res) => {
        if (err) throw err;
        console.table(res);
        openBamazonManager();
    });
};

// add a new item
function addItem(product_name, dept_name, price, stock_quantity) {
    console.log("Adding new item...\n");
    connection.query(
        "INSERT INTO products SET ?",
        { product_name, dept_name, price, stock_quantity }, (err, res) => {
            if (err) throw err;
            console.log(res.affectedRows + " new item has been added to the Bamazon store!\n");
            openBamazonManager();
        }
    );
};

// delete an item
function deleteItem(product) {
    console.log("Deleting item...\n");
    connection.query(
        "DELETE FROM products WHERE ?",
        { product_name: product }, (err) => {
            if (err) console.log(`There was an error deleting ${product}. Try again.\n`);
            console.log(`${product} has been deleted successfully.\n`);
            openBamazonManager();
        }
    );
};

// update item inventory
function updateItem(item, newStock) {
    connection.query(
        `UPDATE products SET ? WHERE product_name LIKE "%${item}%"`,
        { stock_quantity: newStock }, (err) => {
            if (err) console.log(`There was an error updating ${item}. Try again.\n`);
            console.log("Product updated!\n");
            openBamazonManager();
        }
    );
};

// program initialization and user action interface - recursive inquirer function 
function openBamazonManager() {
    inquirer.prompt([
        { type: "list", name: "action", message: "Welcome to the Bamazon Manager's Console. What would you like to do?", choices: ["View All Items", "Add New Item", "Update Existing Item", "Delete An Item", "View Low Inventory", "Exit"] }
    ]).then((answers) => {
        switch(answers.action) {
            case "View All Items":
                displayItems("default");
            break;
            case "Add New Item":
                inquirer.prompt([
                    { name: "name", message: "Enter product name:" },
                    { name: "dept", message: "Enter department:" },
                    { name: "price", message: "Enter price per unit:" },
                    { name: "stock", message: "Enter number in stock:" }
                ]).then((answers) => {
                    addItem(answers.name, answers.dept, answers.price, answers.stock);
                });
            break;
            case "Update Existing Item":
                inquirer.prompt([
                    { name: "item", message: "Enter item name:" },
                    { name: "stock", message: "Enter updated inventory amount:" }
                ]).then((answers) => {
                    updateItem(answers.item, answers.stock);
                });
            break;
            case "Delete An Item":
                inquirer.prompt([
                    { name: "product", message: "Enter name of item to be deleted:" }
                ]).then((answers) => {
                    deleteItem(answers.product);
                })
            break;
            case "View Low Inventory":
                displayItems("lowInv");
            break;
            case "Exit":
                console.log("\nPress Control + C to Exit.\nThanks for using Bamazon CLI for Managers.\nHave a great day! :-D\n");
            break;
        };
    });
}; openBamazonManager();