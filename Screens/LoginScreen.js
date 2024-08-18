import { useAuth } from './../Components/AuthContext';
import { login as apiLogin } from '../Components/AuthLogic'
import React, { useState, useEffect, Suspense } from 'react';
import { View, TextInput, Alert, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../Components/InputStyle'
import * as Keychain from "react-native-keychain"


const retrieveCredentials = async () => {
    try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
            return credentials;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error retrieving credentials:', error);
    }
    return null;
};


const saveCredentials = async (username, password) => {
    try {
        await Keychain.setGenericPassword(username, password);
    } catch (error) {
        console.error('Error saving credentials:', error);
    }
};

const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigation = useNavigation();

    useEffect(() => {
        const checkSavedCredentials = async () => {
            const savedCredentials = await retrieveCredentials();
            if (savedCredentials) {
                const { username, password } = savedCredentials;
                Alert.alert('Use saved credentials', `Do you want to use your saved credentials?`, [
                    {
                        text: 'Cancel',
                        onPress: () => {
                            setUsername('')
                            setPassword('')
                        },
                        style: 'cancel',
                    },
                    {
                        text: 'OK', onPress: () => {
                            setUsername(username)
                            setPassword(password)
                        }
                    },
                ])
            }
        };
        checkSavedCredentials();
    }, [])
    const handleLogin = async () => {
        const data = await apiLogin(username, password);
        if (data.success) {
            await AsyncStorage.setItem('userId', `${data.user.id}`);
            await login();
            saveCredentials(username, password)
            navigation.navigate('Saved Manhwas Ongoing');
        } else {
            Alert.alert('Login Failed', 'Please check your credentials and try again.');
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Username"
                autoCapitalize='none'
                value={username}
                autoComplete='username'
                onChangeText={setUsername}
                style={{ ...styles.input }}
                textContentType='username'
                placeholderTextColor='#e0e0e0'
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
                textContentType='password'
                autoComplete='current-password'
                placeholderTextColor='#e0e0e0'
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
        </View>
    );
};


export default LoginScreen;
