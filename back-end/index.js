const express = require("express");
const app = express();

const hostname = '127.0.0.1';
const port = 3000;

const mysql_handler = require("./mysql_handler").handler
const cassandra_handler = require("./cassandra_handler").handler

const cassandra_client = require("./cassandra_handler").client

app.get("/",(req,res) => {
  // mysql_handler("select * from employees", (err, rows) => {
  //   if (err) {
  //     res.json({"code" : 100, "status" : "Error in connection database"});
  //   } else {
  //     res.json(rows)
  //   };
  // });

  cassandra_client.execute('SELECT * FROM test_table', (err, result) => {
    if (err) {
      res.json(err)
    } else {
      res.json(result)
    };
  });
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});