create database if not exists mydb;
USE mydb;
create table if not exists test_table (
	id int not null, 
    name varchar(255) default null,
    age int default null,
    address varchar(255) default null,
    primary key (id)
) engine=InnoDB default charset=utf8mb4;

CREATE PROCEDURE `insert_data` ()
BEGIN
    DECLARE max_id INT DEFAULT 1000000;
    DECLARE i INT DEFAULT 1;
    WHILE i <= max_id DO
        INSERT INTO test_table(id, name, age, address) VALUES (i, CONCAT('Name', i), i%100, CONCAT('address', i));
        SET i = i + 1;
    END WHILE;
END