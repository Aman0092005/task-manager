// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'




import {useState, useEffect} from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import Maintask from './components/Maintask';
import Signup from './components/Signup';
import ProtectedRoute from './components/Protectroute';




function App()
{
  const[tasks, setTasks] = useState([]);
  const[addTitle, setAddTitle] = useState('');
  const[email, setEmail] = useState('');
  const navigate = useNavigate();



  // checking Authenticated or not
  useEffect(() => {
    const getEmail = sessionStorage.getItem("email");
    if(getEmail)
    {
      setEmail(getEmail);
      navigate("/home");
    }
  },[]);


  
  // load tasks if uses get authenticated
  useEffect(() => {

    if(!email)
      return;

    async function loadTask()
    {
      let data = await fetch(`http://localhost:3000/tasks/${email}`);
      data = await data.json();
      setTasks(data.result);
    }
      loadTask();
  },[email]);



  // adding new task
  async function addTask()
  {
    if(addTitle)
    {
      const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      const date = `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`
    let data = await fetch("http://localhost:3000/add/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({id:uniqueId,title:addTitle,date,completed:false,email})
      }); 
      data = await data.json();
      setTasks((prev) => [...prev, data.result]);
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
                body: JSON.stringify({id:id, title:updateTitle, email: email})
            });
            data = await data.json();
            setTasks(data.result);
        }
    }



    // for deleting
    async function handleDelete(id)
  {
    let data = await fetch(`http://localhost:3000/delete/${id}?email=${email}`, {
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
        body: JSON.stringify({id:id, isComplete: isComplete, email: email})
    });
    data = await data.json();
    setTasks(data.result);
  }



  // authentication
  async function authentication(isSignup, firstName, lastName, email, password)
  {
    if(isSignup)
    {
      let data = await fetch("http://localhost:3000/signup", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({firstName, lastName, email, password})
      });

      data = await data.json();
      if(!data.problem)
      {
        sessionStorage.setItem("email",email);
        setEmail(email);
        navigate("/home");
      }
    }
    else
    {
      let data = await fetch("http://localhost:3000/signin", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
      });

      data = await data.json();
      if(!data.problem)
      {
        sessionStorage.setItem("email",email);
        setEmail(email);
        navigate("/home");
      }
    }
  }


  function handleLogout()
  {
    sessionStorage.removeItem("email");
    setEmail('');
  }



  return (
    <Routes>
      <Route path='/' element={<Signup authentication={authentication} />} />
      <Route path='/home' element={
        <ProtectedRoute>
          <Maintask
            addTitle={addTitle}
            setAddTitle={setAddTitle}
            addTask={addTask}
            tasks={tasks}
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            handleComplete={handleComplete}
            handleLogout={handleLogout}
          />
        </ProtectedRoute>
    }
       />
    </Routes>
  );
}





export default App;