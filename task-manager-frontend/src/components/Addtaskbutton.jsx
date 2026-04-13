





function Addtaskbutton({addTask})
{

    return (
        <div className="add-task-btn">
            <button onClick={() => addTask()}>Add</button>
        </div>
    );
}



export default Addtaskbutton;