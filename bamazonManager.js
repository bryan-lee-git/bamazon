var connection = require("./bamazon_db.js");
var inquirer = require("inquirer");
var colors = require('colors');

// log products table to console
function displayItems(searchType) {
    console.log("\nLoading data...".bgMagenta);
    connection.query(
        `SELECT * FROM ${searchType}`,
        (err, res) => {
            if (err) console.log(`\nThere was an error loading the ${searchType} view.\n`.bgRed);
            console.table(res);
            bamazonManager();
        }
    );
};

// add a new item to store
function addItem(product_name, dept_name, price, stock_quantity) {
    console.log("\nAdding new item...".bgMagenta);
    connection.query(
        "INSERT INTO products SET ?", {
            product_name,
            dept_name,
            price,
            stock_quantity
        },
        (err) => {
            if (err) console.log(`\nThere was an error adding ${product_name}. Try again.`.bgRed);
            console.log(`\n${product_name} has been added to the Bamazon store!\n`.bgGreen);
            bamazonManager();
        }
    );
};

// delete an item from store
function deleteItem(product) {
    console.log("\nDeleting item...".bgMagenta);
    connection.query(
        "DELETE FROM products WHERE ?", {
            product_name: product
        },
        (err) => {
            if (err) console.log(`\nThere was an error deleting ${product}. Try again.\n`.bgRed);
            console.log(`\n${product} has been deleted successfully.\n`.bgGreen);
            bamazonManager();
        }
    );
};

// update item inventory
function updateItem(item, newStock) {
    connection.query(
        `UPDATE products SET ? WHERE product_name LIKE "%${item}%"`, {
            stock_quantity: newStock
        },
        (err) => {
            if (err) console.log(`\nThere was an error updating ${item}. Try again.\n`.bgRed);
            console.log(`\n${item} has been updated!\n`.bgGreen);
            bamazonManager();
        }
    );
};

// program initialization and user action interface - recursive inquirer function 
function bamazonManager() {
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "Welcome to the Bamazon Manager's Console. What would you like to do?",
        choices: ["View All Items", "Add New Item", "Update Existing Item", "Delete An Item", "View Low Inventory", "Exit/Log-Out"]
    }]).then((answers) => {
        if (answers.action === "View All Items") displayItems("manager_storefront");
        else if (answers.action === "Add New Item") {
            inquirer.prompt([{
                    name: "name",
                    message: "Enter product name:"
                },
                {
                    name: "dept",
                    message: "Enter department:"
                },
                {
                    name: "price",
                    message: "Enter price per unit:"
                },
                {
                    name: "stock",
                    message: "Enter number in stock:"
                }
            ]).then((answers) => {
                addItem(answers.name, answers.dept, answers.price, answers.stock);
            });
        } else if (answers.action === "Update Existing Item") {
            inquirer.prompt([{
                    name: "item",
                    message: "Enter item name:"
                },
                {
                    name: "stock",
                    message: "Enter updated inventory amount:"
                }
            ]).then((answers) => {
                updateItem(answers.item, answers.stock);
            });
        } else if (answers.action === "Delete An Item") {
            inquirer.prompt([{
                name: "product",
                message: "Enter name of item to be deleted:"
            }]).then((answers) => {
                deleteItem(answers.product);
            });
        } else if (answers.action === "View Low Inventory") displayItems("low_inventory");
        else console.log("\nThank you for using Bamazon CLI for Managers.\nHave a great day! :-D\n".bgCyan), process.exit();
    });
};

// exports
module.exports = bamazonManager;