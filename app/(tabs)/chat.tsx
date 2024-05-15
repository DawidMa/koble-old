import Ionicons from '@expo/vector-icons/Ionicons';
import {StyleSheet, Image, Platform, Button, FlatList, TextInput, View, Pressable} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import React, {useEffect, useRef, useState} from "react";
import {Client, IMessage} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {ThemedButton} from "@/components/ThemedButton";
import {useThemeColor} from "@/hooks/useThemeColor";

const WEBSOCKET_URL = 'http://192.168.178.20:8080/koble'; // Replace with your WebSocket URL

export default function ChatScreen() {
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<string[]>([]);
    const [inputText, setInputText] = useState('');
    const client = useRef<Client | null>(null);
    const themeTextColor = useThemeColor({}, 'text');
    const themePlaceholderColor = useThemeColor({}, 'textPlaceholderText');
    const tintColor = useThemeColor({}, 'tint');

    useEffect(() => {
        return () => {
            if (client.current) {
                client.current.deactivate();
            }
        };
    }, []);

    const connectWebSocket = () => {
        const socket = new SockJS(WEBSOCKET_URL);
        client.current = new Client({
            webSocketFactory: () => socket,
            debug: (str) => console.log(str),
            onConnect: () => {
                setIsConnected(true);
                client.current?.subscribe('/test/topic/greetings', (message: IMessage) => {
                    setMessages((prevMessages) => [...prevMessages, message.body]);
                });
            },
            onDisconnect: () => {
                setIsConnected(false);
                client.current?.deactivate()
                setMessages([]);
            }
        });

        client.current.activate();
    };

    const sendMessage = () => {
        if (client.current && isConnected && inputText.trim()) {
            client.current.publish({
                destination: '/app/test/greet',
                body: JSON.stringify({name: inputText.trim()}),
            });
            setInputText('');
        }
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{light: '#D0D0D0', dark: '#113636'}}
            headerImage={<Ionicons size={200} name="chatbox" style={[styles.headerImage, {color: tintColor}]}/>}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Chat</ThemedText>
            </ThemedView>
            <ThemedButton onPress={connectWebSocket} disabled={isConnected}
                          variant={'outlined'}>{isConnected ? 'Connected' : 'Connect to WebSocket'}</ThemedButton>
            {isConnected && (
                <>
                    <TextInput
                        onSubmitEditing={sendMessage}
                        placeholderTextColor={themePlaceholderColor}
                        style={[styles.input, {color: themeTextColor, borderColor: themeTextColor}]}
                        placeholder="Enter your name"
                        value={inputText}
                        onChangeText={setInputText}
                    />
                    <ThemedButton variant='contained' onPress={sendMessage}>Send Message</ThemedButton>
                </>
            )}
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                    <View style={styles.messageContainer}>
                        <ThemedText style={styles.messageText}>{item}</ThemedText>
                    </View>
                )}
            />
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        top: 10,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    input: {
        height: 40,
        borderWidth: 1,
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    messageContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    messageText: {
        fontSize: 16,
    },
});
