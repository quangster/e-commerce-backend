'use strict'

const mysql = require('mysql2')

const pool = mysql.createPool({
    host: 'localhost',
    user: 'mydb_user',
    password: 'mydb_pwd',
    database: 'mydb',
    port: 4406,
})

pool.query('DROP TABLE IF EXISTS test_table', (err, results) => {
    if (err) throw err
    console.log(`Dropped table test_table if exists`)
})

const queyCreateTestTable = `create table if not exists test_table (
	id int not null, 
    name varchar(255) default null,
    age int default null,
    address varchar(255) default null,
    primary key (id)
) engine=InnoDB default charset=utf8mb4;`

pool.query(queyCreateTestTable, (err, results) => {
    if (err) throw err
    console.log(`Created table test_table successfully`)
})

const batchSize = 100000;
const totalSize = 10_000_000;
let currentId = 1;
const insertBatch = async () => {
    const values = [];
    for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
        const name = `name-${currentId}`;
        const age = currentId;
        const address = `address-${currentId}`;
        values.push([currentId, name, age, address]);
        currentId += 1;
    }

    if (!values.length) {
        pool.end(err => {
            if (err) {
                console.log(`error: ${err.message}`)
            } else {
                console.log(`Connection to MySQL closed`)
            }
        });
        return;
    }
    
    const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`;
    
    pool.query(sql, [values], (err, results) => {
        if (err) throw err
        console.log(`Inserted ${results.affectedRows} record(s)`);
        insertBatch();
    })
}


insertBatch().catch(console.error);
