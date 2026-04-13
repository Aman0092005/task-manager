
import {useState, useEffect} from "react";





function Task({task, updateTitle, setUpdateTitle, handleUpdate, handleDelete, handleComplete})
{
    const[isUpdateClick, setIsUpdateClick] = useState(false);

    return (
        <div className="task-container upper-border">
            <div className="check-box" onClick={() => {handleComplete(task.id, !task.completed)}}>{task.completed && <img src="./img/check.png" alt="Check image" />}</div>
            {!isUpdateClick && <div className="task-text"><p>{task.title}</p></div>}
            {isUpdateClick && <div><input type="text" name="update" id="" value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} /></div>}
            <div className="task-time"><p>{task.createDate}</p></div>
            <div className="task-edit"><button onClick={() => {setIsUpdateClick(!isUpdateClick); handleUpdate(task.id)}}>{isUpdateClick?"Save":"Edit"}</button></div>
            <div className="task-delete"><button onClick={() => handleDelete(task.id)} >Delete</button></div>
        </div>
    );
}





export default Task