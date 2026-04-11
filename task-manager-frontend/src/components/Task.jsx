
import {useState, useEffect} from "react";





function Task({task, tasks, setTasks})
{
    const[isUpdateClick, setIsUpdateClick] = useState(false);
    const[updateTitle, setUpdateTitle] = useState('');
    const[isCompleted, setIsCompleted] = useState(task.completed);
    const[isCompleteClick, setIsCompleteClick] = useState(false);

    const[isDelete, setIsDelete] = useState(false);
    

    // for updating task title
    useEffect(() => {
        if(!isUpdateClick && updateTitle)
        {
            handleUpdate();
            setUpdateTitle('');
        }
    },[isUpdateClick]);


    async function handleUpdate()
    {
        if(updateTitle)
        {
            let data = await fetch("http://localhost:3000/update/title", {
                method: 'PATCH',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({id:task.id, title:updateTitle})
            });
            data = await data.json();
            console.log(data);
            data = data.result;
            setTasks([...data]);
        }
    }


    // for deleting task
  useEffect(() => {
    if(isDelete)
    {
      handleDelete(task.id)
    }
  },[isDelete])

  async function handleDelete(id)
  {
    let data = await fetch(`http://localhost:3000/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    data = await data.json();
    setTasks([...data.result]);
    setIsDelete(!isDelete);
  }


//   for marking complete of incomplete

  useEffect(() => {
    if(isCompleteClick)
    {
        handleComplete();
    }
  },[isCompleteClick])

  async function handleComplete()
  {
    let data = await fetch("http://localhost:3000/task/complete", {
        method: "PATCH",
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({id:task.id, isComplete: isCompleted})
    });
    data = await data.json();
    setTasks([...data.result]);
    setIsCompleteClick(false);
  }

    return (
        <div className="task-container upper-border">
            <div className="check-box" onClick={() => {setIsCompleted(!isCompleted); setIsCompleteClick(true)}}>{isCompleted && <img src="./img/check.png" alt="Check image" />}</div>
            {!isUpdateClick && <div className="task-text"><p>{task.title}</p></div>}
            {isUpdateClick && <div><input type="text" name="update" id="" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} /></div>}
            <div className="task-time"><p>{task.createDate}</p></div>
            <div className="task-edit"><button onClick={() => setIsUpdateClick(!isUpdateClick)}>{isUpdateClick?"Save":"Edit"}</button></div>
            <div className="task-delete"><button onClick={() => setIsDelete(!isDelete)} >Delete</button></div>
        </div>
    );
}





export default Task