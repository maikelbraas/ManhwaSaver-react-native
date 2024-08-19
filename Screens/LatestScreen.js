import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import React, { useRef, useCallback, useMemo, useEffect, Suspense } from 'react';
import ManhwaCard from '../Components/ManhwaCard';
import Pagination from '../Components/Pagination';
import { RefreshControl } from 'react-native-gesture-handler';
import { useManhwas } from '../Components/ManhwaContext';
import CustomLoadingScreen from '../Components/CustomLoadingScreen';
import { useAuth } from '../Components/AuthContext';


export default React.memo(function LatestScreen({ navigation }) {
    const ITEM_HEIGHT = 480;
    const scrollRef = useRef();
    const { latestManhwas, isLoading, fetchLatest, currentPageLatest, totalPagesLatest, setCurrentPageLatest, savedManhwas } = useManhwas();
    const { authState } = useAuth();
    const getItemLayout = (data, index) => (
        { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
    )
    const card = useCallback(({ item }) => (<ManhwaCard item={item} navigation={navigation} />), []);
    const refreshControl = <RefreshControl refreshing={isLoading} onRefresh={() => { fetchLatest(true) }} />;
    const keyExtractor = item => item.mid;

    const handlePageClick = useCallback((p) => {
        fetchLatest();
        setCurrentPageLatest(p);
    }, [setCurrentPageLatest, fetchLatest]);


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

    let latestManhwasFiltered;
    if (authState.isAuthenticated) {
        latestManhwasFiltered = markSavedManhwas(latestManhwas, savedManhwas);
    } else {
        latestManhwasFiltered = latestManhwas
    }
    if (isLoading || latestManhwas.length === 0) {
        return <CustomLoadingScreen text='Loading manhwas...' />;
    }
    return (
        <SafeAreaView style={styles.container}>
            <FlatList keyboardShouldPersistTaps='handled'
                data={latestManhwasFiltered.slice((currentPageLatest - 1) * 10, currentPageLatest * 10)}
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
                    totalPages={totalPagesLatest}
                    currentPage={currentPageLatest} />
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