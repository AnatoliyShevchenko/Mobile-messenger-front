import React, { useState, useEffect, useRef } from "react";
import { Button, View, Text, ScrollView } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import { addTokenToHeader, checkTokens, getNewToken } from './Utils';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MESSAGES, SOCKET_URL } from "../server/endpoints";
import { Container, Custom, styles } from "../styles/MyComponentStyles";

const Messenger = () => {
    const route = useRoute();
    const scrollViewRef = useRef(null);
    const [items, setItems] = useState([]);
    const [message, setMessage] = useState('');
    const chatSocket = useRef(null);
    const id = route.params.id;
    const navigation = useNavigation();
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            const tokens = await checkTokens();
            if (!tokens) {
                navigation.navigate('Login');
            }
            const { accessToken, refreshToken } = tokens;
            try {
                addTokenToHeader(accessToken);
                const response = await axios.get(`${MESSAGES}${id}/`);
                setItems(response.data.messages);
                const socket = new WebSocket(`${SOCKET_URL}chat_${id}/`);
                chatSocket.current = socket;
            } catch (error) {
                if (error.response.data.code === 'token_not_valid') {
                    const newToken = await getNewToken(refreshToken);
                    if (!newToken) {
                        navigation.navigate('Login');
                    } else {
                        fetchData();
                    }
                } else {
                    console.log(error);
                }
            }
        };
        fetchData();

        return () => {
            if (chatSocket.current) {
                chatSocket.current.close();
            }
        };
    }, [id]);

    useEffect(() => {
        if (chatSocket.current) {
            chatSocket.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setItems((prevItems) => [...prevItems, data]);
            };

            chatSocket.current.onclose = () => {
                console.log("WebSocket connection closed.");
            };
        }
    }, [chatSocket.current]);

    const handleMessage = (text) => {
        setMessage(text);
    };

    const handleSend = async () => {
        const tokens = await checkTokens();
        if (!tokens) {
            navigation.navigate('Login');
        }
        const { accessToken, refreshToken } = tokens;
        const data = {
            chat_id: id,
            content: message
        }
        try {
            addTokenToHeader(accessToken);
            const chatResponse = await axios.post(MESSAGES, data);
            setMessage('');
            Toast.show(chatResponse.data.success);
        } catch (error) {
            if (error.response.data.code === 'token_not_valid') {
                const newToken = await getNewToken(refreshToken);
                if (!newToken) {
                    navigation.navigate('Login');
                } else {
                    fetchData();
                }
            } else {
                console.log(error);
            }
        }
    };

    const scrollToEnd = () => {
        if (scrollViewRef.current && contentHeight > 0) {
            scrollViewRef.current.scrollTo({ y: contentHeight, animated: true });
        }
    };

    useEffect(() => {
        scrollToEnd();
    }, [items, contentHeight]);

    return (
        <Container>
            <View style={styles.chatContainer}>
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.scroll}
                    onContentSizeChange={(width, height) => setContentHeight(height)}>
                    {items.length > 0 ? (
                        items.map((message, index) => (
                            <View key={index} style={styles.message}>
                                <View><Text style={styles.chatUser}>{message.sender.username}</Text></View>
                                <View><Text style={styles.chatData}>{message.created_at || "свежак"}</Text></View>
                                <View><Text style={styles.chatText}>{message.content}</Text></View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.text}>You dont have messages at this moment.</Text>
                    )}
                </ScrollView>
            </View>
            <View style={styles.searchContainer}>
                <Custom
                    placeholder="Enter message"
                    value={message}
                    onChangeText={handleMessage}
                />
                <Button title="Create" onPress={handleSend} />
            </View>
        </Container>
    )
}

export default Messenger;