import React from 'react';
import { ActivityIndicator } from 'react-native';
import { Container } from '../styles/MyComponentStyles';

const LoadingScreen = () => {
    return (
        // <View style={styles.container}>
        <Container>
            <ActivityIndicator size="large" color="blue" />
        </Container>
        // </View>
    );
};

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         backgroundColor: 'rgb(10, 2, 87)',
//         alignItems: 'center',
//     },
// });

export default LoadingScreen;
