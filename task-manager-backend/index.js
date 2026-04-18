import express from "express";
import http from "node:http";
import cors from "cors";
import {Pool} from "pg";


const app = express();

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'task_manager',
    password: 'missionspace',
    port: 5432
});



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

let tasks = [];
let users = [];






app.post("/signup", async (req,res) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const password = req.body.password;
    try
    {
        let user = await pool.query("SELECT email FROM users WHERE email = $1",[req.body.email]);
        user = user.rows;
        if(user.length > 0)
            return res.json({problem: true});

        await pool.query("INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",[firstName, lastName, email, password]);
        return res.json({problem: false});
    }
    catch(err)
    {
        console.log(err);
        return res.json({problem:true});
    }
});


app.post("/signin", async (req,res) => {
    try
    {
        let user = await pool.query("SELECT * FROM users WHERE email = $1",[req.body.email]);
        user = user.rows;
        if(user.length === 0)
            return res.json({problem: true});
        if(user[0].password !== req.body.password)
            return res.json({problem: true});
        return res.json({problem: false});
    }
    catch(err)
    {
        console.log(err);
        return res.json({problem: true});
    }
});


app.get("/tasks/:email", async (req, res) => {
    try
    {
        let task = await pool.query("SELECT * FROM tasks WHERE email = $1",[req.params.email]);
        task = task.rows;
        return res.json({result:task});
    }
    catch(err)
    {
        console.log(err);
    }
});


app.post("/tasks", async (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const date = req.body.date;
    const completed = req.body.completed;
    const email = req.body.email;
    
    try
    {
        const newTask = await pool.query("INSERT INTO tasks VALUES($1, $2, $3, $4, $5) RETURNING *",[id,title,date,completed,email]);
        const task = newTask.rows;
        return res.status(201).json({result: task[0]});
    }
    catch(err)
    {
        console.log(err);
        return res.json({problem: true});
    }
});


app.patch("/tasks", async (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const email = req.body.email;
    
    try
    {
        await pool.query("UPDATE tasks SET title = $1 WHERE id = $2 AND email = $3",[title,id,email]);
        let task = await pool.query("SELECT * FROM tasks WHERE email = $1",[email]);
        task = task.rows;
        return res.status(200).json({result:task});
    }
    catch(err)
    {
        console.log(err);
    }
});



app.delete("/tasks/:id", async (req, res) => {
    const id = req.params.id;
    const email = req.query.email;

    try
    {
        await pool.query("DELETE FROM tasks WHERE id = $1 AND email = $2",[id,email]);
        let task = await pool.query("SELECT * FROM tasks WHERE email = $1",[email]);
        task = task.rows;
        return res.status(200).json({result:task});
    }
    catch(err)
    {
        console.log(err);
    }
});


app.patch("/tasks/complete", async (req, res) => {
    const id = req.body.id;
    const complete = req.body.isComplete;
    const email = req.body.email;

    try
    {
        await pool.query("UPDATE tasks SET completed = $1 WHERE id = $2 AND email = $3",[complete,id,email]);
        let task = await pool.query("SELECT * FROM tasks WHERE email = $1",[email]);
        task = task.rows;
        return res.status(200).json({result:task});
    }
    catch(err)
    {
        console.log(err);
    }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});