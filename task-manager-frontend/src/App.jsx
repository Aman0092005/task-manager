// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'



import Addtaskinput from "./components/Addtaskinput";
import Addtaskbutton from "./components/Addtaskbutton";
import Task from "./components/Task";

import {useState, useEffect} from 'react';




function App()
{
  
  const[tasks, setTasks] = useState([]);
  const[addTitle, setAddTitle] = useState('');
  const[addTaskButton, setAddTaskButton] = useState(false);

  
  // load tasks at opening website first time
  useEffect(() => {
    async function loadTask()
    {
      let data = await fetch("http://localhost:3000/");
      data = await data.json();
      setTasks([...data.result]);
    }
    loadTask();
  })



  // adding new task
  useEffect(() => {
    if(addTitle)
    {
      const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      const date = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
      addTask(uniqueId,addTitle,date,false);
      setAddTitle('');
    }
  },[addTaskButton]);

  async function addTask(id,title,date,completed)
  {
    let data = await fetch("http://localhost:3000/add", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id,title,date,completed})
      }); 
      data = await data.json();
      setTasks([...data.result]);
  }
  

  return (
    <div className="task-manager-container">

      <h1>Task Manager</h1>

      <div className="tm-inner-container-1">
        <Addtaskinput addTitle={addTitle} setAddTitle={setAddTitle} />
        <Addtaskbutton addTaskButton={addTaskButton} setAddTaskButton={setAddTaskButton} />
      </div>

      <div className="task-section">
        {
          tasks.map((t) => <Task 
          key={t.id} 
          task={t} 
          tasks={tasks}
          setTasks={setTasks}
          />)
        }
      </div>

    </div>
  );
}





export default App;