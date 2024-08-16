import React, { useState, useCallback, useRef, Suspense } from 'react';
import { View, TextInput, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useManhwas } from '../Components/ManhwaContext';
import ManhwaCard from '../Components/ManhwaCard';

const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { allManhwasTotal } = useManhwas();
    const debounceTimeout = useRef(null);

    const performSearch = useCallback((query) => {
        setIsLoading(true);
        const filteredResults = allManhwasTotal.filter(manhwa =>
            manhwa.title.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filteredResults);
        setIsLoading(false);
    }, [allManhwasTotal]);

    const handleSearch = (text) => {
        setSearchQuery(text);
        if (debounceTimeout.current) {
            clearTimeout(debounceTimeout.current);
        }
        if (text.length > 2) {
            debounceTimeout.current = setTimeout(() => {
                performSearch(text);
            }, 300); // 300ms delay
        } else {
            setSearchResults([]);
        }
    };

    const renderItem = ({ item }) => <ManhwaCard item={item} />;

    return (

        <View style={styles.container}>
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
                    data={searchResults}
                    renderItem={renderItem}
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
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