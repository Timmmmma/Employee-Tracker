INSERT INTO department (name)
VALUES ('Legal'),
    ('Sales'),
    ('Engineering'),
    ('Finance');

INSERT INTO roles (title, salary, department_id)
VALUES ('Legal Team Lead', 250000, 1),
    ('Lawyer', 190000, 1),
    ('Sales Lead', 100000, 2),
    ('Salesperson', 80000, 2),
    ('Lead Engineer', 150000, 3),
    ('Software Engineer', 120000, 3),
    ('Accountant Manager', 160000, 4),
    ('Accountant', 120000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id, manager_confirm)
VALUES ('David', 'Jackson', 1, null, true),
    ('Thomas', 'Lee', 2, 1, false),
    ('John', 'Perez', 2, 1, false),
    ('Gary', 'White', 3, null, true),
    ('Carl', 'Clark', 4, 2, false),
    ('Terry', 'Lewis', 4, 2, false),
    ('Billy', 'King', 4, 2, false),
    ('louis', 'Scott', 5, null, true),
    ('Jesse', 'Torres', 6, 3, false),
    ('Tony', 'Walker', 6, 3, false);

INSERT INTO manager (first_name, last_name)
SELECT first_name,
    last_name
FROM employee
WHERE manager_confirm = 1;
