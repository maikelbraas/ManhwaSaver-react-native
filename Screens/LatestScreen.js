import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import React, { useRef, useCallback, useMemo, useEffect, Suspense } from 'react';
import ManhwaCard from '../Components/ManhwaCard';
import Pagination from '../Components/Pagination';
import { RefreshControl } from 'react-native-gesture-handler';
import { useManhwas } from '../Components/ManhwaContext';
import CustomLoadingScreen from '../Components/CustomLoadingScreen';

export default React.memo(function LatestScreen() {
    const ITEM_HEIGHT = 480;
    const scrollRef = useRef();
    const { latestManhwas, isLoading, fetchLatest, currentPage, totalPagesLatest, setPage } = useManhwas();
    const getItemLayout = (data, index) => (
        { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
    )
    const card = ({ item }) => (<ManhwaCard item={item} />);
    const refreshControl = <RefreshControl refreshing={isLoading} onRefresh={() => { fetchLatest(true) }} />;
    const keyExtractor = item => item.mid;

    const handlePageClick = useCallback((p) => {
        setPage(p);
        scrollRef.current.scrollToOffset({ y: 0, animated: true });
    }, [setPage]);

    if (isLoading || latestManhwas.length === 0) {
        return <CustomLoadingScreen text='Loading manhwas...' />;
    }
    return (
        <SafeAreaView style={styles.container}>
            <FlatList keyboardShouldPersistTaps='handled'
                data={latestManhwas.slice((currentPage - 1) * 10, currentPage * 10)}
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
                    currentPage={currentPage} />
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