


const API_URL = "http://localhost:3000";



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
        window.location.href("/");
        return;
    }
    return res.json();
}