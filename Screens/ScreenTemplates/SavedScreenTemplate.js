import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import ManhwaCardSaved from '../../Components/ManhwaCardSaved';
import { RefreshControl } from 'react-native-gesture-handler';
import { useManhwas } from '../../Components/ManhwaContext';
import CustomLoadingScreen from '../../Components/CustomLoadingScreen';

export default React.memo(function SavedScreenTemplate({ route }) {
    const flatListRef = useRef();
    const { savedManhwas, isLoading, fetchSavedManhwas } = useManhwas();
    const [itemHeights, setItemHeights] = useState({});
    const [isReadyToScroll, setIsReadyToScroll] = useState(false);


    const filteredManhwas = useMemo(() => {
        return savedManhwas.filter(manhwa => {
            if (route.name.includes(manhwa.category))
                return manhwa;
        });
    }, [savedManhwas])
    const targetIndex = useMemo(() => {
        if (route.params?.mid) {
            return filteredManhwas.findIndex(manhwa => manhwa.mid === route.params.mid);
        }
        return -1;
    }, [route.params?.mid, filteredManhwas]);

    useEffect(() => {
        if (isReadyToScroll && targetIndex !== -1 && flatListRef.current) {
            flatListRef.current.scrollToIndex({ index: targetIndex, animated: false });
        }
    }, [isReadyToScroll, targetIndex]);

    const onItemLayout = useCallback((event, mid) => {
        const { height } = event.nativeEvent.layout;
        setItemHeights(prevHeights => {
            const newHeights = { ...prevHeights, [mid]: height };
            // Check if all items have been measured
            if (Object.keys(newHeights).length === filteredManhwas.length) {
                setIsReadyToScroll(true);
            }
            return newHeights;
        });
    }, [filteredManhwas.length]);

    const getItemLayout = (data, index) => ({
        length: itemHeights[data[index].mid] || 0,
        offset: Object.values(itemHeights).slice(0, index).reduce((sum, height) => sum + height, 0),
        index,
    });

    const renderItem = ({ item }) => (
        <View onLayout={event => onItemLayout(event, item.mid)}>
            <ManhwaCardSaved item={item} />
        </View>
    );

    const refreshControl = <RefreshControl refreshing={isLoading} onRefresh={() => { fetchSavedManhwas(true) }} />;
    const keyExtractor = item => item.mid;

    if (isLoading || savedManhwas.length === 0) {
        return <CustomLoadingScreen text='Loading manhwas...' />;
    }

    return (
        <SafeAreaView style={styles.container} collapsable={false}>
            <FlatList
                keyboardShouldPersistTaps='handled'
                data={filteredManhwas}
                getItemLayout={getItemLayout}
                keyExtractor={keyExtractor}
                // initialNumToRender={3}
                renderItem={renderItem}
                // windowSize={3}
                ref={flatListRef}
                // removeClippedSubviews={true}
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