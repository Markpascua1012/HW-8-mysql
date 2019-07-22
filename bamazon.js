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
    console.log("Connected");
    displayAll();
});

function displayAll() {
    connection.query("SELECT * FROM products", function (err, res) {
        for(var i = 0; i < res.length; i++){
            console.log ("(" + res[i].id+ ")" + "(" + res[i].product_name + ")" + "(" + res[i].department_name + ")" + 
            "(" + res[i].price + ")" +"(" + res[i].stock_quantity + ")" + "\n");
        }
        start();
    });
}

function start() {
    
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].product_name);
                        }
                        return choiceArray;
                    },
                    message: "what item would you like to buy."
                },
                {
                    name: "itemQuantity",
                    type: "input",
                    message: "How many would you like to buy?"
                }
            ]).then(function (answer) {
                if ((results.stock_quantity - answer.itemQuantity) > 0) {
                    connection.query("UPDATE products SET stock_quantity='" + (results.stock_quantity - answer.itemQuantity)
                        + "' WHERE product_name='" + "'", function (err, res2) {
                            console.log("Product Bought!");
                            displayAll();
                        })
                } else {
                    console.log("We're out of that!")
                    displayAll();
                }
            })
            // .then(function (answer) {
            //     var chosenItem;
            //     for (var i = 0; i < results.length; i++) {
            //         if (results[i].product_name === answer.choice) {
            //             chosenItem = results[i];
            //         }
            //     }
            //     if (chosenItem.stock_quantity < parseInt(answer.itemQuantity)) {
            //         connection.query(
            //             "UPDATE products SET ? WHERE ?",
            //             [
            //                 {
            //                     stock_quantity: parseInt(stock_quantity) - parseInt(answer.itemQuantity)
            //                 },
            //                 {
            //                     product_name: chosenItem.product_name
            //                 }
            //             ],
            //             function (error) {
            //                 if (error) throw err;
            //                 console.log("We're out of that! pick another item");
            //                 displayAll();
            //             }
            //         );
            //     }
            //     else {
                    
            //         console.log("your transaction was successful. you will be redirected to selection");
            //         displayAll();
            //     }
            // });


    });
}
