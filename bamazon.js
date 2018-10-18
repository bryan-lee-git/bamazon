var connection = require("./bamazon_db.js");
var inquirer = require("inquirer");
var colors = require('colors');
var bamazonCustomer = require("./bamazonCustomer.js");
var bamazonManager = require("./bamazonManager.js");
var bamazonSupervisor = require("./bamazonSupervisor.js");

function bamazon() {
    inquirer.prompt([{
        type: "list",
        name: "login",
        message: "Welcome to the Bamazon!",
        choices: ["Log-in", "Create Account", "Exit"]
    }]).then((answers) => {
        if (answers.login === "Log-in") {
            inquirer.prompt([{
                name: "username",
                message: "Enter your username:"
            }]).then((answers) => {
                console.log("\nChecking for username in database...".bgMagenta);
                connection.query(
                    `SELECT * FROM users WHERE user_name = '${answers.username}'`,
                    (err, res) => {
                        if (err || res.length === 0) console.log(`\nUsername ${answers.username} not found. Try again.\n`), bamazon();
                        else if (res[0].user_name === answers.username) {
                            var currentUser = res[0];
                            console.log("\nUser found in system!\n".bgGreen);
                            inquirer.prompt([{
                                type: "password",
                                name: "pw",
                                message: "Enter your password:"
                            }]).then((answers) => {
                                if (answers.pw === currentUser.user_pw) {
                                    console.log(`\nSuccessfully logged-in as ${currentUser.user_name}!\n`.bgGreen);
                                    if (currentUser.user_role === "Customer") bamazonCustomer(currentUser);
                                    else if (currentUser.user_role === "Manager") bamazonManager();
                                    else if (currentUser.user_role === "Supervisor") bamazonSupervisor();
                                } else console.log("\nIncorrect password. Please try again.\n".bgRed), bamazon();
                            });
                        };
                    }
                );
            });
        } else if (answers.login === "Create Account") {
            inquirer.prompt([{
                    name: "name",
                    message: "Please enter a username:"
                },
                {
                    type: "list",
                    name: "role",
                    message: "You are a...",
                    choices: ["Customer", "Manager", "Supervisor"]
                },
                {
                    type: "password",
                    name: "pw",
                    message: "Enter your password"
                }
            ]).then((answers) => {
                console.log("\nAdding new user...\n".bgMagenta);
                connection.query(
                    "INSERT INTO users SET ?", {
                        user_name: answers.name,
                        user_role: answers.role,
                        user_pw: answers.pw
                    },
                    (err) => {
                        if (err) {
                            console.log("\nThere was an issue adding your account. Please try again.\n".bgRed);
                            bamazon();
                        } else {
                            console.log("\nAccount successfully created! Please try to log-in.\n".bgGreen);
                            bamazon();
                        };
                    }
                );
            });
        } else process.exit();
    });
}; bamazon();