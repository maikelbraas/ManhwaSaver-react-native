import { StyleSheet } from "react-native";
import { Text, TouchableOpacity } from 'react-native';

export default function Pagination({ handlePageClick, totalPages, currentPage }) {
    const maxButtonsToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

    if (endPage - startPage + 1 < maxButtonsToShow) {
        startPage = Math.max(1, endPage - maxButtonsToShow + 1);
    }

    const buttons = [
        <TouchableOpacity
            key='start'
            onPress={() => handlePageClick(1)}
            style={[
                styles.paginationButton
            ]}>
            <Text style={{ color: 'white' }}>Start</Text>
        </TouchableOpacity>];
    for (let i = startPage; i <= endPage; i++) {
        buttons.push(
            <TouchableOpacity
                key={i}
                onPress={() => handlePageClick(i)}
                style={[
                    styles.paginationButton,
                    i === currentPage ? styles.activeButton : null,
                ]}>
                <Text style={{ color: 'white' }}>{i}</Text>
            </TouchableOpacity>,
        );
    }
    buttons.push(
        <TouchableOpacity
            key='end'
            onPress={() => handlePageClick(parseInt(totalPages))}
            style={[
                styles.paginationButton
            ]}>
            <Text style={{ color: 'white' }}>End</Text>
        </TouchableOpacity>)
    return (buttons)
}

const styles = StyleSheet.create({
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
})