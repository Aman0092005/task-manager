


import Addtaskinput from "./Addtaskinput";
import Addtaskbutton from "./Addtaskbutton";
import Task from "./Task";
import Loading from "./Loading";




function Maintask({addTitle, setAddTitle, addTask, tasks, handleUpdate, handleDelete, handleComplete, handleLogout, isLoading})
{
    return (
      isLoading?<Loading/>:
      <div className="task-manager-container">
        <button className="abs-btn-task-manager" onClick={() => handleLogout()}>Logout</button>

        <h1>Task Manager</h1>

        <div className="tm-inner-container-1">
          <Addtaskinput addTitle={addTitle} setAddTitle={setAddTitle} />
          <Addtaskbutton addTask={addTask} />
        </div>

        <div className="task-section">
          {
            tasks.length === 0?(<h3 className="task-heading">No any task yet.</h3>):(
            tasks.map((t) => <Task 
            key={t.id} 
            task={t} 
            handleUpdate={handleUpdate}
            handleDelete={handleDelete}
            handleComplete={handleComplete}
            />)
            )
          }
        </div>

    </div>
    );
}





export default Maintask;