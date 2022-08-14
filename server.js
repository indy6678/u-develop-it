const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username
        user: 'root',
        // MySQL password
        password: 'r]wuM.~w7LhsW>bJ',
        database: 'election'
    },
    console.log('Connected to the election database.')
);

// // query to show all rows from db
// db.query(`SELECT * FROM candidates`, (err, rows) => {
//     console.log(rows);
// });

// get a single candidate
// db.query(`SELECT * FROM candidates WHERE ID = 1`, (err, row) => {
//     if(err) {
//         console.log(err);
//     }
//     console.log(row);
// });

// delete a single candidate
db.query(`DELETE FROM candidates WHERE id = ?`, 1, (err, result) => {
    if(err) {
        console.log(err);
    }  
    console.log(result);
});

// to test communication; comment out!
// app.use('/', (req, res) => {
//     res.json(
//         console.log('Here is the response.')
//         // {
//         //     message: 'Hello world!'
//         // }
//     )
// })

// default response for any other request (not found)
app.use((req, res) => {
    res.status(404).end();        
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});