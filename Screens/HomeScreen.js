import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import React, { useRef, useCallback, useMemo, useEffect } from 'react';
import ManhwaCard from '../Components/ManhwaCard';
import Pagination from '../Components/Pagination';
import { RefreshControl } from 'react-native-gesture-handler';
import { useManhwas } from '../Components/ManhwaContext';
import CustomLoadingScreen from '../Components/CustomLoadingScreen';
import { useAuth } from '../Components/AuthContext';
import { showMessage } from 'react-native-flash-message';

export default React.memo(function HomeScreen({ navigation, route }) {
    const ITEM_HEIGHT = 480;
    const scrollRef = useRef();
    const { allManhwas, isLoading, fetchAllManhwas, currentPageAll, totalPages, setCurrentPageAll, savedManhwas } = useManhwas();
    const { authState } = useAuth();
    const getItemLayout = (data, index) => (
        { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
    )

    useEffect(() => {
        if (route.params != undefined) {
            if (route.params.forceLogout != undefined && route.params.forceLogout)
                showMessage({
                    message: "Logged out.",
                    description: `You where logout from the server. Log back in to visit saved pages.`,
                    type: "warning",
                    backgroundColor: "#ab2532", // Background color
                    color: "#e0e0e0", // Text color
                    duration: 2000, // Duration in milliseconds
                    position: 'top'
                });
        }

        // Reset the parameter
        navigation.setParams({ forceLogout: undefined });
    }, [route.params?.forceLogout]);

    const card = useCallback(({ item }) => (<ManhwaCard item={item} navigation={navigation} />), []);
    const refreshControl = <RefreshControl refreshing={isLoading} onRefresh={() => { fetchAllManhwas(1, true) }} />;
    const keyExtractor = item => item.mid;

    const handlePageClick = useCallback((p) => {
        fetchAllManhwas(p, false)
        setCurrentPageAll(p);
        scrollRef.current.scrollToOffset({ y: 0, animated: true });
    }, [setCurrentPageAll]);


    function markSavedManhwas(manhwaArray, savedManhwas) {
        // Create a map of saved manhwas with their `mid` as the key
        const savedManhwasMap = new Map(savedManhwas.map(manhwa => [manhwa.mid, manhwa]));

        return manhwaArray.map(manhwa => {
            const savedManhwa = savedManhwasMap.get(manhwa.mid);

            // If the manhwa is saved, mark it as saved and copy the category
            return {
                ...manhwa,
                saved: !!savedManhwa,
                category: savedManhwa ? savedManhwa.category : undefined
            };
        });
    }

    let allManhwasFiltered;
    if (authState.isAuthenticated) {
        allManhwasFiltered = markSavedManhwas(allManhwas, savedManhwas);
    } else {
        allManhwasFiltered = allManhwas
    }
    if (isLoading || allManhwas.length === 0) {
        return <CustomLoadingScreen text='Loading manhwas...' />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <FlatList keyboardShouldPersistTaps='handled'
                data={allManhwasFiltered}
                keyExtractor={keyExtractor}
                initialNumToRender={3}
                renderItem={card}
                // windowSize={3}
                ref={scrollRef}
                // removeClippedSubviews={true}
                getItemLayout={getItemLayout}
                refreshControl={refreshControl} />
            <View style={styles.paginationContainer}>
                <Pagination
                    handlePageClick={handlePageClick}
                    totalPages={totalPages}
                    currentPage={currentPageAll} />
            </View>
        </SafeAreaView>
    )

})




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    loginContainer: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },

    containerMenu: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
        borderTopColor: 'white',
        borderTopWidth: 10,
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: 'transparent',
    },

    inputView: {
        backgroundColor: "#FFC0CB",
        borderRadius: 30,
        width: '70%',
        height: 45,
        marginBottom: 20,
        // alignItems: "center",
    },

    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        // marginLeft: 20,
    },

    forgot_button: {
        height: 30,
        marginBottom: 30,
    },

    loginBtn: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#FF1493",
    },
});