import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import React, { useRef, useCallback, useMemo, useEffect } from 'react';
import ManhwaCard from '../Components/ManhwaCard';
import Pagination from '../Components/Pagination';
import { RefreshControl } from 'react-native-gesture-handler';
import { useManhwas } from '../Components/ManhwaContext';

export default React.memo(function HomeScreen() {
    const ITEM_HEIGHT = 480;
    const scrollRef = useRef();
    const { allManhwas, isLoading, refreshManhwas, currentPage, totalPages, setPage } = useManhwas();
    const getItemLayout = (data, index) => (
        { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
    )
    const card = useCallback(({ item }) => (<ManhwaCard item={item} />), []);
    const refreshControl = <RefreshControl refreshing={isLoading} onRefresh={refreshManhwas} />;
    const keyExtractor = item => item.mid;

    const handlePageClick = useCallback((p) => {
        setPage(p);
        scrollRef.current.scrollToOffset({ y: 0, animated: false });
    }, [setPage]);

    return (
        <SafeAreaView style={styles.container}>
            <FlatList keyboardShouldPersistTaps='handled'
                data={allManhwas}
                keyExtractor={keyExtractor}
                initialNumToRender={3}
                renderItem={card}
                windowSize={3}
                ref={scrollRef}
                removeClippedSubviews={true}
                getItemLayout={getItemLayout}
                refreshControl={refreshControl} />
            <View style={styles.paginationContainer}>
                <Pagination
                    handlePageClick={handlePageClick}
                    totalPages={totalPages}
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