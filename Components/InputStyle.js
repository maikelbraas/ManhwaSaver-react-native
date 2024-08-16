import { StyleSheet } from "react-native";


export default styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#121212',  // Light background color
    },
    input: {
        height: 40,
        borderColor: '#e0e0e0',  // Light gray border
        borderWidth: 1,
        borderRadius: 8,
        marginLeft: 5,
        // marginBottom: 20,
        paddingHorizontal: 15,  // Padding inside the text input
        backgroundColor: '#212529',  // White background for inputs
        color: '#e0e0e0',
        flex: 0
    },
    button: {
        height: 50,
        backgroundColor: '#212529',  // Blue button background
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
    buttonText: {
        color: '#e0e0e0',  // White text color for the button
        fontSize: 16,
        fontWeight: 'bold',
    },
});