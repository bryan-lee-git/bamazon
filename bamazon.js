var mysql = require("mysql");
var inquirer = require("inquirer");
var bamazonCustomer = require("./bamazonCustomer.js");
var bamazonManager = require("./bamazonManager.js");
var bamazonSupervisor = require("./bamazonSupervisor.js");

// database connection config
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

function bamazon() {
    inquirer.prompt([
        { type: "list", name: "login", message: "Welcome to the Bamazon!", choices: ["Log-in", "Create Account"] }
    ]).then((answers) => {
        if (answers.login === "Log-in") {
            inquirer.prompt([
                { name: "username", message: "Enter your username:" }
            ]).then((answers) => {
                console.log("Checking for username in database...\n");
                connection.query(`SELECT * FROM users WHERE user_name = '${answers.username}'`, (error, results) => {
                    if (error) console.log("Username not found. Please try again.")
                    else if (results[0].user_name === answers.username) {
                        console.log("User found in system!");
                        inquirer.prompt([
                            { type: "password", name: "pw", message: "Enter your password:" }
                        ]).then((answers) => {
                            if (answers.pw === results[0].user_pw) {
                                console.log(`Successfully logged-in as ${results[0].user_name}!`);
                                if (results[0].user_role === "Customer") bamazonCustomer();
                                else if (results[0].user_role === "Manager") bamazonManager();
                                else if (results[0].user_role === "Supervisor") bamazonSupervisor();
                            } else console.log("Incorrect password. Please try again.");
                        });
                    };
                });
            });
        } else if (answers.login === "Create Account") {
            inquirer.prompt([
                { name: "name", message: "Please enter a username:" },
                { type: "list", name: "role", message: "Are you a...", choices: ["Customer", "Manager", "Supervisor"] },
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
            })
        };
    });
}; bamazon();