// ManhwaContext.js
import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { isLoggedIn } from './AuthLogic';

const ManhwaContext = createContext();

export const ManhwaProvider = ({ children, navigation }) => {
    const scrollRef = useRef();
    const [savedManhwas, setSavedManhwas] = useState([]);
    const [allManhwas, setAllManhwas] = useState([]);
    const [allManhwasTotal, setAllManhwasTotal] = useState([]);
    const [latestManhwas, setLatestManhwas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { authState, logout } = useAuth();
    const [totalPages, setTotalpages] = useState(0);
    const [totalPagesSaved, setTotalPagesSaved] = useState(0);
    const [totalPagesLatest, setTotalPagesLatest] = useState(0);
    const [currentPageAll, setCurrentPageAll] = useState(1);
    const [currentPageLatest, setCurrentPageLatest] = useState(1);
    const [currentPageSaved, setCurrentPageSaved] = useState(1);


    const fetchSavedManhwas = useCallback(async (refresh = false, navigation) => {
        const check = await isLoggedIn();
        if (!check.isAuthenticated) {
            await logout();
            navigation.navigate('Home', { forceLogout: true });
            return;
        }
        if (!authState || !authState.userId) {

            return;
        }

        const threshold = 300; // Define a threshold time (in milliseconds)
        const startTime = performance.now(); // Start the timer
        let loadingTimeout;
        if (refresh)
            setIsLoading(true);
        else {
            loadingTimeout = setTimeout(() => {
                setIsLoading(true);
            }, threshold);
        }
        // setIsLoading(true);
        try {
            const response = await fetch(`https://manhwasaver.com/auth/api/savedmanhwas`, {
                method: 'GET',
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
            });
            const data = await response.json();

            // Categorize manhwas
            const categorizedManhwas = data.map(manhwa => {
                for (const { filter, category } of filterFunctions) {
                    if (filter(manhwa)) {
                        manhwa.category = category;
                        break; // Stop once the manhwa is categorized
                    }
                }
                return manhwa;
            });
            setTotalPagesSaved(Math.ceil(data.length / 10));
            setSavedManhwas(categorizedManhwas);
            const endTime = performance.now(); // End the timer
            const timeTaken = endTime - startTime;


            if (timeTaken < threshold && loadingTimeout != undefined) {
                clearTimeout(loadingTimeout); // Prevent the loading screen from showing
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error fetching all manhwas:', error);
        } finally {
            if (loadingTimeout != undefined) {
                clearTimeout(loadingTimeout); // Prevent the loading screen from showing
                setIsLoading(false);
            }
            if (refresh)
                setTimeout(() => { setIsLoading(false) }, 1500)
        }
    }, [authState, isLoggedIn]);

    const fetchAllManhwas = useCallback(async (page = 1, refresh = false) => {

        const threshold = 200; // Define a threshold time (in milliseconds)
        const startTime = performance.now(); // Start the timer
        let loadingTimeout;

        if (refresh)
            setIsLoading(true);
        else {
            loadingTimeout = setTimeout(() => {
                setIsLoading(true);
            }, threshold);
        }
        // setIsLoading(true);
        try {
            const response = await fetch(`https://manhwasaver.com/api/manhwas/${page}`);
            const data = await response.json();
            setTotalpages(response.headers.get('totalpages'));
            setAllManhwas(data);

            const endTime = performance.now(); // End the timer
            const timeTaken = endTime - startTime;


            if (timeTaken < threshold && loadingTimeout != undefined) {
                clearTimeout(loadingTimeout); // Prevent the loading screen from showing
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error fetching all manhwas:', error);
        } finally {
            if (loadingTimeout != undefined) {
                clearTimeout(loadingTimeout); // Prevent the loading screen from showing
                setIsLoading(false);
            }
            if (refresh)
                setTimeout(() => { setIsLoading(false) }, 1500)

        }
    }, [authState.userId]);

    const fetchAllManhwasTotal = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://manhwasaver.com/json/manhwas.json`);
            const data = await response.json();

            setAllManhwasTotal(data);

        } catch (error) {
            console.error('Error fetching all manhwas:', error);
        } finally {
            setIsLoading(false)
        }
    }, [authState.userId]);

    const fetchLatest = useCallback(async (refresh = false) => {

        const threshold = 200; // Define a threshold time (in milliseconds)
        const startTime = performance.now(); // Start the timer
        let loadingTimeout;
        if (refresh)
            setIsLoading(true);
        else {
            loadingTimeout = setTimeout(() => {
                setIsLoading(true);
            }, threshold);
        }
        // setIsLoading(true);
        try {
            const response = await fetch(`https://manhwasaver.com/api/latest`);
            const data = await response.json();
            setTotalPagesLatest(Math.ceil(data.length / 10));

            setLatestManhwas(data);

            const endTime = performance.now(); // End the timer
            const timeTaken = endTime - startTime;

            if (timeTaken < threshold && loadingTimeout != undefined) {
                clearTimeout(loadingTimeout); // Prevent the loading screen from showing
            }
        } catch (error) {
            console.error('Error fetching all manhwas:', error);
        } finally {
            if (loadingTimeout != undefined) {
                clearTimeout(loadingTimeout); // Prevent the loading screen from showing
                setIsLoading(false);
            }
            if (refresh)
                setTimeout(() => { setIsLoading(false) }, 1500)
        }
    }, [authState.userId]);

    useEffect((page) => {

        if (authState.isAuthenticated) {
            fetchSavedManhwas(navigation).then(() => {
                fetchAllManhwas(page);
                fetchLatest();
                fetchAllManhwasTotal();
            });
        } else {
            fetchAllManhwas(page);
            fetchLatest();
            fetchAllManhwasTotal();
        }
    }, [authState.userId, fetchSavedManhwas, fetchAllManhwas]);

    return (
        <ManhwaContext.Provider value={{
            savedManhwas,
            allManhwas,
            latestManhwas,
            isLoading,
            fetchSavedManhwas,
            currentPageAll,
            currentPageLatest,
            currentPageSaved,
            totalPages,
            setCurrentPageAll,
            setCurrentPageLatest,
            setCurrentPageSaved,
            totalPagesSaved,
            totalPagesLatest,
            allManhwasTotal,
            fetchLatest,
            fetchAllManhwasTotal,
            fetchAllManhwas



        }}>
            {children}
        </ManhwaContext.Provider>
    );
};

export const useManhwas = () => useContext(ManhwaContext);

// Define filter functions with their respective categories
const filterFunctions = [
    {
        filter: manhwa => manhwa.status.trim().toLowerCase() === 'hiatus' && manhwa.reading === 0 && (manhwa.category === undefined || manhwa.category === 'hiatus'),
        category: 'Hiatus'
    },
    {
        filter: manhwa => manhwa.reading === 0 && manhwa.chapter.toFixed(1) === manhwa.chapters.toFixed(1) && manhwa.status.trim().toLowerCase() === 'completed' && (manhwa.category === undefined || manhwa.category === 'completed'),
        category: 'Completed'
    },
    {
        filter: manhwa => manhwa.reading === 1,
        category: 'Later'
    },
    {
        filter: manhwa => manhwa.chapter > 1 && manhwa.reading === 0 && manhwa.chapter.toFixed(1) !== manhwa.chapters.toFixed(1) && (manhwa.category === undefined || manhwa.category === 'ongoing'),
        category: 'Ongoing'
    },
    {
        filter: manhwa => manhwa.reading === 0 && manhwa.chapter === 1 && (manhwa.category === undefined || manhwa.category === 'try'),
        category: 'Try'
    },
    {
        filter: manhwa => manhwa.reading === 0 && manhwa.chapter.toFixed(1) === manhwa.chapters.toFixed(1) && manhwa.status.trim().toLowerCase() !== 'hiatus' && (manhwa.category === undefined || manhwa.category === 'uptodate'),
        category: 'UpToDate'
    }
];
