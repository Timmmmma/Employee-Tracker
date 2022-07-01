const inquirer = require('inquirer');
const mysql = require("mysql2");
require("console.table");

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

// Connect to database
const connection = mysql.createConnection(
    {
        host: "localhost",

        // Enter your username here
        user: 'root',
        // Enter your password here
        password: 'root',
        database: 'employees_db'
    },
    console.log("Connected to the database."),
  );
  

// Express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Default response
app.use((req, res) => {
  res.status(404).end();
});


connection.connect(err => {
  if (err) throw err;
  console.log('Welcome!');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    //Turn to the menu
    mainPage();
  });
});

//Main page
const mainPage = () => {
    inquirer
        .prompt({
            type: 'list',
            name: 'chioces',
            message: 'What would you like to do?',
            choices: [
                'View All Employees', 
                'View All Employees By Department', 
                'View All Employees By Manager', 
                'Add Employee', 
                'Update Employee Role', 
                'View All Department', 
                'Add Department', 
                'View Roles', 
                'Add Role',  
                'I am finished'
            ]
        })
        //Go to the next function according to users choice
        .then((data) => {
            switch (data['chioces']) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'View All Employees By Department':
                    viewEmployeeByDepartment();
                    break;
                case 'View All Employees By Manager':
                    viewEmployeeByManagment();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee Role':
                    updateEmployee();
                    break;
                case 'View All Department':
                    viewDepartment();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'View Roles':
                    viewRoles();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'I am finished':
                    connection.end();
                    console.log("\nGoodbye!");
                    process.exit(0);
            }
        })
};

//-------------------------------Employee---------------------------------
//View Employees/ READ all, SELECT * FROM
const viewAllEmployees = () => {
    connection.query(
        `SELECT employee.id, employee.first_name, employee.last_name, roles.title AS role, roles.salary AS salary, manager.first_name AS manager,
        department.name AS department 
        FROM employee
        LEFT JOIN roles
        ON employee.role_id = roles.id
        LEFT JOIN department
        ON roles.department_id = department.id
        LEFT JOIN manager
        ON employee.manager_id = manager.id`,

        function (err, results) {
            if (err) {
                console.log(err.message);
                return;
            }

            //Show the table
            console.table(results);

            //Return to the main page
            mainPage();
        }
    );
};

//"View Employees by Department" / READ by, SELECT * FROM
const viewEmployeeByDepartment = () => {
    connection.query(
        `SELECT * FROM department`,

        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }
            //Make an array for departments and select from here so it will not miss any newly added department
            departmentArray = [];
            results.forEach(item => {
                departmentArray.push(item.name)
            });
            inquirer
                .prompt({
                    type: 'list',
                    name: 'filter-emp-dep',
                    message: 'Choose a department from below:',
                    choices: departmentArray
                })
                .then((data) => {
                    connection.query(
                        `SELECT employee.id, employee.first_name, employee.last_name, department.name AS department 
                            FROM employee
                            LEFT JOIN roles
                            ON employee.role_id = roles.id
                            LEFT JOIN department
                            ON roles.department_id = department.id
                            WHERE department.name = ?`,
                        [data['filter-emp-dep']],
                        function (err, results, fields) {
                            if (err) {
                                console.log(err.message);
                                return;
                            }
                            console.table(results);
                            //Return to main page
                            mainPage();
                        }
                    )
                });
        }
    );
};

//"View Employees by Department" / READ by, SELECT * FROM
const viewEmployeeByManagment = () => {
    connection.query(
        `SELECT * FROM manager`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }
            //Make an array for managers and select from here so it will not miss any newly added manager
            managerArray = [];
            results.forEach(item => {
                managerArray.push(item.first_name)
            })

            inquirer
                .prompt({
                    type: 'list',
                    name: 'filter-emp-man',
                    message: 'Choose a manager to filter from:',
                    choices: managerArray
                })
                .then((data) => {
                    connection.query(
                        `SELECT employee.id, employee.first_name, manager.first_name AS manager
                            FROM employee
                            LEFT JOIN manager
                            ON employee.manager_id = manager.id
                            WHERE manager.first_name = ?`,
                        [data['filter-emp-man']],
                        function (err, results, fields) {
                            if (err) {
                                console.log(err.message);
                                return;
                            }
                            console.table(results);
                            //Return to main page
                            mainPage();
                        }
                    );
                });

        }
    );
};

// Add a new employee
const addEmployee = () => {
    connection.query(
        //Selcet the role table first
        `SELECT * FROM roles`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            ////Make an array for role and select from here so it will not miss any newly added role
            let roleArray = [];
            results.forEach(item => {
                roleArray.push(item.title)
            })
            connection.query(
                //Selcet the manager tbale second
                `SELECT * FROM manager`,
                function (err, results, fields) {
                    if (err) {
                        console.log(err.message);
                        return;
                    }

                    let managerArray = [];
                    results.forEach(item => {
                        managerArray.push(item.first_name)
                    });

                    inquirer
                        .prompt([
                            {
                                type: 'text',
                                name: 'first_name',
                                message: 'What is you employees first name?'
                            },
                            {
                                type: 'text',
                                name: 'last_name',
                                message: 'What is your employees last name?'
                            },
                            {
                                type: 'list',
                                name: 'role_pick',
                                message: 'What will you employees role be?',
                                choices: roleArray
                            },
                            {
                                type: 'list',
                                name: 'mngt_pick',
                                message: 'Who will your employees manager be?',
                                choices: managerArray
                            }                       
                        ])
                        .then((data) => {
                            let role_id;
                            for (i = 0; i < roleArray.length; i++) {
                                if (data.role_pick === roleArray[i]) {
                                    role_id = i + 1
                                }
                            }
                            let manager_id;
                            if (!data.mngt_pick) {
                                manager_id = null;
                            } else {
                                for (i = 0; i < managerArray.length; i++) {
                                    if (data.mngt_pick === managerArray[i]) {
                                        manager_id = i + 1
                                    }
                                }
                            }
                            // Connect to db again
                            connection.query(
                                // Insert values from user into db, uses place holders to prevent SQL Injection attack
                                `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`,
                                [data.first_name, data.last_name, role_id, manager_id],
                                function (err, results, fields) {
                                    if (err) {
                                        console.log(err.message);
                                        return;
                                    }
                                    console.log('Employee succesfully added!');
                                    // Reset to main screen
                                    mainPage();
                                }
                            );
                        });
                }
            );
        }
    );
};

//Select a employee then update his role
const updateEmployee = () => {
    // Select all roles from table for future ref
    connection.query(
        `SELECT * FROM roles`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            // Create empty array for storing info
            let roleArray = [];

            // for each item in the results array, push the name of the roles to the roles array
            results.forEach(item => {
                roleArray.push(item.title)
            })
            connection.query(
                `SELECT first_name, last_name FROM employee`,
                function (err, results, fields) {
                    if (err) {
                        console.log(err.message);
                    }

                    let nameArr = [];
                    results.forEach(item => {
                        nameArr.push(item.first_name);
                        nameArr.push(item.last_name);
                    })
                    let combinedNameArr = [];
                    for (let i = 0; i < nameArr.length; i += 2) {
                        if (!nameArr[i + 1])
                            break
                        combinedNameArr.push(`${nameArr[i]} ${nameArr[i + 1]}`)
                    }
                    inquirer
                        .prompt([
                            {
                                type: 'list',
                                name: 'name_select',
                                message: 'Please select an employee you would like to update',
                                choices: combinedNameArr
                            },
                            {
                                type: 'list',
                                name: 'role_select',
                                message: 'Please select a role you would like your employee to change to:',
                                choices: roleArray
                            }
                        ])
                        .then((data) => {
                            let role_id;
                            for (let i = 0; i < roleArray.length; i++) {
                                if (data.role_select === roleArray[i]) {
                                    role_id = i + 1;
                                }
                            };
                            let selectedNameArr = data.name_select.split(" ");
                            let last_name = selectedNameArr.pop();
                            let first_name = selectedNameArr[0];

                            connection.query(
                                `UPDATE employee 
                                        SET role_id = ?
                                        WHERE first_name = ? AND last_name = ?`,
                                [role_id, first_name, last_name],
                                function (err, results, fields) {
                                    if (err) {
                                        console.log(err.message);
                                        return;
                                    }
                                    console.log('Employee updated!');
                                    mainPage();
                                }
                            );
                        });
                }
            );

        }
    );
};

//----------------------------Department---------------------------------
//"View all Department" / READ all, SELECT * FROM
const viewDepartment = () => {
    connection.query(
        `SELECT * FROM department`,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            console.table(results);
            mainPage();
        }
    )
} 

//Add a new department 
const addDepartment = () => {
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
                    mainPage();
                }
            )
        })
}

//-------------------------------Role-----------------------------------------
//View all Roles/ READ all, SELECT * FROM
const viewRoles = () => {
    connection.query(
        `SELECT roles.id, roles.title, roles.salary, department.name
            FROM roles
            LEFT JOIN department
            ON roles.department_id = department.id `,
        function (err, results, fields) {
            if (err) {
                console.log(err.message);
                return;
            }

            console.table(results);
            mainPage();
        }
    );
};

//Add a new roles
const addRole = () => {
    connection.query(
        `SELECT * FROM department`,
        function (err, results, fields) {
            if (err) {
                console.log(err);
                return;
            }

            let departmentArray = [];
            results.forEach(item => {
                departmentArray.push(item.name)
            })

            inquirer
                .prompt([
                    {
                        type: 'text',
                        name: 'role_title',
                        message: 'Please enter the name of the role you would like to add: '
                    },
                    {
                        type: 'number',
                        name: 'salary',
                        message: 'Please enter the salary of this role. Note: Please do not use commas or periods'
                    },
                    {
                        type: 'list',
                        name: 'department',
                        message: 'Please select the department you role will be a part of: ',
                        choices: departmentArray
                    }
                ])
                .then((data) => {
                    let department_id;

                    for (let i = 0; i < departmentArray.length; i++) {
                        if (departmentArray[i] === data.department) {
                            department_id = i + 1;
                        };
                    };

                    connection.query(
                        `INSERT INTO roles (title, salary, department_id)
                            VALUES(?,?,?)`,
                        [data.role_title, data.salary, department_id],
                        function (err, results, fields) {
                            if (err) {
                                console.log(err.message);
                                return;
                            }

                            console.log('Role added!')
                            mainPage();
                        }
                    );
                });
        }
    );
};












