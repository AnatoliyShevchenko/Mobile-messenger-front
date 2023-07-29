import React, { useState } from 'react';
import { Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LOGIN } from '../server/endpoints';
import Toast from 'react-native-simple-toast';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Container, Input, styles } from '../styles/MyComponentStyles';

const Authorization = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleUsernameChange = (text) => {
        setUsername(text);
    };

    const handlePasswordChange = (text) => {
        setPassword(text);
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post(LOGIN, {
                username,
                password,
            });
            AsyncStorage.setItem('access', response.data.Success.access);
            AsyncStorage.setItem('refresh', response.data.Success.refresh);
            console.log('Token saved successfully.');
            Toast.show(`Welcome ${response.data.Success.username}`);
            navigation.navigate('Chats');
        } catch (error) {
            if (error.response.data.password) {
                const errorMessage = error.response.data.password;
                errorMessage.forEach((message) => {
                    Toast.show(message);
                });
            };
            if (error.response.data.error) {
                const message = error.response.data.error;
                Toast.show(message);
            };
        }
    };

    return (
        <Container>
            <Input
                placeholder="Username"
                value={username}
                onChangeText={handleUsernameChange}
            />
            <Input
                placeholder="Password"
                secureTextEntry={true}
                value={password}
                onChangeText={handlePasswordChange}
            />
            <Button title="Login" onPress={handleLogin} />
            <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                <Text style={styles.link}>Don't have an account? Register here.</Text>
            </TouchableOpacity>
        </Container>
    );
};

export default Authorization;
