import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';

const tips = [
    "Did you know? Manhwa is the Korean term for comics and print cartoons.",
    "Tip: You can organize your manhwas by status in our app!",
    "Fun fact: Many manhwas are now digitally created and published.",
];


const CustomLoadingScreen = ({ text }) => {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
            />
            <ActivityIndicator size="large" color="#007bff" />
            <Text style={styles.loadingText}>{text}</Text>
            <Text style={styles.tipText}>{randomTip}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    loadingText: {
        fontSize: 18,
        color: '#e0e0e0',
        marginBottom: 10,
    },
    tipText: {
        fontSize: 14,
        color: '#a0a0a0',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});

export default CustomLoadingScreen;