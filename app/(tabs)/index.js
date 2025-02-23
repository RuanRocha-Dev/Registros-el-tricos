import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import LottieView from "lottie-react-native";

import { theme } from '../service/Theme';
import getRegistros from '../service/Api';
import { registerForPushNotificationsAsync } from '../service/push';

import WebSocket from '../components/WebSocket';

export default () => {
    const [todosRegistros, setTodosRegistros] = useState(null);

    async function get () {
        try {   
            const result = await getRegistros('/registros');
            setTodosRegistros(result)
        } catch (err) {
            setTodosRegistros(null);
            setError('Erro ao carregar os dados');
        }
    }

    useFocusEffect(
        useCallback(() => {
            get();
        }, [])
    )

    registerForPushNotificationsAsync()
    .then(token => {})

    return (
        <SafeAreaView style={style.container}>
                <View style={[style.itemUnico]}>
                    {todosRegistros != null && todosRegistros != [] ? (  // Valida se a consulta trouxe algo ou se houve algum erro de requisição, se houver mostra o lottie
                        <FlatList
                            data={todosRegistros}
                            renderItem = {({ item }) => (
                                <WebSocket dados={item} callBackGet={() => get()}/>
                            )}
                            keyExtractor={item => item.id}
                            contentContainerStyle={style.lista}
                        />)
                        :
                        (
                            <LottieView
                            source={require("../utils/animation/time.json")}
                            style={{width: "100%", height: "80%", marginTop: '20%'}}
                            autoPlay
                            loop
                        />
                        )
                    }
                </View>
            </SafeAreaView>
        
    );
};

const style = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colorsBackground.pretoDeFundo
    },

    itemUnico: {
        width: '85%',
        minHeight: '60%',
        backgroundColor: theme.colorsBackground.cinzaEscuro,
        borderRadius: 15,
        padding: '0 20'
    },

    lista: {
        flex: 1,
        display: 'flex',
        justifyContent: 'space-evenly',
        paddingHorizontal: 20, // 10 dp para esquerda e direita
        paddingVertical: 0, 
    }
})