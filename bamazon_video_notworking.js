var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 8889,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon_DB"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected");
    displayAll();
});

function displayAll() {
    connection.query("SELECT * FROM products", function (err, res) {
        for(var i = 0; i < res.length; i++){
            console.log ("(" + res[i].id+ ")" + "(" + res[i].product_name + ")" + "(" + res[i].department_name + ")" + 
            "(" + res[i].price + ")" +"(" + res[i].stock_quantity + ")" + "\n");
        }
        start(res);
    });
}

function start() {
    inquirer
        .prompt([
            {
                name: "choice",
                type: "input",
                message: "what item would you like to buy, selct item id number."
            }])
        .then(function (answer) {
            var correct = false;
            for (var i = 0; i < res.length; i++) {
                if (results[i].product_name == answer.choice) {
                    correct = true;
                    var product = answer.choice
                    var id = i
                    inquirer.prompt({
                        name: "itemQuantity",
                        type: "input",
                        message: "How Many Would you Like?",
                        validate: function (value) {
                            if (isNan(value) == false) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }).then(function (answer) {
                        if ((res[id].stock_quantity - answer.itemQuantity) > 0) {
                            connection.query("UPDATE products SET stock_quantity='" + (res[id].stock_quantity - answer.itemQuantity)
                                + "' WHERE product_name='" + "'", function (err, res2) {
                                    console.log("Product Bought!");
                                    displayAll();
                                })
                        } else {
                            console.log("We're out of that!")
                            promptCustomer(res);
                        }
                    })
                }
            }
        })
}