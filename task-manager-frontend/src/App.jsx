

import {useState, useEffect} from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import Maintask from './components/Maintask';
import Signup from './components/Signup';
import ProtectedRoute from './components/Protectedroute';
import { apiFetch, auth } from './api/api';



// Temporary function
function modifyDate(data)
{
  for(let i=0;i<data.result.length;i++)
    {
      data.result[i].createdate = data.result[i].createdate.slice(0,10);
    }
}



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

          let data = await apiFetch("/tasks", "GET");
          if(!data.problem)
          {
            // Temporary
            modifyDate(data);

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

      let data = await apiFetch("/tasks", "POST", {id:uniqueId, title: addTitle, date, completed:false});
      if(!data.problem)
      {
        // Temporary 
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

            let data = await apiFetch("/tasks", "PATCH", {id, title: updateTitle});
            if(!data.problem)
            {
              // Temporary
              modifyDate(data)

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

    let data = await apiFetch(`/tasks/${id}`, "DELETE");
    if(!data.problem)
    {
      // Temporary
      modifyDate(data)

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

    let data = await apiFetch("/tasks/complete", "PATCH", {id, isComplete});
    if(!data.problem)
    {
      // Temporary
      modifyDate(data)

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
    const body = isSignup?{firstName, lastName, email, password}: {email, password};
    const endpoint = isSignup?"/signup": "/signin";

    try{
      let data = await auth(endpoint, body);

      if(!data)
        return;

      if(!data.problem)
      {
        sessionStorage.setItem("token", data.token);
        setjwtToken(data.token);
        navigate("/home");
      } else{
        console.log("Invalid credentials")
      }
    } catch(err)
    {
      console.log(err);
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