CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
	item_id INTEGER (15) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INTEGER(20) NOT NULL,
	PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ('Red Dead Redemption 2', 'Electronics', 60.00, 20000),
	   ('Super Mario Party', 'Electronics', 60.00,  10000),
       ('Coffee Creamer', 'Grocery', 5.75, 15000),
       ('Huggies Diapers', 'Children', 3.50, 10575),
       ('Yoga Mat', 'Sports', 15.65, 5420),
       ('Nike Sneakers', 'Clothing', 42.85, 9650),
       ('Super Smash Bros Ultimate', 'Electronics', 60.00, 25000),
       ('Dog Food', 'Pets', 50.68, 5000),
       ('Eggs', 'Grocery', 2.55, 7800),
       ('Band Aid', 'Pharmacy', 3.50, 7500);