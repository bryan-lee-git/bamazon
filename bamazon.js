var connection = require("./bamazon_db.js");
var inquirer = require("inquirer");
var bamazonCustomer = require("./bamazonCustomer.js");
var bamazonManager = require("./bamazonManager.js");
var bamazonSupervisor = require("./bamazonSupervisor.js");

function bamazon() {
    inquirer.prompt([
        { type: "list", name: "login", message: "Welcome to the Bamazon!", choices: ["Log-in", "Create Account", "Exit"] }
    ]).then((answers) => {
        if (answers.login === "Log-in") {
            inquirer.prompt([
                { name: "username", message: "Enter your username:" }
            ]).then((answers) => {
                console.log("Checking for username in database...\n");
                connection.query(
                    `SELECT * FROM users WHERE user_name = '${answers.username}'`,
                    (err, res) => {
                        if (err) console.log(`Username ${answers.username} not found. Try again.`);
                        else if (res[0].user_name === answers.username) {
                            console.log("User found in system!");
                            inquirer.prompt([
                                { type: "password", name: "pw", message: "Enter your password:" }
                            ]).then((answers) => {
                                if (answers.pw === res[0].user_pw) {
                                    console.log(`Successfully logged-in as ${res[0].user_name}!`);
                                    if (res[0].user_role === "Customer") bamazonCustomer();
                                    else if (res[0].user_role === "Manager") bamazonManager();
                                    else if (res[0].user_role === "Supervisor") bamazonSupervisor();
                                } else console.log("Incorrect password. Please try again.");
                            });
                        };
                    }
                );
            });
        } else if (answers.login === "Create Account") {
            inquirer.prompt([
                { name: "name", message: "Please enter a username:" },
                { type: "list", name: "role", message: "You are a...", choices: ["Customer", "Manager", "Supervisor"] },
                { type: "password", name: "pw", message: "Enter your password" }
            ]).then((answers) => {
                console.log("Adding new user...\n");
                connection.query(
                    "INSERT INTO users SET ?",
                    { user_name: answers.name, user_role: answers.role, user_pw: answers.pw },
                    (err) => {
                        if (err) {
                            console.log("There was an issue adding your account. Please try again.");
                            bamazon();
                        } else {
                            console.log("Account successfully created! Please try to log-in.");
                            bamazon();
                        };
                    }
                );
            });
        } else process.exit();
    });
}; bamazon();