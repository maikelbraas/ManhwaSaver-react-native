import { StyleSheet, Text, View, Image, Keyboard, TouchableOpacity, TextInput, Linking, Alert, Dimensions } from 'react-native';
import React, { useCallback, useState } from 'react';
import stylesInput from '../Components/InputStyle'
import { remove, later, log } from './ManhwaHandel';
import { decodeHtmlCharCodes } from './Utils';
import { useManhwas } from '../Components/ManhwaContext';
import { showMessage } from 'react-native-flash-message';
import { useAuth } from './AuthContext';
import { isLoggedIn } from './AuthLogic';

export default React.memo(function ManhwaCardSaved({ item, navigation }) {
    const { width, height } = Dimensions.get('window');
    const aspectRatio = height / width;
    const isTablet = aspectRatio < 1.6;
    const [number, onChangeNumber] = useState('');
    const { fetchSavedManhwas } = useManhwas();
    const { logout } = useAuth();

    const confirmRemove = useCallback(() => {
        Alert.alert('Remove Manhwa', `Are you sure you want to remove:\n${item.title}`, [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            { text: 'OK', onPress: handleRemove },
        ])
    }, [item.title, handleRemove]);

    const confirmLater = useCallback((item) => {
        Alert.alert('Read Later Manhwa', `Are you sure you want to read \n${item.title}\nlater?`, [
            {
                text: 'Cancel',
                onPress: () => { },
                style: 'cancel',
            },
            { text: 'OK', onPress: handleLater },
        ])
    }, [item.title, handleLater]);

    const handleRemove = useCallback(async () => {
        const check = await isLoggedIn();
        if (!check.isAuthenticated) {
            await logout();
            navigation.navigate('Home', { forceLogout: true });
            return;
        }
        try {
            await remove(item.mid);
            showMessage({
                message: "Manhwa removed.",
                description: `Your manhwa:\n${item.title}\nhas been removed from saved.`,
                type: "info",
                backgroundColor: "maroon", // Background color
                color: "#e0e0e0", // Text color
                duration: 2000, // Duration in milliseconds
                position: 'top'
            });
            fetchSavedManhwas(false, navigation)
        } catch (err) {
            console.error(err)
        }
    }, [item.mid, fetchSavedManhwas, navigation, logout, isLoggedIn])

    const handleLater = useCallback(async () => {
        const check = await isLoggedIn();
        if (!check.isAuthenticated) {
            await logout();
            navigation.navigate('Home', { forceLogout: true });
            return;
        }
        try {
            await later(item.mid);
            showMessage({
                message: `Manhwa ${item.reading == 0 ? 'Later' : 'Read'}`,
                description: `Manhwa has been moved to ${item.reading == 0 ? 'Later' : 'Read'}\n${item.title}`,
                type: "info",
                backgroundColor: `${item.reading == 0 ? 'orange' : 'green'}`, // Background color
                color: "#e0e0e0", // Text color
                duration: 2000, // Duration in milliseconds
                position: 'top'
            });
            fetchSavedManhwas(false, navigation)
        } catch (err) {
            console.error(err)
        }
    }, [item.mid, fetchSavedManhwas, navigation, logout, isLoggedIn])

    const handleLog = useCallback(async () => {
        const check = await isLoggedIn();
        if (!check.isAuthenticated) {
            await logout();
            navigation.navigate('Home', { forceLogout: true });
            return;
        }
        try {
            if (number > item.chapters || number < 1) {
                showMessage({
                    message: "Chapter change failed.",
                    description: `${number} is not allowed.\nKeep it within the limit.\nMin: 1, Max: ${item.chapters}`,
                    type: "warning",
                    backgroundColor: "#ab2532", // Background color
                    color: "#e0e0e0", // Text color
                    duration: 2000, // Duration in milliseconds
                    position: 'top'
                });
                onChangeNumber('')
            } else {
                await log(item.mid, number);
                showMessage({
                    message: "Chapter Changed!",
                    description: `That chapter of\n${item.title}\nhas changed to ${number}.`,
                    type: "info",
                    backgroundColor: "green", // Background color
                    color: "#e0e0e0", // Text color
                    duration: 2000, // Duration in milliseconds
                    position: 'top'
                });
                onChangeNumber('')
                fetchSavedManhwas(false, navigation)
            }
            Keyboard.dismiss();
        } catch (err) {
            console.error(err)
        }
    }, [item.mid, fetchSavedManhwas, number, navigation, logout, isLoggedIn])

    return (
        <View style={isTablet ? styles.itemContainerTablet : styles.itemContainerPhone}>
            <View style={styles.item}>
                <Image style={styles.logo} source={{ uri: `https://manhwasaver.com/4Z017sNnvsPD/${item.mid}.webp` }} />
                <View style={styles.itemOuter}>
                    <Text style={styles.title} numberOfLines={1}
                        ellipsizeMode="tail">{item.title}</Text>
                    <View style={styles.item}>
                        <View style={styles.itemInner}>
                            <Text style={styles.label}>Status: </Text>
                            <Text style={styles.misc}>{item.status} {item.status == 'Ongoing' ? <View style={{ backgroundColor: 'green', borderRadius: 50, width: 10, height: 10, }} /> : null}
                            </Text>
                            <Text style={styles.label}>Updated: </Text>
                            <Text style={styles.misc}>{new Date(item.lastUpdate).toLocaleString('nl-NL', {
                                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                            }).slice(0,
                                -3)}</Text>
                        </View>
                        <View style={styles.itemInner}>
                            <Text style={styles.label}>Chapters: </Text>
                            <Text style={styles.misc}>{item.chapter % 1 === 0 ? item.chapter : item.chapter.toFixed(1)} | {item.chapters % 1 === 0 ? item.chapters : item.chapters.toFixed(1)}</Text>
                            <Text style={styles.label}>Source: </Text>
                            <Text style={styles.misc}>{item.baseurl.split('/')[2].split('.')[0]}</Text>
                        </View>
                    </View>
                </View>
            </View>

            {item.category != 'Later' && item.category != 'Hiatus' ?
                <View style={styles.buttonItem}>
                    <TextInput
                        style={[stylesInput.input, styles.inputSize]}
                        onChangeText={onChangeNumber}
                        value={number}
                        placeholder={`Min: 1, Max:${item.chapters % 1 === 0 ? item.chapters : item.chapters.toFixed(1)} `}
                        keyboardType="numeric"
                        placeholderTextColor='#e0e0e0'
                    />
                    <TouchableOpacity style={styles.button} data={item} onPress={handleLog}>
                        <Text style={styles.buttonText}>Log</Text>
                    </TouchableOpacity>
                </View> : ''}
            <View>
                <View style={styles.buttonItem}>
                    <TouchableOpacity style={{ ...styles.button, ...styles.remove }} data={item} onPress={() => { confirmRemove(item) }}>
                        <Text style={styles.buttonText}>Remove</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ ...styles.button, ...styles.later }} data={item} onPress={() => { confirmLater(item) }}>
                        <Text style={styles.buttonText}>{item.reading == 0 ? 'Later' : 'Read'}</Text>
                    </TouchableOpacity>
                </View>
                {item.category != 'Later' && item.category != 'UpToDate' ?
                    <View style={styles.buttonItem}>
                        <TouchableOpacity style={styles.button} data={item} onPress={async () => { await Linking.openURL(item.link) }}>
                            <Text style={styles.buttonText}>Current</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ ...styles.button, ...styles.next }} data={item} onPress={async () => { await Linking.openURL(item.next) }}>
                            <Text style={styles.buttonText}>Next</Text>
                        </TouchableOpacity>
                    </View> : ''}
            </View>
        </View>
    )
})

const styles = StyleSheet.create({

    itemContainerTablet: {
        flex: 0.45,
        backgroundColor: '#1e1e1e',
        marginBottom: 20,
    },
    itemContainerPhone: {
        flex: 1,
        backgroundColor: '#1e1e1e',
        marginBottom: 20,
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
    itemOuter: {
        backgroundColor: '#1e1e1e',
        marginVertical: 8,
        flex: 1,
        paddingHorizontal: 10,
        alignItems: 'center',
    },
    itemInner: {
        backgroundColor: '#1e1e1e',
        flexDirection: 'column',
        alignItems: 'center',
        marginVertical: 8,
        marginHorizontal: 16,
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
        padding: 5,
        height: 150,
        width: 265
    },
    title: {
        fontSize: 18,
        textDecorationLine: 'underline',
        textAlign: 'center',
        color: 'white',
        height: 20,
    },
    content: {
        color: 'white'
    },
    misc: {
        color: 'white',
        flex: 1
    },
    label: {
        color: 'white',
    },
    logo: {
        height: 150,
        width: 100
    },
    buttonItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 20,
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#0d6efd',  // Blue background color
        borderRadius: 5,
        marginHorizontal: 5,
        borderWidth: 1,
        borderColor: 'black',
        flex: 1
    },
    buttonText: {
        color: '#fff',  // White text color
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    remove: {
        backgroundColor: '#ab2532'
    },
    later: {
        backgroundColor: '#e67e00',
        color: '#c1c1c1'
    },
    next: {
        backgroundColor: 'darkgreen'
    },
    indicate: {
        fontSize: 18,
        color: '#e0e0e0',
        position: 'absolute',
        marginTop: -18,
        textAlign: 'center',
        width: 265,
        textDecorationLine: 'underline'
    },
    inputSize: {
        flex: 1
    }
})