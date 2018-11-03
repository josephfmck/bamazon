//Required dependencies
var inquirer = require('inquirer');
var mysql = require('mysql');

//Define MySQL connection parameters
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,

    //Your username
    user: 'root',

    //Your password
    password: '',
    database: 'bamazon_DB'
});

//validateInput makes sure that the user is only entering positive integers for their inputs
function validateInput(value) {         //value is coming from the input in the prompt
    var integer = Number.isInteger(parseFloat(value));      //Number represented that if is an integer returns true and parses that integer value
    var sign = Math.sign(value);                            //sign indicates if positive (1) negative(-1) or zero (0)

    if (integer && (sign === 1)) {          //if it is an integer and positive
        return true;
    } else {
        return 'Please enter a whole number that is not zero.';
    }
}

//promptPurchase prompts the user for the item/quantity they want to purchase
function promptPurchase() {

    //Prompt the user to select an item    
        //inquirer.prompt(questions) -> promise
    inquirer.prompt([               //prompt using questions object input inside
        {
            type: 'input',
            name: 'item_id',
            message: 'Please enter the Item ID which you would like to purchase.',
            validate: validateInput,            //Validate Function Receive the user input and answers hash tables "validateInput". True if the value is valid
            filter: Number                          //input in this case is the value passed into the validateInput function
                                                    //the value comes from our prompt which should be a positive integer. 
        },
        {
            type: 'input',
            name: 'quantity',
            message: 'How many do you need?',
            validate: validateInput,
            filter: Number                      //filter function Receive the user input and return the filtered value to be used inside the program. The value returned will be added to the Answers hash
        }
    ]).then(function (input) {      //using promise
        //console.log('Customer has selected: \n    item_id = '  + input.item_id + '\n    quantity = ' + input.quantity);

        var item = input.item_id;               //item set to item_id in database
        var quantity = input.quantity;          //quant set to quantity in database

        //Query db to confirm that the given item ID exists in the desired quantity
        var queryStr = 'SELECT * FROM products WHERE ?';  
                                        //WHERE item_id in database is equal to the item var inputed
        connection.query(queryStr, { item_id: item }, function (err, data) {
            if (err) throw err;

            // If the user has selected an invalid item ID, data array will be empty
            // console.log('data = ' + JSON.stringify(data));

            if (data.length === 0) {
                console.log('ERROR: Invalid Item ID. Please select a valid Item ID.');
                displayInventory();

            } else {
                var productData = data[0];       //data[0] is object containing data of item you chose   

                //console.log('productData = ' + JSON.stringify(productData));
                //console.log('productData.stock_quantity = ' + productData.stock_quantity);

                // If the quantity requested by the user is in stock (less than or equal to quantity in stock)
                if (quantity <= productData.stock_quantity) {
                    console.log('The product you requested is in stock. Now placing the order.');

                    // Construct the updating query string          updates stock quantity by subtracting in stock by quantity chosen WHERE   the item_id is equal to item chosen                             
                    var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
                    // console.log('updateQueryStr = ' + updateQueryStr);

                    //Update the inventory
                    connection.query(updateQueryStr, function (err, data) {
                        if (err) throw err;

                        console.log('Order has been placed. Your total is $' + productData.price * quantity);
                        console.log("\n---------------------------------------------------------------------\n");

                        //End the database connection
                        connection.end();
                    })
                } else {
                    console.log('Not enough product in stock. Your order was not placed.');
                    console.log("\n---------------------------------------------------------------------\n");

                    displayInventory();
                }
            }
        })
    })
}

//displayInventory will retrieve the current inventory from the database and output it to the console
function displayInventory() {
    //console.log('___ENTER displayInventory___');    

    //db query string            displays all from products
    queryStr = 'SELECT * FROM products';

    //db query
    connection.query(queryStr, function (err, data) {
        if (err) throw err;

        console.log('Existing Inventory: ');
        console.log('==================\n');

        var inventory = '';        //create empty string to enter the displayed info into 
        for (var i = 0; i < data.length; i++) {
            inventory = '';            //loop to set up empty string for every item
            inventory += 'Item ID: ' + data[i].item_id + '  //  ';     //add item's data for each specific item
            inventory += 'Product Name: ' + data[i].product_name + '  //  ';
            inventory += 'Department: ' + data[i].department_name + '  //  ';
            inventory += 'Price: $' + data[i].price + '\n';

            console.log(inventory);
        }

        console.log("===============================================================\n");

        //Prompt the user for item/quantity they would like to purchase
        promptPurchase();
    })
}

//runBamazon will execute the main application logic
function runBamazon() {
    //console.log('___ENTER runBamazon___');

    //Display the available inventory
    displayInventory();
}

//Run the application logic
runBamazon();