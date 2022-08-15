const express = require("express");
const mysql = require("mysql2");
const inputCheck = require("./utils/inputCheck");

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username
    user: "root",
    // MySQL password
    password: "r]wuM.~w7LhsW>bJ",
    database: "election",
  },
  console.log("Connected to the election database.")
);

// route for query to show all candidates/columns from db
app.get("/api/candidates", (req, res) => {
  const sql = `SELECT * FROM candidates`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    // if there is no error (err is null)
    res.json({
      message: "success",
      data: rows,
    });
  });
});

// route for query to get a single candidate
app.get("/api/candidate/:id", (req, res) => {
  const sql = `SELECT * FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      console.log(err);
      return;
    }
    console.log(row);
    res.json({
      message: "success",
      data: row,
    });
  });
});

// api route to delete a single candidate
app.delete("/api/candidate/:id", (req, res) => {
  const sql = `DELETE FROM candidates WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      console.log(err);
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      // if the candidate was not found
      res.json({
        message: "Candidate not found",
      });
    } else {
      res.json({
        message: "deleted",
        changes: result.affectedRows, // shows how many rows were affected
        id: req.params.id, // gives the id of the affected row
      });
    }
  });
});

// route to create a candidate
app.post("/api/candidate", ({ body }, res) => {
  // inline object destructring to pull body out of req object
  // first, validate the userdata
  const errors = inputCheck(
    body,
    "first_name",
    "last_name",
    "industry_connected"
  );
  if (errors) {
    res.status(400).json({ error: errors });
    return;
  }
  // prepared sql statement
  const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
            VALUES (?,?,?)`;
            // no id needed; mysql will autogenerate
  const params = [body.first_name, body.last_name, body.industry_connected];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    // send the response to include the user data that was used to create the new data entry
    res.json({
      message: "success",
      data: body,
    });
  });
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
