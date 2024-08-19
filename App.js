import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import 'react-native-gesture-handler';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DrawerContent from './Components/DrawerContent';
import SplashScreen from 'react-native-splash-screen';
import { useEffect, lazy, Suspense, useState } from 'react';
import CustomLoadingScreen from './Components/CustomLoadingScreen';

const SavedScreenAll = lazy(() => import('./Screens/SavedScreenAll'));
const SavedScreenHiatus = lazy(() => import('./Screens/SavedScreenHiatus'));
const SavedScreenTry = lazy(() => import('./Screens/SavedScreenTry'));
const SavedScreenLater = lazy(() => import('./Screens/SavedScreenLater'));
const SavedScreenCompleted = lazy(() => import('./Screens/SavedScreenCompleted'));
const SavedScreenUpToDate = lazy(() => import('./Screens/SavedScreenUpToDate'));
const LatestScreen = lazy(() => import('./Screens/LatestScreen'));
const LoginScreen = lazy(() => import('./Screens/LoginScreen'));
const SearchScreen = lazy(() => import('./Screens/SearchScreen'));
// const SavedScreenOngoing = lazy(() => import('./Screens/SavedScreenOngoing'));

import HomeScreen from './Screens/HomeScreen';
import SavedScreenOngoing from './Screens/SavedScreenOngoing';
//Old load all on app load
// import SavedScreenAll from './Screens/SavedScreenAll';
// import SavedScreenHiatus from './Screens/SavedScreenHiatus';
// import SavedScreenTry from './Screens/SavedScreenTry';
// import SavedScreenLater from './Screens/SavedScreenLater';
// import SavedScreenCompleted from './Screens/SavedScreenCompleted';
// import SavedScreenUpToDate from './Screens/SavedScreenUpToDate';
// import LatestScreen from './Screens/LatestScreen';
// import LoginScreen from './Screens/LoginScreen';

import { AuthProvider, useAuth } from './Components/AuthContext';
import { ManhwaProvider } from './Components/ManhwaContext';

import FlashMessage from "react-native-flash-message";

const LazyScreenWrapper = ({ component: Component, ...props }) => {

    // const [isReady, setIsReady] = useState(false);

    // useEffect(() => {
    //     setIsReady(true);
    // }, []);

    // if (!isReady) {
    //     return <CustomLoadingScreen text="Loading manhwas..." />
    // }

    // return <Component {...props} />
    return (
        <Suspense fallback={<CustomLoadingScreen text='Loading manhwas...' />}>
            <Component {...props} />
        </Suspense>
    )
};

// Create components for each lazy-loaded screen
const LazySavedScreenAll = (props) => <LazyScreenWrapper component={SavedScreenAll} {...props} />;
const LazySavedScreenHiatus = (props) => <LazyScreenWrapper component={SavedScreenHiatus} {...props} />;
const LazySavedScreenTry = (props) => <LazyScreenWrapper component={SavedScreenTry} {...props} />;
const LazySavedScreenLater = (props) => <LazyScreenWrapper component={SavedScreenLater} {...props} />;
const LazySavedScreenCompleted = (props) => <LazyScreenWrapper component={SavedScreenCompleted} {...props} />;
const LazySavedScreenUpToDate = (props) => <LazyScreenWrapper component={SavedScreenUpToDate} {...props} />;
const LazyLatestScreen = (props) => <LazyScreenWrapper component={LatestScreen} {...props} />;
const LazyLoginScreen = (props) => <LazyScreenWrapper component={LoginScreen} {...props} />;
const LazySearchScreen = (props) => <LazyScreenWrapper component={SearchScreen} {...props} />;
// const LazySavedScreenOngoing = (props) => <LazyScreenWrapper component={SavedScreenOngoing} {...props} />;

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const screenOptionsGlobal = {
    headerShown: false,
    drawerStyle: {
        backgroundColor: '#212529',
    }
}

const StackNav = () => {
    const { authState } = useAuth();

    const screenOptionsStack = {
        navigation: useNavigation(),
        headerStyle: {
            backgroundColor: '#212529',
        },
        contentStyle: {
            backgroundColor: '#121212',
        },
        headerTitleStyle: {

            color: '#e0e0e0',
        },
        headerLeft: () => {
            return (
                <Icon
                    name="menu"
                    onPress={() => screenOptionsStack.navigation.openDrawer()}
                    size={30}
                    color="#e0e0e0"
                />
            )
        }
    }

    if (authState.isLoading) {
        return (<CustomLoadingScreen text='Is checking auth...' />
        );
    }

    return (
        <View style={{ flex: 1, height: "100%", width: "100%" }} collapsable={false}>
            <Stack.Navigator screenOptions={screenOptionsStack} initialRouteName={authState.isAuthenticated ? 'Saved Manhwas Ongoing' : 'Home'}>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Saved Manhwas Ongoing" component={SavedScreenOngoing} options={{ title: 'Saved Manhwas Ongoing' }} />

                <Stack.Screen name="Search" component={LazySearchScreen} options={{ title: 'Latest Manhwas' }} />
                <Stack.Screen name="Latest" component={LazyLatestScreen} options={{ title: 'Latest Manhwas' }} />
                <Stack.Screen name="Saved Manhwas All" component={LazySavedScreenAll} options={{ title: 'Saved Manhwas All' }} />
                <Stack.Screen name="Saved Manhwas Try" component={LazySavedScreenTry} options={{ title: 'Saved Manhwas Try' }} />
                <Stack.Screen name="Saved Manhwas Later" component={LazySavedScreenLater} options={{ title: 'Saved Manhwas Later' }} />
                <Stack.Screen name="Saved Manhwas Hiatus" component={LazySavedScreenHiatus} options={{ title: 'Saved Manhwas Hiatus' }} />
                <Stack.Screen name="Saved Manhwas UpToDate" component={LazySavedScreenUpToDate} options={{ title: 'Saved Manhwas Up-To-Date' }} />
                <Stack.Screen name="Saved Manhwas Completed" component={LazySavedScreenCompleted} options={{ title: 'Saved Manhwas Completed' }} />
                <Stack.Screen name="Login" component={LazyLoginScreen} options={{ title: 'Saved Manhwas Completed' }} />
                {/* <Stack.Screen name="Latest" component={LatestScreen} /> */}
                {/* <Stack.Screen name="Saved Manhwas All" component={SavedScreenAll} options={{ title: 'Saved Manhwas All' }} /> */}
                {/* <Stack.Screen name="Saved Manhwas Try" component={SavedScreenTry} options={{ title: 'Saved Manhwas Try' }} />
            <Stack.Screen name="Saved Manhwas Later" component={SavedScreenLater} options={{ title: 'Saved Manhwas Later' }} />
            <Stack.Screen name="Saved Manhwas Hiatus" component={SavedScreenHiatus} options={{ title: 'Saved Manhwas Hiatus' }} />
            <Stack.Screen name="Saved Manhwas UpToDate" component={SavedScreenUpToDate} options={{ title: 'Saved Manhwas Up-To-Date' }} />
            <Stack.Screen name="Saved Manhwas Completed" component={SavedScreenCompleted} options={{ title: 'Saved Manhwas Completed' }} /> */}
            </Stack.Navigator>
        </View>
    )
}

const DrawerNav = () => {

    return (
        <Drawer.Navigator
            drawerContent={props => <DrawerContent />}
            screenOptions={screenOptionsGlobal}>
            <Drawer.Screen name='All' component={StackNav} />
        </Drawer.Navigator>
    )
}

function App() {
    useEffect(() => {
        setTimeout(() => {
            SplashScreen.hide();
        }, 500)
    }, []);

    return (
        <AuthProvider>
            <ManhwaProvider>
                <NavigationContainer>
                    <DrawerNav />
                    <FlashMessage />
                </NavigationContainer>
            </ManhwaProvider>
        </AuthProvider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: '1',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    item: {
        backgroundColor: '#f9c2ff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
    },
    title: {
        fontSize: 32,
    },
    paginationButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
        marginHorizontal: 4,
        backgroundColor: 'gray',
    },
    activeButton: {
        backgroundColor: '#22c55d',
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    buttonText: {
        color: 'white',
    },
    menu: {
        backgroundColor: '#22c55d'
    }
});

export default App;