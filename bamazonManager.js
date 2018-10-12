// require necessary packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var divider = "-----------------------------------";

// create connection config info
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
            var search = "SELECT * FROM products";
        break;
        case "lowInv":
            var search = "SELECT * FROM products WHERE stock_quantity < 5";
    }
    var query = connection.query(search, (error, results) => {
        if (error) throw error;
        console.table(results);
        openBamazonManager();
    });
    console.log(query.sql);
};

// add a new item
function addItem(product_name, dept_name, price, stock_quantity) {
    console.log("Adding new item...\n");
    var query = connection.query(
        "INSERT INTO products SET ?",
        {
            product_name,
            dept_name,
            price,
            stock_quantity
        },
        (err, res) => {
            if (err) throw err;
            console.log(res.affectedRows + " new item has been added to the Bamazon store!\n");
            openBamazonManager();
        }
    );
    // logs the actual query being run
    // console.log(query.sql);
};

// delete an item
function deleteItem(product) {
    console.log("Deleting item...\n");
    var query = connection.query(
        "DELETE FROM products WHERE ?",
        { product_name: product },
        (err) => {
            if (err) console.log(`There was an error deleting ${product}. Try again.\n`);
            console.log(`${product} has been deleted successfully.\n`);
            openBamazonManager();
        }
    );
    // console.log(query.sql);
};

// update item inventory
function updateItem(item, newStock) {
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            { stock_quantity: `${newStock}` },
            { product_name: `${item}` }
        ],
        (err) => {
            if (err) console.log(`There was an error updating ${item}. Try again.\n`);
            console.log("Product updated!\n");
            openBamazonManager();
        }
    );
    // console.log(query.sql);
};

// prpogram initialization and user action interface - recursive inquirer function 
function openBamazonManager() {
    inquirer.prompt([
        { type: "list", name: "action", message: "Welcome to the Bamazon Manager's Console. What would you like to do?", choices: ["View All Items", "Add New Item", "Update Existing Item", "Delete An Item", "View Low Inventory", "Exit Console"] }
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
            case "Exit Console":
            break;
        };
    });
}; openBamazonManager();