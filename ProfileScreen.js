import { StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen(props) {
    return (
        <View style={styles.viewStyle}>
            <Text style={styles.headingStyle}>Profile</Text>
            <Text style={styles.textStyle}>This is the Profile Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    viewStyle: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    headingStyle: {
        fontSize: 30,
        color: 'black',
        textAlign: 'center',
    },
    textStyle: {
        fontSize: 20,
        color: 'black',
    }
})