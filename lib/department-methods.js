// prompts and packages required
const { promptUser } = require('../index');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const connection = require('../config/connection');


// View department
const viewDep = () => {
    connection.query(
        `SELECT * FROM department`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            console.table(results);
            promptUser();
        }
    )
} 

// adding department 
const addDep = () => {
    inquirer
        .prompt({
            type: 'text',
            name: 'dep_name',
            message: 'Please enter the name of the department you would like to add: '
        })
        .then((data) => {
            connection.query(
                `INSERT INTO department (name)
                VALUES(?)`,
                [data.dep_name],
                function (err, results, fields) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    console.log('Added department!');
                    promptUser();
                }
            )
        })
}

// exporting the modules
module.exports = { viewDep, addDep }
