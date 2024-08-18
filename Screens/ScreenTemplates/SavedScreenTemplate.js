import { FlatList, SafeAreaView, StyleSheet } from 'react-native';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import ManhwaCardSaved from '../../Components/ManhwaCardSaved';
import { RefreshControl } from 'react-native-gesture-handler';
import { useManhwas } from '../../Components/ManhwaContext';
import CustomLoadingScreen from '../../Components/CustomLoadingScreen';

const ITEM_HEIGHT = 480;

export default React.memo(function SavedScreenTemplate({ filterFunction, categoryName }) {

    const scrollRef = useRef();
    const { savedManhwas, isLoading, fetchSavedManhwas } = useManhwas();

    const getItemLayout = (data, index) => (
        { length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index }
    );

    const card = ({ item }) => (<ManhwaCardSaved item={item} />);
    const refreshControl = <RefreshControl refreshing={isLoading} onRefresh={() => { fetchSavedManhwas(true) }} />;
    const keyExtractor = item => item.mid;

    const filteredManhwas = useMemo(() => {
        return savedManhwas.filter(manhwa => {
            if (filterFunction(manhwa)) {
                manhwa.category = categoryName;
                return manhwa;
            }
        });
    }, [savedManhwas, filterFunction, categoryName])

    if (isLoading || filteredManhwas.length === 0) {
        return <CustomLoadingScreen text='Loading manhwas...' />;
    }

    return (
        <SafeAreaView style={styles.container} collapsable={false}>
            <FlatList
                keyboardShouldPersistTaps='handled'
                data={filteredManhwas}
                keyExtractor={keyExtractor}
                initialNumToRender={3}
                renderItem={card}
                // windowSize={3}
                ref={scrollRef}
                // removeClippedSubviews={true}
                getItemLayout={getItemLayout}
                refreshControl={refreshControl}
            />
        </SafeAreaView>
    );
});

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