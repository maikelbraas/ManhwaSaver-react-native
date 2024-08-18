// ManhwaContext.js
import React, { createContext, useState, useContext, useCallback, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const ManhwaContext = createContext();

function markSavedManhwas(manhwaArray, savedManhwas) {
    const savedMids = new Set(savedManhwas.map(manhwa => manhwa.mid));

    return manhwaArray.map(manhwa => {
        if (savedMids.has(manhwa.mid)) {
            return { ...manhwa, saved: true };
        }
        return manhwa;
    });
}

export const ManhwaProvider = ({ children }) => {
    const scrollRef = useRef();
    const [savedManhwas, setSavedManhwas] = useState([]);
    const [allManhwas, setAllManhwas] = useState([]);
    const [allManhwasTotal, setAllManhwasTotal] = useState([]);
    const [latestManhwas, setLatestManhwas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { authState } = useAuth();
    const [totalPages, setTotalpages] = useState(0);
    const [totalPagesSaved, setTotalPagesSaved] = useState(0);
    const [totalPagesLatest, setTotalPagesLatest] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);


    const fetchSavedManhwas = useCallback(async (refresh = false) => {
        if (authState === null && authState.userId == null) {
            return;
        }
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
            const response = await fetch(`https://manhwasaver.com/auth/api/savedmanhwas`, {
                method: 'GET',
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
            });
            const data = await response.json();
            setTotalPagesSaved(Math.ceil(data.length / 10));
            setSavedManhwas(data);
            const endTime = performance.now(); // End the timer
            const timeTaken = endTime - startTime;


            if (timeTaken < threshold) {
                clearTimeout(loadingTimeout); // Prevent the loading screen from showing
            }
        } catch (error) {
            console.error('Error fetching manhwas:', error);
        } finally {
            clearTimeout(loadingTimeout); // Prevent the loading screen from showing
            if (refresh)
                setTimeout(() => { setIsLoading(false) }, 1500)
        }
    }, [authState.userId]);

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
            if (authState !== null && authState.userId !== null && savedManhwas && savedManhwas.length > 0) {
                const manhwas = markSavedManhwas(data, savedManhwas);
                setAllManhwas(manhwas);
            } else {
                setAllManhwas(data);
            }
            const endTime = performance.now(); // End the timer
            const timeTaken = endTime - startTime;


            if (timeTaken < threshold) {
                clearTimeout(loadingTimeout); // Prevent the loading screen from showing
            }
        } catch (error) {
            console.error('Error fetching all manhwas:', error);
        } finally {
            clearTimeout(loadingTimeout); // Prevent the loading screen from showing
            if (refresh)
                setTimeout(() => { setIsLoading(false) }, 1500)

        }
    }, [authState.userId]);

    const fetchAllManhwasTotal = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://manhwasaver.com/json/manhwas.json`);
            const data = await response.json();

            if (authState !== null && authState.userId != null && savedManhwas && savedManhwas.length > 0) {
                const manhwas = markSavedManhwas(data, savedManhwas);
                setAllManhwasTotal(manhwas);
            } else {
                setAllManhwasTotal(data);
            }
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

            if (authState !== null && authState.userId != null && savedManhwas && savedManhwas.length > 0) {
                const manhwas = markSavedManhwas(data, savedManhwas);
                setLatestManhwas(manhwas);
            } else {
                setLatestManhwas(data);
            }

            const endTime = performance.now(); // End the timer
            const timeTaken = endTime - startTime;


            if (timeTaken < threshold) {
                clearTimeout(loadingTimeout); // Prevent the loading screen from showing
            }
        } catch (error) {
            console.error('Error fetching all manhwas:', error);
        } finally {
            clearTimeout(loadingTimeout); // Prevent the loading screen from showing
            if (refresh)
                setTimeout(() => { setIsLoading(false) }, 1500)
        }
    }, [authState.userId, markSavedManhwas]);

    useEffect((page) => {
        if (authState.userId)
            fetchSavedManhwas();
        fetchAllManhwas(page);
        fetchLatest();
        fetchAllManhwasTotal();
    }, [authState.userId, fetchSavedManhwas, fetchAllManhwas]);

    const setPage = useCallback((page) => {
        if (authState.userId) {
            fetchSavedManhwas();
            setCurrentPage(page);
        }
        fetchLatest();
        setCurrentPage(page);
        fetchAllManhwas(page);
        fetchAllManhwasTotal();
    }, [fetchAllManhwas, fetchSavedManhwas]);

    return (
        <ManhwaContext.Provider value={{
            savedManhwas,
            allManhwas,
            latestManhwas,
            isLoading,
            fetchSavedManhwas,
            setPage,
            currentPage,
            totalPages,
            setCurrentPage,
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