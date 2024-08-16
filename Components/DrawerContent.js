import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Avatar, Title } from 'react-native-paper';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logout as authLogout } from './AuthLogic';


export default function DrawerContent(props) {
    const { authState } = useAuth();
    const navigation = useNavigation();
    const { logout } = useAuth();

    const handlePressLogout = async () => {
        await logout();
        await authLogout();
        navigation.navigate('Home');
    };

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView {...props}>
                <View style={styles.drawerContent}>
                    <TouchableOpacity activeOpacity={0.8}>
                        <View style={styles.userInfoSection}>
                            <View style={{ marginLeft: 10, flexDirection: 'column' }}>
                                <Title style={styles.title}>{props.username}</Title>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.drawerSection}>
                        <DrawerItems />
                    </View>
                </View>
            </DrawerContentScrollView>
            {authState.isAuthenticated ?
                <View>
                    <View style={styles.bottomDrawerSection}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon name="folder-check" color={'#e0e0e0'} size={size} />
                            )}
                            label={() => <Text style={{ color: '#e0e0e0' }}>All saved manhwas</Text>}
                            onPress={() => { navigation.navigate('Saved Manhwas All') }}
                        />
                    </View>
                    <View style={styles.bottomDrawerSection}>
                        <DrawerItem
                            icon={({ color, size }) => (
                                <Icon name="exit-to-app" color={'#e0e0e0'} size={size} />
                            )}
                            label={() => <Text style={{ color: '#e0e0e0' }}>Sign out</Text>}
                            onPress={handlePressLogout}
                        />
                    </View>
                </View> : ''}
        </View>
    );
}

const styles = StyleSheet.create({
    drawerContent: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 13,
        lineHeight: 14,
        // color: '#6e6e6e',
        width: '100%',
    },
    row: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center',
        // marginRight: 15,
    },
    paragraph: {
        fontWeight: 'bold',
        marginRight: 3,
    },
    drawerSection: {
        marginTop: 15,
        borderBottomWidth: 0,
        borderBottomColor: '#dedede',
        borderBottomWidth: 1,
    },
    bottomDrawerSection: {
        marginBottom: 15,
        borderTopColor: '#dedede',
        borderTopWidth: 1,
        borderBottomColor: '#dedede',
        borderBottomWidth: 1,
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
});

const DrawerList = [
    { icon: 'home-outline', label: 'Home', navigateTo: 'Home' },
    { icon: 'book-sync', label: 'Latest', navigateTo: 'Latest' },
    { icon: 'book-open-page-variant', label: 'Saved Manhwas Ongoing', navigateTo: 'Saved Manhwas Ongoing', requiresAuth: true },
    { icon: 'book-lock', label: 'Saved Manhwas Hiatus', navigateTo: 'Saved Manhwas Hiatus', requiresAuth: true },
    { icon: 'book-search', label: 'Saved Manhwas Try', navigateTo: 'Saved Manhwas Try', requiresAuth: true },
    { icon: 'book-off', label: 'Saved Manhwas Read Later', navigateTo: 'Saved Manhwas Later', requiresAuth: true },
    { icon: 'book-clock', label: 'Saved Manhwas UpToDate', navigateTo: 'Saved Manhwas UpToDate', requiresAuth: true },
    { icon: 'book-education', label: 'Saved Manhwas Completed', navigateTo: 'Saved Manhwas Completed', requiresAuth: true },
    { icon: 'login', label: 'Login', navigateTo: 'Login', hideWhenAuth: true },
    { icon: 'magnify', label: 'Search Manhwas', navigateTo: 'Search' },
];
const DrawerLayout = ({ icon, label, navigateTo }) => {
    const navigation = useNavigation();
    return (
        <View>
            <DrawerItem
                style={{ width: 300 }}
                icon={({ color, size }) => <Icon name={icon} color={'#e0e0e0'} size={24} />}
                label={() => <Text style={{ color: '#e0e0e0' }} label={label}>{label}</Text>}
                onPress={() => {
                    navigation.navigate(navigateTo);
                }}
            />
        </View>
    );
};

const DrawerItems = () => {
    const { authState } = useAuth();

    return DrawerList.map((el, i) => {
        if (el.requiresAuth && !authState.isAuthenticated) {
            return null; // Don't render if it requires auth and user is not authenticated
        }
        if (el.hideWhenAuth && authState.isAuthenticated) {
            return null; // Don't render if it should be hidden when authenticated and user is authenticated
        }
        return (
            <DrawerLayout
                key={i}
                icon={el.icon}
                label={el.label}
                navigateTo={el.navigateTo}
            />
        );
    });
};