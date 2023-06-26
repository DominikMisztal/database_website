const express = require('express');
const mysql = require("mysql")
const dotenv = require('dotenv')
const notifier = require('node-notifier');

const app = express();
dotenv.config({ path: './.env'})

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
})

db.connect((error) => {
    if(error) {
        console.log(error)
    } else {
        console.log("MySQL connected!")
    }
})

app.set('view engine', 'hbs')
const path = require("path")

const publicDir = path.join(__dirname, './public')

app.use(express.static(publicDir))

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/retrieve", (req, res) => {
    var sql='SELECT * FROM easy_questions';
    db.query(sql, function (err, data, fields) {
    if (err) throw err;
    res.render('retrieve', { title: 'retrieve', questionsData: data});
  });
    
})

app.get("/delete", (req, res) => {
    res.render("delete")
})

app.listen(5000, ()=> {
    console.log("server started on port 5000")
})

const bcrypt = require("bcryptjs")
app.use(express.urlencoded({extended: 'false'}))
app.use(express.json())

app.post("/auth/add", (req, res) => {    
    const { question, correct_answer, incorrect_answer_1, incorrect_answer_2, incorrect_answer_3 } = req.body
    console.log(question, correct_answer, incorrect_answer_1, incorrect_answer_2, incorrect_answer_3 )
    db.query('INSERT INTO easy_questions(question, correct_answer, incorrect_answer_1, incorrect_answer_2, incorrect_answer_3) values (?,?,?,?,?)', 
                [question, correct_answer, incorrect_answer_1, incorrect_answer_2, incorrect_answer_3], async (error, res) => {
        notifier.notify("Added to database")
     })
    res.render("result");
})

app.post("/auth/delete", (req, res) => {    
    const { id} = req.body
    db.query('DELETE from easy_questions where ID = ?', 
                [id], async (error, res) => {
        notifier.notify("Removed from database")
     })
    res.render("result");
})