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

// functionality for logging dept, product, and sales data to console
function viewDepts(searchType) {
    console.log("Loading data...");
    if (searchType === "All") {
        connection.query("SELECT dept_id AS 'Dept ID', department_name AS 'Dept Name', overhead_costs AS 'Overhead Costs ($)' FROM bamazon.departments;", (error, results) => {
            if (error) throw error;
            console.table(results);
            openBamazon();
        });
    } else if (searchType === "Sales by Dept") {
        connection.query("SELECT dept_id AS 'Dept ID', department_name AS 'Dept Name', SUM(product_sales) AS 'Total Sales', overhead_costs AS 'Overhead', (SUM(product_sales) - overhead_costs) AS 'Profit' FROM bamazon.products LEFT JOIN bamazon.departments ON bamazon.products.dept_name=bamazon.departments.department_name GROUP BY department_name ORDER BY PROFIT DESC;", (error, results) => {
            if (error) throw error;
            console.table(results);
            openBamazon();
        });
    } else if (searchType === "Products with Sales") {
        connection.query("SELECT product_id AS 'Product ID', product_name AS 'Product Name', (product_sales / price) AS '# Sold', stock_quantity AS '# In Stock' FROM bamazon.products WHERE product_sales > 0;", (error, results) => {
            if (error) throw error;
            console.table(results);
            openBamazon();
        });
    }
};

// add a new department
function addDept(department_name, overhead_costs) {
    console.log("Adding new department...\n");
    var query = connection.query(
        "INSERT INTO departments SET ?",
        {
            department_name,
            overhead_costs,
        },
        (err, res) => {
            if (err) throw err;
            console.log(res.affectedRows + ` new department for ${department_name} has been added to the Bamazon store!\n`);
            openBamazon();
        }
    );
    // console.log(query.sql);
};

// run the program and recursive question/inquirer loop for user functionality
function openBamazon() {
    inquirer.prompt(
        [{
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: ["View All Departments", "View Sales by Department", "Create New Department", "View All Products w/ Sales", "Exit"]
        }]
    ).then((answers) => {
        switch(answers.action) {
            case "View All Departments": 
                viewDepts("All");
            break;
            case "View Sales by Department":
                viewDepts("Sales by Dept");
            break;
            case "Create New Department":
                inquirer.prompt([
                    { name: "dept", message: "Enter department name:" },
                    { name: "overhead", message: "Enter department overhead cost:" }
                ]).then((answers) => { 
                    addDept(answers.dept, parseInt(answers.overhead))
                });
            break;
            case "View All Products w/ Sales":
                viewDepts("Products with Sales");
            break;
            case "Exit":
                console.log("\nPress Control + C to Exit.\nThanks for using Bamazon CLI for Supervisors.\nHave a great day! :-D\n");
            break;
        };
    });
}; openBamazon();