import {Navigate} from "react-router-dom";






function ProtectedRoute({children})
{
    const email = sessionStorage.getItem('email');

    if(!email)
    {
        return <Navigate to="/" />
    }
    
    return children;
}




export default ProtectedRoute;