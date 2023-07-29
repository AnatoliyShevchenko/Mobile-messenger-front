import React, { useState } from 'react';
import { Button, View, Text } from 'react-native';
import axios from 'axios';
import Toast from 'react-native-simple-toast';
import { REG } from '../server/endpoints';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import { Container, Input, styles } from '../styles/MyComponentStyles';

const Registration = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [image, setImage] = useState('');
    const navigation = useNavigation();

    const handleUsername = (text) => {
        setUsername(text);
    };

    const handleEmail = (text) => {
        setEmail(text);
    }

    const handlePassword = (text) => {
        setPassword(text);
    };

    const handleRepeatPassword = (text) => {
        setRepeatPassword(text);
    };

    const handleFirstName = (text) => {
        setFirstName(text);
    };

    const handleLastName = (text) => {
        setLastName(text);
    };

    const handlePhoneNumber = (text) => {
        setPhoneNumber(text);
    };

    const selectImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission denied for accessing media library');
                return;
            }

            const options = {
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            };

            const result = await ImagePicker.launchImageLibraryAsync(options);

            if (!result.canceled) {
                if (result.assets && result.assets.length > 0) {
                    setImage(result.assets[0].uri);
                }
            }
        } catch (error) {
            console.log('Error accessing media library:', error);
        }
    };

    const handleRegistrationSuccess = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setRepeatPassword('');
        setFirstName('');
        setLastName('');
        setPhoneNumber('');
        setImage('');
    };

    const handleRegistration = async () => {
        if (!email || !firstName || !lastName || !password || !phoneNumber || !repeatPassword || !username) {
            Toast.show('Все поля должны быть заполнены!')
            return;
        }
        try {
            const data = new FormData();
            data.append('username', username);
            data.append('email', email);
            data.append('password', password);
            data.append('repeat_password', repeatPassword);
            data.append('first_name', firstName);
            data.append('last_name', lastName);
            data.append('phone_number', phoneNumber);

            if (image) {
                const imageName = image.substring(image.lastIndexOf('/') + 1);
                data.append('image', {
                    uri: image,
                    name: imageName,
                    type: 'image/jpeg',
                });
            }

            const response = await axios.post(REG, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Toast.show(response.data.Registration);
            handleRegistrationSuccess();
            navigation.navigate('Login');
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
            
                if (errorData.username) {
                  errorData.username.forEach((errorMessage) => {
                    Toast.show(errorMessage);
                  });
                }
                if (errorData.email) {
                  errorData.email.forEach((errorMessage) => {
                    Toast.show(errorMessage);
                  });
                }
                if (errorData.password) {
                  errorData.password.forEach((errorMessage) => {
                    Toast.show(errorMessage);
                  });
                }
                if (errorData.repeat_password) {
                  errorData.repeat_password.forEach((errorMessage) => {
                    Toast.show(errorMessage);
                  });
                }
                if (errorData.phone_number) {
                  errorData.phone_number.forEach((errorMessage) => {
                    Toast.show(errorMessage);
                  });
                }
              } else {
                Toast.show('Произошла ошибка. Пожалуйста, попробуйте еще раз.');
              }
        }
    };

    return (
        <Container>
            <Input
                placeholder="Username"
                value={username}
                onChangeText={handleUsername} />
            <Input
                placeholder="Email"
                value={email}
                onChangeText={handleEmail} />
            <Input
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={handlePassword} />
            <Input
                placeholder="Repeat Password"
                secureTextEntry
                value={repeatPassword}
                onChangeText={handleRepeatPassword} />
            <Input
                placeholder="First Name"
                value={firstName}
                onChangeText={handleFirstName} />
            <Input
                placeholder="Last Name"
                value={lastName}
                onChangeText={handleLastName} />
            <Input
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={handlePhoneNumber} />
            <View style={styles.buttonContainer}>
                <Button title="Select Image" onPress={selectImage} />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Register" onPress={handleRegistration} />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Already have account? Login here.</Text>
            </TouchableOpacity>
        </Container>
    );
};

export default Registration;