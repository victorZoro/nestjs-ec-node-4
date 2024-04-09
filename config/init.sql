CREATE DATABASE IF NOT EXISTS universitydb;
USE universitydb;

CREATE TABLE IF NOT EXISTS curricullums (
    id INT AUTO_INCREMENT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS subjects (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    curricullum INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (curricullum) REFERENCES curricullums(id)
);

CREATE TABLE IF NOT EXISTS curricullum_subjects (
    curricullum INT NOT NULL,
    subject INT NOT NULL,
    FOREIGN KEY (curricullum) REFERENCES curricullums(id),
    FOREIGN KEY (subject) REFERENCES subjects(id)
);

CREATE TABLE IF NOT EXISTS  student_subjects (
    student INT NOT NULL,
    subject INT NOT NULL,
    grade FLOAT NOT NULL,
    FOREIGN KEY (student) REFERENCES students(id),
    FOREIGN KEY (subject) REFERENCES curricullum_subjects(subject)
);