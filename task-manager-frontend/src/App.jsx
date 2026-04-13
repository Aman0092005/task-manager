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

  
  // load tasks at opening website first time
  useEffect(() => {
    async function loadTask()
    {
      let data = await fetch("http://localhost:3000/");
      data = await data.json();
      setTasks(data.result);
    }
    loadTask();
  },[]);



  // adding new task
  async function addTask()
  {
    if(addTitle)
    {
      const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      const date = `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`
    let data = await fetch("http://localhost:3000/add", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id:uniqueId,title:addTitle,date,completed:false})
      }); 
      data = await data.json();
      setTasks(data.result);
      setAddTitle('');
    }
  }


  // for updating title
  async function handleUpdate(id,updateTitle)
    {
        if(updateTitle)
        {
            let data = await fetch("http://localhost:3000/update/title", {
                method: 'PATCH',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({id:id, title:updateTitle})
            });
            data = await data.json();
            setTasks(data.result);
        }
    }



    // for deleting
    async function handleDelete(id)
  {
    let data = await fetch(`http://localhost:3000/delete/${id}`, {
      method: 'DELETE'
    });
    data = await data.json();
    setTasks(data.result);
  }
  


  // for marking complete or incomplete
  async function handleComplete(id, isComplete)
  {
    let data = await fetch("http://localhost:3000/task/complete", {
        method: "PATCH",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({id:id, isComplete: isComplete})
    });
    data = await data.json();
    setTasks(data.result);
  }




  return (
    <div className="task-manager-container">

      <h1>Task Manager</h1>

      <div className="tm-inner-container-1">
        <Addtaskinput addTitle={addTitle} setAddTitle={setAddTitle} />
        <Addtaskbutton addTask={addTask} />
      </div>

      <div className="task-section">
        {
          tasks.length === 0?(<h3 className="task-heading">No any task yet.</h3>):
          tasks.map((t) => <Task 
          key={t.id} 
          task={t} 
          handleUpdate={handleUpdate}
          handleDelete={handleDelete}
          handleComplete={handleComplete}
          />)
        }
      </div>

    </div>
  );
}





export default App;