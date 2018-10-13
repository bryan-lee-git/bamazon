var mysql = require("mysql");
var inquirer = require("inquirer");
var cart = [];
var totalCost = 0;

// database connection config
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

// logging products table to console
function displayItems() {
    console.log("Loading data...\n");
    connection.query(`SELECT product_name AS 'Product Name', item_id AS 'Item ID', price AS 'Price ($)' FROM products WHERE stock_quantity > 0`, (error, results) => {
        if (error) throw error;
        console.table(results);
        bamazonCustomer();
    });
};

// check stock or item/quantity user wants to purchase
function checkStock(item, quantity) {
    console.log("Checking stock...");
    connection.query(`SELECT * FROM products WHERE product_name LIKE "%${item}%"`, (error, results) => {
        var currentItem = results[0];
        if (error) {
            console.log(`\n${item} coult not be found in our database.\n`);
            bamazonCustomer();
        } else if (currentItem.stock_quantity === 0) {
            console.log(`\nSorry. ${currentItem.product_name} is currently out of stock.\n`);
            bamazonCustomer();
        } else if (quantity > currentItem.stock_quantity) {
            console.log(`\nSorry. There are only ${currentItem.stock_quantity} ${currentItem.product_name}(s) currently in stock.\n`);
            bamazonCustomer();
        } else {
            console.log(`\nYou're in luck. We have ${currentItem.stock_quantity} ${currentItem.product_name}(s) currently in stock. ${quantity} successfully added to your cart.\n`);
            var saleTotal = currentItem.price * quantity;
            var totalSales = currentItem.product_sales += saleTotal;
            totalCost += saleTotal;
            var cartItem = {
                product: currentItem.product_name,
                quantity: parseInt(quantity),
                price: currentItem.price,
                total: currentItem.price * parseInt(quantity)
            };
            cart.push(cartItem);
            var inventory = currentItem.stock_quantity - quantity;
            updateStock(currentItem.product_name, inventory, totalSales);
        };
    });
};

// update an item's stock count
function updateStock(item, inventory, sales) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            { stock_quantity: inventory, product_sales: sales },
            { product_name: item },
        ], (err) => {
            if (err) throw err;
            bamazonCustomer();
        }
    );
};

// buy an item
function buyItem() {
    inquirer.prompt([
        { name: "item", message: "What would you like to buy?" },
        { name: "quantity", message: "How many?" }
    ]).then((answers) => {
        checkStock(answers.item, answers.quantity);
    });
};

// program initialization and user action interface - recursive inquirer function 
function bamazonCustomer() {
    inquirer.prompt(
        [{
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View Bamazon Items", "Add An Item to Your Cart", "Checkout", "View Cart", "Exit"]
        }]
    ).then((answers) => {
        switch(answers.action) {
            case "View Bamazon Items":
                displayItems();
            break;
            case "Add An Item to Your Cart":
                buyItem();
            break;
            case "View Cart":
                console.log(`Cart Total (before shipping + tax): $${totalCost}`);
                console.table(cart);
                bamazonCustomer();
            break;
            case "Checkout":
                console.log(`Cart Total (before shipping + tax): $${totalCost}`);
                console.table(cart);
            break;
            case "Exit":
                console.log("\nPress Control + C to Exit.\nThanks for using Bamazon CLI.\nHave a great day! :-D\n");
            break;
        }
    });
};

// exports
module.exports = bamazonCustomer;