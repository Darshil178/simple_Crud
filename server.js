const express = require("express"); //express package initiated
const app = express(); // express instance has been created and will be access by app variable
const cors = require("cors");
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
const connection = require("./config/db.js");

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

app.get("/", (req, res) => {
  res.redirect("/create.html");
});

//read
app.get("/data", (req, res) => {
  const allData = "select * from backend_table";
  connection.query(allData, (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      // res.json({ rows });
      res.render("read.ejs", { rows });
    }
  });
});

app.get("/update-data",(req, res) =>{
  connection.query("select * from backend_table where id=?",[req.query.id],(err,eachRow)=>{
    if(err){
      console.log(err);
    }else{
      result=JSON.parse(JSON.stringify(eachRow[0]));
      console.log(result);
      res.render("edit.ejs",{result})
    }
  })
})

//create
app.post("/create", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  try {
    connection.query(
      "INSERT into backend_table (name,email) values(?,?)",
      [name, email],
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          // res.json({ result });
          res.redirect("/data");
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
});
//update
app.post("/final-update", (req, res) => {
  const id=req.body.hidden_id;
  var name = req.body.name;
  var email = req.body.email;
  const updateQuery = "update backend_table set name=?, email=? where id=?";
  try {
    connection.query(
      updateQuery,
      [name, email,id],
      function (err, result) {
        if (err) {
          console.log(err);
        } else {
          // res.json({ result });
          res.redirect("/data");
        }
      }
    );
  } catch (err) {
    res.send(err);
  }
});

// delete
app.get("/delete-data", (req, res) => {
  const deleteData = "delete from backend_table where id=?";
  connection.query(deleteData, [req.query.id], (err, rows) => {
    if (err) {
      res.send(err);
    } else {
      res.redirect("/data");
    }
  });
});

app.listen(process.env.PORT || 3000, function (err) {
  if (err) console.log(err);
  console.log(`listening to port ${process.env.PORT}`);
});