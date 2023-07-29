import { styled } from "styled-components/native";
import { StyleSheet } from "react-native";

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgb(10, 2, 87);
  padding-horizontal: 16px;
`;

export const Input = styled.TextInput`
  width: 100%;
  height: 6%;
  border: 1px solid #ccc;
  padding-horizontal: 8px;  border-radius: 10px;
  background-color: blue;
  color: white;
  margin-bottom: 16px;
`;

export const Custom = styled.TextInput`
  width: 80%;
  height: 100%;
  border: 1px solid #ccc;
  padding-horizontal: 8px;  
  border-radius: 10px;
  background-color: blue;
  color: white;
`;

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(10, 2, 87)',
        paddingHorizontal: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'space-between',
        width: '100%',
        paddingVertical: '3%',
    },
    header: {
        backgroundColor: 'rgb(6, 0, 63)',
        height: 70,
    },
    headerTitle: {
        fontWeight: 'bold',
    },
    scroll: {
        width: '100%',
        flex: 1,
    },
    dialog: {
        marginTop: '1%',
        height: '100%',
    },
    chatTitle: {
        color: 'white',
        fontSize: 16,
        paddingVertical: 8,
        textAlign: 'center',
    },
    chatContainer: {
        backgroundColor: 'blue',
        width: '100%',
        flex: 1,
        borderRadius: 10,
    },
    message: {
        marginTop: '2%',
    },
    chatUser: {
        color: 'yellow',
        fontSize: 18,
    },
    chatText: {
        color: 'white',
        fontSize: 16,
    },
    chatData: {
        color: 'aqua',
        fontSize: 15,
    },
    text: {
        color: 'white',
        textAlign: 'center',
    },
    link: {
        color: 'blue',
        textDecorationLine: 'underline',
        marginTop: '2%',
    },
    buttonContainer: {
        marginVertical: '2%',
        borderRadius: 10,
        overflow: 'hidden',
    },
});
