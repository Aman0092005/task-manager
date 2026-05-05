


// const API_URL = "http://localhost:3000";
const API_URL = "https://task-manager-3-n1u2.onrender.com";



export async function apiFetch(endpoint, method, body=null)
{
    const token = sessionStorage.getItem("token");
    const options = {
        method: method,
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    if(body)
    {
        options.headers["Content-Type"] = "application/json";
        options.body = JSON.stringify(body);
    }

    const res = await fetch(`${API_URL}${endpoint}`, options);

    if(res.status === 401)
    {
        sessionStorage.removeItem("token");
        window.location.href = "/";
        return;
    }
    
    const data = await res.json();
    return data;
}






export async function auth(endpoint, body)
{
    const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body) 
    });

    const data = await res.json();
    return data;
}