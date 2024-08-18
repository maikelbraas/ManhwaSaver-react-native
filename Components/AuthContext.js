// AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isLoggedIn as checkLoginStatus } from './AuthLogic'; // Import your auth functions

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        isLoading: true,
        userId: null
    });



    useEffect(() => {
        const checkAuth = async () => {
            try {
                const storedAuth = { isAuthenticated: await AsyncStorage.getItem('isAuthenticated'), id: await AsyncStorage.getItem('userId') };

                if (storedAuth.isAuthenticated === 'true' && storedAuth.id != 'undefined') {
                    // Verify the stored authentication with the server
                    const serverAuth = await checkLoginStatus();
                    if (!serverAuth.isAuthenticated)
                        return false;
                    setAuthState(prevState => ({
                        ...prevState,
                        isAuthenticated: serverAuth.isAuthenticated,
                        userId: parseInt(serverAuth.user.id),
                        isLoading: false
                    }));
                    await AsyncStorage.setItem('userId', `${serverAuth.user.id}`);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
            } finally {
                setAuthState(prevState => ({
                    ...prevState,
                    isLoading: false
                }));
            }
        };
        checkAuth();
    }, []);

    const login = async () => {
        const id = await AsyncStorage.getItem('userId');
        setAuthState(prevState => ({
            ...prevState,
            isAuthenticated: true,
            userId: parseInt(id),
            isLoading: false
        }));
        await AsyncStorage.setItem('isAuthenticated', 'true');
    };

    const logout = async () => {
        await AsyncStorage.clear();
        setAuthState(prevState => ({
            ...prevState,
            isAuthenticated: false,
            userId: null,
            isLoading: false
        }));
    };

    return (
        <AuthContext.Provider value={{ authState, logout, login }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);