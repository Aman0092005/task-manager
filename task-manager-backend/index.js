import express from "express";
import http from "node:http";
import cors from "cors";
import {Pool} from "pg";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// import dotenv from "dotenv";

// dotenv.config();



const app = express();

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;


// const pool = new Pool({
//     user: 'postgres',
//     host: 'localhost',
//     database: 'task_manager',
//     password: 'missionspace',
//     port: 5432
// });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));








app.post("/signup", async (req,res) => {

    const {firstName, lastName, email, password} = req.body;
    try
    {
        let user = await pool.query("SELECT email FROM users WHERE email = $1",[req.body.email]);
        user = user.rows;
        if(user.length > 0)
            return res.status(409).json({problem: true});

        // Password hashing
        const hashPassword = await bcrypt.hash(password, 10);
        await pool.query("INSERT INTO users (first_name, last_name, email, password) VALUES ($1, $2, $3, $4)",[firstName, lastName, email, hashPassword]);

        // for JWT
        const token = jwt.sign({email: email},process.env.JWT_SECRET,{expiresIn:'1h'});
        return res.json({problem: false, token: token});
    }
    catch(err)
    {
        console.log(err);
        return res.status(409).json({problem:true});
    }
});


app.post("/signin", async (req,res) => {
    try
    {
        const {email, password} = req.body;

        let user = await pool.query("SELECT * FROM users WHERE email = $1",[email]);
        user = user.rows;
        if(user.length === 0)
            return res.status(401).json({problem: true});

        // Using bcrypt for checking passwords
        const isMatched = await bcrypt.compare(password, user[0].password);
        if(isMatched)
        {
            // for JWT
            const token = jwt.sign({email: email}, process.env.JWT_SECRET,{expiresIn:'1h'});
            return res.json({problem: false, token: token});
        } else{
            return res.status(401).json({problem: true});
        }
    }
    catch(err)
    {
        console.log(err);
        return res.json({problem: true});
    }
});


app.get("/tasks", jwtMiddleware, async (req, res) => {
    try
    {
        let task = await pool.query("SELECT * FROM tasks WHERE email = $1",[req.email]);
        task = task.rows;
        return res.json({result: task, problem: false});
    }
    catch(err)
    {
        console.log(err);
    }
});


app.post("/tasks", jwtMiddleware, async (req, res) => {

    const {id, title, date, completed} = req.body;
    const email = req.email;
    
    try
    {
        const newTask = await pool.query("INSERT INTO tasks VALUES($1, $2, $3, $4, $5) RETURNING *",[id,title,date,completed,email]);
        const task = newTask.rows;
        return res.status(201).json({result: task[0], problem: false});
    }
    catch(err)
    {
        console.log(err);
        return res.json({problem: true});
    }
});


app.patch("/tasks", jwtMiddleware, async (req, res) => {
    
    const {id, title} = req.body;
    const email = req.email;
    
    try
    {
        await pool.query("UPDATE tasks SET title = $1 WHERE id = $2 AND email = $3",[title,id,email]);
        let task = await pool.query("SELECT * FROM tasks WHERE email = $1",[email]);
        task = task.rows;
        return res.status(200).json({result: task, problem: false});
    }
    catch(err)
    {
        console.log(err);
    }
});



app.delete("/tasks/:id", jwtMiddleware, async (req, res) => {
    const id = req.params.id;
    const email = req.email;

    try
    {
        await pool.query("DELETE FROM tasks WHERE id = $1 AND email = $2",[id,email]);
        let task = await pool.query("SELECT * FROM tasks WHERE email = $1",[email]);
        task = task.rows;
        return res.status(200).json({result:task, problem: false});
    }
    catch(err)
    {
        console.log(err);
    }
});


app.patch("/tasks/complete", jwtMiddleware, async (req, res) => {
    
    const {id, isComplete: complete} = req.body;
    const email = req.email;

    try
    {
        await pool.query("UPDATE tasks SET completed = $1 WHERE id = $2 AND email = $3",[complete,id,email]);
        let task = await pool.query("SELECT * FROM tasks WHERE email = $1",[email]);
        task = task.rows;
        return res.status(200).json({result:task, problem: false});
    }
    catch(err)
    {
        console.log(err);
    }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});







// MIDDLEWARE

function jwtMiddleware(req,res,next)
{
    const header = req.headers.authorization;

    if(!header)
        return res.status(401).json({problem: true});
    const token = header.split(" ")[1];

    if(!token)
        return res.status(401).json({problem: true});

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.email = decoded.email; // contains email
        next();
    }
    catch(err)
    {
        // console.log(err);
        return res.status(401).json({problem: true});
    }
}