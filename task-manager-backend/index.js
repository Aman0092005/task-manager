import express from "express";
import http from "node:http";
import cors from "cors";


const app = express();

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

let tasks = [];


app.get("/", (req, res) => {
    res.json({result:tasks});
});

app.post("/add", (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    const date = req.body.date;
    const completed = req.body.completed;
    tasks.push({id:id, title:title, createDate:date, completed:completed});
    return res.status(201).json({result: tasks});
});


app.patch("/update/title", (req, res) => {
    const id = req.body.id;
    const title = req.body.title;

    for(let i=0;i<tasks.length;i++)
    {
        if(id === tasks[i].id)
            tasks[i].title = title;
    }
    return res.status(200).json({result:tasks});
});



app.delete("/delete/:id", (req, res) => {
    const id = req.params.id;
    tasks = tasks.filter((task) => task.id != id);
    return res.status(200).json({result:tasks});
});


app.patch("/task/complete", (req, res) => {
    const id = req.body.id;
    const complete = req.body.isComplete;

    for(let i=0;i<tasks.length;i++)
    {
        if(id === tasks[i].id)
            tasks[i].completed = complete;
    }
    return res.status(200).json({result:tasks});
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port 3000");
});