import React, { useState, useCallback, useRef } from 'react';
import { View, TextInput, FlatList, StyleSheet, ActivityIndicator, Text, SafeAreaView, Dimensions } from 'react-native';
import { useManhwas } from '../Components/ManhwaContext';
import ManhwaCard from '../Components/ManhwaCard';
import { useAuth } from '../Components/AuthContext';

const SearchScreen = ({ navigation }) => {
    const { width, height } = Dimensions.get('window');
    const aspectRatio = height / width;
    const isTablet = aspectRatio < 1.6;
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { allManhwasTotal, savedManhwas } = useManhwas();
    const { authState } = useAuth();
    const debounceTimeout = useRef(null);

    const performSearch = useCallback((query) => {
        const filteredResults = allManhwasTotal.filter(manhwa =>
            manhwa.title.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredResults);
    }, [allManhwasTotal]);

    const handleSearch = (text) => {
        setSearchQuery(text);
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        if (text.length > 2) {
            setIsLoading(true);
            debounceTimeout.current = setTimeout(() => {
                performSearch(text);
                setIsLoading(false);
            }, 100);
        } else {
            setSearchResults([]);
        }
    };

    function markSavedManhwas(manhwaArray, savedManhwas) {
        const savedManhwasMap = new Map(savedManhwas.map(manhwa => [manhwa.mid, manhwa]));

        return manhwaArray.map(manhwa => {
            const savedManhwa = savedManhwasMap.get(manhwa.mid);

            return {
                ...manhwa,
                saved: !!savedManhwa,
                category: savedManhwa ? savedManhwa.category : undefined
            };
        });
    }

    let searchResultsFiltered;
    if (authState.isAuthenticated) {
        searchResultsFiltered = markSavedManhwas(searchResults, savedManhwas);
    } else {
        searchResultsFiltered = searchResults
    }
    const card = useCallback(({ item }) => (<ManhwaCard item={item} navigation={navigation} />), []);

    isTablet ? numOfColumns = 2 : numOfColumns = 1;
    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search manhwas..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={handleSearch}
            />
            {isLoading ? (
                <ActivityIndicator size="large" color="#007bff" />
            ) : (
                <FlatList
                    key={numOfColumns}
                    keyboardShouldPersistTaps='handled'
                    numColumns={numOfColumns}
                    columnWrapperStyle={isTablet ? { justifyContent: 'space-evenly', paddingHorizontal: 10, } : ''}
                    data={searchResultsFiltered}
                    renderItem={card}
                    keyExtractor={item => item.mid}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>
                                {searchQuery.length > 2 ? "No results found" : "Enter at least 3 characters to search"}
                            </Text>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        padding: 10,
        backgroundColor: '#121212',
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingLeft: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#2a2a2a',
        color: '#e0e0e0',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        color: '#e0e0e0',
        fontSize: 16,
    },
});

export default SearchScreen;