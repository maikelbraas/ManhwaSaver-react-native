import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native';
import stylesButton from '../Components/InputStyle'
import { tryManhwa } from './ManhwaHandel';
import { useManhwas } from '../Components/ManhwaContext';
import { decodeHtmlCharCodes } from './Utils';
import { showMessage } from 'react-native-flash-message';
import { useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { useAuth } from './AuthContext';
import { isLoggedIn } from './AuthLogic';


export default function ManhwaCard({ item, navigation }) {
    const { fetchAllManhwas, currentPageAll, fetchLatest, currentPageLatest } = useManhwas();
    const [isExpanded, setIsExpanded] = useState(false);
    const route = useRoute();
    const { authState, logout } = useAuth();

    const [contentHeight, setContentHeight] = useState(0);
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleGoTo = async () => {
        const check = await isLoggedIn();
        if (!check.isAuthenticated) {
            await logout();
            navigation.navigate('Home', { forceLogout: true });
            return;
        }
        navigation.navigate('Saved Manhwas ' + item.category, { mid: item.mid })
    }

    const handlerTry = async () => {
        const check = await isLoggedIn();
        if (!check.isAuthenticated) {
            await logout();
            navigation.navigate('Home', { forceLogout: true });
            return;
        }
        try {
            Alert.alert('Try manhwa', `Are you sure you want to try manhwa\n${item.title}`, [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'cancel',
                },
                {
                    text: 'OK', onPress: async () => {
                        await tryManhwa(item.mid);
                        showMessage({
                            message: "Manhwa try",
                            description: `Manhwa has been added to try list.\n${item.title}`,
                            type: "success",
                            backgroundColor: "green", // Background color
                            color: "#e0e0e0", // Text color
                            duration: 2000, // Duration in milliseconds
                            position: 'top'
                        });
                        if (route.name == "Home")
                            fetchAllManhwas(currentPageAll);
                        else if (route.name == "Latest")
                            fetchLatest(currentPageLatest);
                    }
                },
            ])
        } catch (err) {
            console.error(err)
        }
    }



    return (
        <View style={styles.itemContainer}>
            <View style={styles.item}>
                <Image style={styles.logo} source={{ uri: `https://manhwasaver.com/manhwaImages/${item.mid}.webp` }} />
                <View style={[
                    styles.itemScroll,
                    { height: isExpanded ? 'auto' : 210 }, // Set to a fixed height when not expanded
                ]}
                    onLayout={(event) => {
                        const { height } = event.nativeEvent.layout;
                        setContentHeight(height); // Capture the height of the content
                    }}>
                    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
                    <TouchableOpacity onPress={toggleExpand}>
                        <Text style={styles.content}>{decodeHtmlCharCodes(item.content)}</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {
                item.genres != null ?
                    <View style={styles.item}>
                        <Text style={styles.label}>Genres: </Text>
                        <View style={styles.genresContainer}>
                            {item.genres.split(', ').map((prop, i) => {
                                return (
                                    <View key={`${item.mid}-${i}`} style={styles.genreBack}>
                                        <Text style={styles.genre} key={`${item.mid}-${prop}`}>{prop}</Text>
                                    </View>
                                )
                            })}
                        </View>
                    </View> : ''
            }
            <View style={styles.item}>
                <Text style={styles.label}>Status: </Text>
                <Text style={styles.misc}>{item.status} {item.status == 'Ongoing' ? <View style={{ backgroundColor: 'green', borderRadius: 50, width: 10, height: 10, }} /> : null}
                </Text>
                <Text style={styles.label}>Updated: </Text>
                <Text style={styles.misc}>{new Date(item.lastUpdate).toLocaleString('nl-NL', {
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                }).slice(0,
                    -3)}</Text>
            </View>
            <View style={styles.item}>
                <Text style={styles.label}>Chapters: </Text>
                <Text style={styles.misc}>{item.chapters % 1 === 0 ? item.chapters : item.chapters.toFixed(1)}</Text>
                <Text style={styles.label}>Source: </Text>
                <Text style={styles.misc}>{item.baseurl.split('/')[2].split('.')[0]}</Text>
            </View>
            {
                authState.isAuthenticated == true ? !item.saved ? <TouchableOpacity style={{ ...stylesButton.button, ...styles.try }} data={item} onPress={handlerTry}>
                    <Text style={styles.buttonText}> Try </Text>
                </TouchableOpacity> : <TouchableOpacity style={{ ...stylesButton.button, ...styles.go }} data={item} onPress={handleGoTo}>
                    <Text style={styles.buttonText}> Go to manhwa </Text>
                </TouchableOpacity> : ''
            }
        </View >
    )
}

const styles = StyleSheet.create({

    itemContainer: {
        backgroundColor: '#1e1e1e',
        marginBottom: 20
    },
    titleContainer: {
        borderBottomWidth: 2,
        borderBottomColor: 'white',
    },
    genresContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        flex: 1
    },
    genreBack: {
        backgroundColor: '#3d3d3d',
        borderRadius: 5,
        padding: 3,
        marginEnd: 5,
        marginBottom: 3,
    },
    genre: {
        color: '#e0e0e0',
    },
    item: {
        backgroundColor: '#1e1e1e',
        marginVertical: 8,
        marginHorizontal: 16,
        flexDirection: 'row',
        flex: 1,
    },
    itemScroll: {
        indicatorStyle: 'white',
        paddingHorizontal: 4,
        height: 210,
        flexDirection: 'column'
    },
    title: {
        fontSize: 18,
        textDecorationLine: 'underline',
        color: 'white',
        height: 20,
        width: 210
    },
    content: {
        color: 'white',
        width: 210
    },
    misc: {
        color: 'white',
        flex: 0.8,
    },
    label: {
        color: 'white',
    },
    logo: {
        height: 225,
        width: 150
    },
    try: {
        backgroundColor: '#198754'
    },
    go: {
        backgroundColor: '#0a5fdd'
    },
    indicate: {
        fontSize: 18,
        color: '#e0e0e0',
        position: 'absolute',
        marginTop: -18,
        textAlign: 'center',
        flex: 1,
        textDecorationLine: 'underline'
    }
})