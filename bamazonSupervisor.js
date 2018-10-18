var connection = require("./bamazon_db.js");
var inquirer = require("inquirer");
var colors = require('colors');

// functionality for logging dept, product, and sales data to console
function viewDepts(searchType) {
    console.log("\nLoading data...".bgMagenta);
    connection.query(
        `SELECT * FROM ${searchType}`,
        (err, res) => {
            if (err) console.log(`\nThere was an error loading the ${searchType} view.\n`.bgRed);
            console.table(res);
            bamazonSupervisor();
        }
    );
};

// add a new department
function addDept(department_name, overhead_costs) {
    console.log("\nAdding new department...".bgMagenta);
    connection.query(
        "INSERT INTO departments SET ?", {
            department_name,
            overhead_costs
        },
        (err) => {
            if (err) console.log(`\nThere was an error adding the department ${department_name}. Try again.\n`.bgRed);
            console.log(`\nA new department named ${department_name} has been added!\n`.bgGreen);
            bamazonSupervisor();
        }
    );
};

// run program and recursive question/inquirer loop
function bamazonSupervisor() {
    inquirer.prompt([{
        type: "list",
        name: "action",
        message: "What would you like to do?",
        choices: ["View All Departments", "View Sales by Department", "Create New Department", "View Sales by Product", "Exit/Logout"]
    }]).then((answers) => {
        if (answers.action === "View All Departments") viewDepts("all_depts");
        else if (answers.action === "View Sales by Department") viewDepts("sales_by_dept");
        else if (answers.action === "Create New Department") {
            inquirer.prompt([{
                    name: "dept",
                    message: "Enter department name:"
                },
                {
                    name: "overhead",
                    message: "Enter department overhead cost:"
                }
            ]).then((answers) => {
                addDept(answers.dept, parseInt(answers.overhead))
            });
        } else if (answers.action === "View Sales by Product") viewDepts("sales_by_product");
        else console.log("\nThank you for using Bamazon CLI for Supervisors.\nHave a great day! :-D\n".bgCyan), process.exit();
    });
};

// exports
module.exports = bamazonSupervisor;