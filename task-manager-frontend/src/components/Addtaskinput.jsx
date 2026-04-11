
import {useState, useEffect} from "react";




function Addtaskinput({addTitle, setAddTitle})
{

    return (
        <div className="add-task-inp">
            <input type="text" name="addTask" placeholder="Add a new task..." value={addTitle} onChange={(e) => setAddTitle(e.target.value)} />
        </div>
    );
}


export default Addtaskinput;