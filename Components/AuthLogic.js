
const API_URL = 'https://manhwasaver.com/api';
const API_URL_AUTH = 'https://manhwasaver.com/auth/api';

// const API_URL = 'http://localhost:3000/api';
// const API_URL_AUTH = 'http://localhost:3000/auth/api';

export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include',
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Login failed:', error);
        return false;
    }
};

export const logout = async () => {
    try {
        const response = await fetch(`${API_URL_AUTH}/logout`, {
            method: 'GET',
            credentials: 'include',
        });
        await response.json();
        return true;
    } catch (error) {
        console.error('Logout failed:', error);
        return false;
    }
};

export const isLoggedIn = async () => {
    try {
        const response = await fetch(`${API_URL}/check-auth`, {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
};