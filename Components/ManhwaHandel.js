
const API_URL = 'https://manhwasaver.com/auth'

export async function remove(id) {
    try {
        const response = await fetch(`${API_URL}/remove/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/html" },
            credentials: 'include',
        })
        const json = await response.json();
        return;
    } catch (err) {
        console.error(err)
        return;
    }
}
export async function later(id) {
    try {
        const response = await fetch(`${API_URL}/patch/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/html" },
            credentials: 'include',
        })
        const json = await response.json();
        return;
    } catch (err) {
        console.error(err)
        return;
    }
}
export async function log(id, number) {
    try {
        const response = await fetch(`${API_URL}/chapter/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({ chapternumber: number, api: true })
        })
        const json = await response.json();
        return;
    } catch (err) {
        console.error(err)
        return;
    }
}


export async function tryManhwa(id) {
    try {
        const response = await fetch(`${API_URL}/chapter/${id}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify({ chapternumber: 1, api: true })
        })
        const json = await response.json();
        return;
    } catch (err) {
        console.error(err)
        return;
    }
}