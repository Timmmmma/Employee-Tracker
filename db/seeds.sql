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
    ('Software Engineer', 120000, 3);
    ('Accountant Manager', 160000, 4),
    ('Accountant', 120000, 4),

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('David', 'Jackson', 1, null),
    ('Thomas', 'Lee', 2, 1),
    ('John', 'Perez', 2, 1),
    ('Gary', 'White', 3, null),
    ('Carl', 'Clark', 4, 2),
    ('Terry', 'Lewis', 4, 2),
    ('Billy', 'King', 4, 2),
    ('louis', 'Scott', 5, null),
    ('Jesse', 'Torres', 6, 3),
    ('Tony', 'Walker', 6, 3);

