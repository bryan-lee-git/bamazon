const connection = require("./bamazon_db.js");
const inquirer = require("inquirer");
var colors = require('colors');
var totalCost = 0;
var currentCart = undefined;

var Cart = function (username) {
    this.name = username;
    this.items = [];
};

function createCart(user) {
    if (currentCart === undefined) currentCart = new Cart(user.user_name);
};

// logging products table to console
function displayItems() {
    console.log("\nLoading the Bamazon Store...".bgMagenta);
    connection.query(
        `SELECT * FROM customer_storefront`,
        (err, res) => {
            if (err) console.log(`\nThere was an error loading the Bamazon Store. Try again.\n`.bgRed);
            console.table(res);
            bamazonCustomer();
        }
    );
};

// check stock or item/quantity user wants to purchase
function checkStock(item, quantity) {
    console.log("\nChecking stock...".bgMagenta);
    connection.query(
        `SELECT * FROM products WHERE product_name LIKE "%${item}%"`,
        (err, res) => {
            var currentItem = res[0];
            if (err || res.length === 0) {
                console.log(`\n${item} coult not be found in our database.\n`.bgRed);
                bamazonCustomer();
            } else if (currentItem.stock_quantity === 0) {
                console.log(`\nSorry. ${currentItem.product_name} is currently out of stock.\n`.bgRed);
                bamazonCustomer();
            } else if (quantity > currentItem.stock_quantity) {
                console.log(`\nSorry. There are only ${currentItem.stock_quantity} ${currentItem.product_name}(s) currently in stock.\n`.bgRed);
                bamazonCustomer();
            } else {
                console.log(`\nYou're in luck. We have ${currentItem.stock_quantity} ${currentItem.product_name}(s) currently in stock. ${quantity} successfully added to your cart.\n`.bgGreen);
                var cartItem = {
                    product: currentItem.product_name,
                    quantity: parseInt(quantity),
                    price: currentItem.price,
                    total: currentItem.price * parseInt(quantity)
                };
                currentCart.items.push(cartItem);
                var saleTotal = currentItem.price * quantity;
                var totalSales = currentItem.product_sales += saleTotal;
                totalCost += saleTotal;
                var inventory = currentItem.stock_quantity - quantity;
                updateStock(currentItem.product_name, inventory, totalSales);
            };
        }
    );
};

// update an item's stock count
function updateStock(item, inventory, sales) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [{
                stock_quantity: inventory,
                product_sales: sales
            },
            {
                product_name: item
            }
        ],
        (err) => {
            if (err) console.log(`\nThere was an error updating the stock.\nA message about this error has been sent to Bamazon management.\n`.bgRed);
            bamazonCustomer();
        }
    );
};

// program initialization and user action interface - recursive inquirer function 
function bamazonCustomer(user) {
    createCart(user);
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["View Bamazon Items", "Add An Item to Your Cart", "Checkout", "View Cart", "Empty Cart", "Exit/Log-Out"]
    }]).then((answers) => {
        if (answers.action === "View Bamazon Items") displayItems();
        else if (answers.action === "Add An Item to Your Cart") {
            inquirer.prompt([{
                    name: "item",
                    message: "What would you like to buy?"
                },
                {
                    name: "quantity",
                    message: "How many?"
                }
            ]).then((answers) => {
                checkStock(answers.item, answers.quantity);
            });
        } else if (answers.action === "View Cart") {
            if (currentCart.items.length > 0) {
                console.log(`\nCart Total (before shipping + tax): $${totalCost}\n`.bgCyan);
                console.table(currentCart.items);
                bamazonCustomer();
            } else console.log("\nThere are no items in your cart.\n".bgRed), bamazonCustomer();
        } else if (answers.action === "Empty Cart") {
            currentCart.items = [];
            totalCost = 0;
            console.log("\nYour cart has been emptied.\n".bgGreen);
            bamazonCustomer();
        } else if (answers.action === "Checkout") {
            if (totalCost === 0) console.log("\nThere are no items in your cart to checkout with.\n".bgRed), bamazonCustomer();
            else {
                console.log(`\nThank you for your order! We greatly appreciate your business.\nThe card you have on file has been charged for $${totalCost}.\nExpect your items to be delivered within 2-3 business days.\n`.bgGreen);
                console.table(currentCart.items);
                currentCart.items = [];
                totalCost = 0;
                bamazonCustomer();
            };
        } else console.log("\nThanks for shopping with Bamazon.\nHave a great day! :-D\n".bgCyan), process.exit();
    });
};

// exports
module.exports = bamazonCustomer;