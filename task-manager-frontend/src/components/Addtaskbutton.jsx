





function Addtaskbutton({addTaskButton, setAddTaskButton})
{

    return (
        <div className="add-task-btn">
            <button onClick={() => setAddTaskButton(!addTaskButton)}>Add</button>
        </div>
    );
}



export default Addtaskbutton;