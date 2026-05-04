

import {useState, useEffect} from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import Maintask from './components/Maintask';
import Signup from './components/Signup';
import ProtectedRoute from './components/Protectroute';




function App()
{
  const[tasks, setTasks] = useState([]);
  const[addTitle, setAddTitle] = useState('');

  const navigate = useNavigate();
  const[jwtToken, setjwtToken] = useState(sessionStorage.getItem("token"));

  const[isLoading, setIsLoading] = useState(false);


  // checking Authenticated or not
  useEffect(() => {
 
    if(jwtToken){
      
      async function loadTask(){
        try{
          setIsLoading(true);
          let data = await fetch(`http://localhost:3000/tasks`, {
            headers: {
            Authorization: `Bearer ${jwtToken}`
          }
          });

          data = await data.json();
          if(!data.problem)
          {
            for(let i=0;i<data.result.length;i++)
              {
                data.result[i].createdate = data.result[i].createdate.slice(0,10);
              }
              setTasks(data.result);
          }
          else
            handleLogout();
      } catch(err){
          console.log(err);
      } finally{
        setIsLoading(false);
      }

    }
    loadTask();
  }
},[jwtToken]);



  // adding new task
  async function addTask()
  {
    if(addTitle)
    {

      const token = sessionStorage.getItem("token");
      const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      const date = `${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`
    let data = await fetch("http://localhost:3000/tasks", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({id:uniqueId,title:addTitle,date,completed:false})
      }); 
      data = await data.json();
      if(!data.problem)
      {
        data.result.createdate = data.result.createdate.slice(0,10);
        setTasks((prev) => [...prev, data.result]);
        setAddTitle('');
      }
      else
      {
        handleLogout();
      }
    }
  }


  // for updating title
  async function handleUpdate(id,updateTitle)
    {
        if(updateTitle)
        {
            const token = sessionStorage.getItem("token");

            let data = await fetch("http://localhost:3000/tasks", {
                method: 'PATCH',
                headers: {
                    'Content-Type': "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({id:id, title:updateTitle})
            });
            data = await data.json();
            if(!data.problem)
            {
              for(let i=0;i<data.result.length;i++)
              {
                data.result[i].createdate = data.result[i].createdate.slice(0,10);
              }
              setTasks(data.result);
            }
            else
            {
              handleLogout();
            }
        }
    }



    // for deleting
    async function handleDelete(id)
  {
    const token = sessionStorage.getItem("token");

    let data = await fetch(`http://localhost:3000/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    data = await data.json();
    if(!data.problem)
    {
      for(let i=0;i<data.result.length;i++)
      {
        data.result[i].createdate = data.result[i].createdate.slice(0,10);
      }
      setTasks(data.result);
    }
    else
    {
      handleLogout();
    }
  }
  


  // for marking complete or incomplete
  async function handleComplete(id, isComplete)
  {

    const token = sessionStorage.getItem("token");

    let data = await fetch("http://localhost:3000/tasks/complete", {
        method: "PATCH",
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({id:id, isComplete: isComplete})
    });
    data = await data.json();
    if(!data.problem)
    {
      for(let i=0;i<data.result.length;i++)
      {
        data.result[i].createdate = data.result[i].createdate.slice(0,10);
      }
      setTasks(data.result);
    }
    else
    {
      handleLogout();
    }
    
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
        sessionStorage.setItem("token", data.token);
        setjwtToken(data.token);
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
        sessionStorage.setItem("token", data.token);
        setjwtToken(data.token);
        navigate("/home");
      }
    }
  }


  function handleLogout()
  {
    sessionStorage.removeItem("token");
    navigate("/");
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
            isLoading={isLoading}
          />
        </ProtectedRoute>
    }
       />
    </Routes>
  );
}





export default App;