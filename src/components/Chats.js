import React, { useState, useEffect } from 'react';
import { Button, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import { useNavigation } from '@react-navigation/native';
import { CHATS } from '../server/endpoints';
import { addTokenToHeader, checkTokens, getNewToken } from './Utils';
import { Container, Custom, styles } from '../styles/MyComponentStyles';

const Chats = () => {
    const [items, setItems] = useState();
    const [search, setSearch] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = async () => {
            const tokens = await checkTokens();
            if (!tokens) {
                navigation.navigate('Login');
            }
            const { accessToken, refreshToken } = tokens;
            try {
                addTokenToHeader(accessToken);
                const itemsResponse = await axios.get(CHATS);
                setItems(itemsResponse.data.chats);
            } catch (error) {
                if (error.response.data.error) {
                    const errorMessage = error.response.data.error;
                    Toast.show(errorMessage);
                    console.log(error.response.data.error);
                }
                if (error.response.data.code === 'token_not_valid') {
                    const newToken = await getNewToken(refreshToken);
                    if (!newToken) {
                        navigation.navigate('Login');
                    } else {
                        fetchData();
                    }
                }
            }
        };

        fetchData();
    }, [items]);

    const handleSearch = (text) => {
        setSearch(text);
    };

    const handleButton = (chat) => {
        navigation.navigate('Messenger', { id: chat.id });
    };

    const handleCreateChat = async () => {
        const tokens = await checkTokens();
        if (!tokens) {
            navigation.navigate('Login');
        }
        const { accessToken, refreshToken } = tokens;
        try {
            addTokenToHeader(accessToken);
            const response = await axios.post(CHATS, data = { recipient: search });
            Toast.show(response.data.chat);
            const itemsResponse = await axios.get(CHATS);
            setItems(itemsResponse.data.chats);
        } catch (error) {
            if (error.response.data.error) {
                Toast.show(error.response.data.error);
                console.log(error);
            }
            if (error.response.data.code === 'token_not_valid') {
                const newToken = await getNewToken(refreshToken);
                if (!newToken) {
                    navigation.navigate('Login');
                } else {
                    fetchData();
                }
            }
        }
    };

    return (
        <Container>
            <View style={styles.searchContainer}>
                <Custom
                    placeholder="Recipient"
                    value={search}
                    onChangeText={handleSearch}
                />
                <Button title="Create" onPress={handleCreateChat} />
            </View>
            <View style={styles.chatContainer}>
                <ScrollView style={styles.scroll}>
                    {Array.isArray(items) ? (
                        items.map((chat) => (
                            <View key={chat.id}>
                                <TouchableOpacity style={styles.dialog} onPress={() => handleButton(chat)}>
                                    <Text style={styles.chatTitle}>{chat.title}</Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.text}>You dont have chats at this moment.</Text>
                    )}
                </ScrollView>
            </View>
        </Container>
    );
};

export default Chats;