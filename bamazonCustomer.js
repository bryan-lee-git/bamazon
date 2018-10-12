// require necessary packages
var mysql = require("mysql");
var inquirer = require("inquirer");
var cart = [];
var totalCost = 0;
var divider = "-----------------------------------";

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
    console.log("Loading data...");
    var query = connection.query(`SELECT * FROM products`, (error, results) => {
        if (error) throw error;
        // console.table(results);
        results.forEach((result) => {
            console.log(`\n${result.product_name}\nItem ID: ${result.item_id}\nPrice: ${result.price}`);
        });
        openBamazon();
    });
    // console.log(query.sql);
};

// check stock or item/quantity user wants to purchase
function checkStock(item, quantity) {
    console.log("Checking stock...");
    var query = connection.query(`SELECT * FROM products WHERE product_name LIKE "%${item}%"`, (error, results) => {
        var currentItem = results[0];
        if (error) {
            console.log(`${item} coult not be found in our database.`);
            openBamazon();
        }
        else if (currentItem.stock_quantity === 0) {
            console.log(`Sorry. ${currentItem.product_name} is currently out of stock.`);
            openBamazon();
        }
        else if (quantity > currentItem.stock_quantity) {
            console.log(`Sorry. There are only ${currentItem.stock_quantity} ${currentItem.product_name}(s) currently in stock.`);
            openBamazon();
        } else {
            console.log(`You're in luck. We have ${currentItem.stock_quantity} ${currentItem.product_name}(s) currently in stock. ${quantity} successfully added to your cart.`);
            var saleTotal = currentItem.price * quantity;
            var totalSales = currentItem.product_sales += saleTotal;
            totalCost += saleTotal;
            currentItem.inCart = (parseInt(quantity));
            cart.push(currentItem);
            var inventory = currentItem.stock_quantity - quantity;
            updateStock(currentItem.product_name, inventory, totalSales);
        };
    });
    // console.log(query.sql);
};

// update an item's stock count
function updateStock(item, inventory, sales) {
    var query = connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            { stock_quantity: inventory, product_sales: sales },
            { product_name: item },
        ],
        (err, res) => {
            if (err) throw err;
            // console.log(res.affectedRows + " products updated!\n");
            openBamazon();
        }
    );
    // console.log(query.sql);
};

// buy an item
function buyItem() {
    inquirer.prompt(
        [
            { name: "item", message: "What would you like to buy?" },
            { name: "quantity", message: "How many?" }
        ]
    ).then((answers) => {
        checkStock(answers.item, answers.quantity);
    });
};

// program initialization and user action interface - recursive inquirer function 
function openBamazon() {
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
                openBamazon();
            break;
            case "Checkout":
                console.log(`Cart Total (before shipping + tax): $${totalCost}`);
                console.table(cart);
            break;
            case "Exit":
            break;
        }
    });
}; openBamazon();