import { useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';
import LottieView from "lottie-react-native";

import { theme } from '../service/Theme';
import { formataNome } from '../utils/funcoesGlobais';
import getRegistros, { updateRegistro } from '../service/Api';
import { registerForPushNotificationsAsync } from '../service/push';

export default () => {
    const [todosRegistros, setTodosRegistros] = useState(null);
    const [isDisabled, setisDisabled] = useState(false);

    const idRegistroAtual = useRef(null);
    const novoValorIsOpen = useRef(''); 
    const ws1 = useRef(false);
    const ws2 = useRef(false);
    const ws3 = useRef(false);
    const ws4 = useRef(false);
    const wss = useRef(false);
    const arrRegistrosCheio = useRef(false)

    
    function conectaWsPlaca () {
        if(todosRegistros == null || arrRegistrosCheio.current) {
            return false;
        }
        
        arrRegistrosCheio.current = true;
        todosRegistros.forEach((el, index) => {
            
            if(el.ip_placa == null) return false;

            switch (index++) {
                case 1:
                    wss.current = ws1;
                    break;
                case 2:
                    wss.current = ws2;
                    break;
                case 3:
                    wss.current = ws3;
                    break;
                case 4:
                    wss.current = ws4;
                    break;
            
                default:
                    break;
            }
            
            wss.current = new WebSocket(`ws://${el.ip_placa}`);
        
            wss.current.onclose = () => {} // Fechando qualquer conexão que tenha ficado aberto por algum motivo 
        
            wss.current.onopen = () => {
                setisDisabled(false);
                console.warn('Conexão WebSocket aberta!')
            };
            
            wss.current.onmessage = (event) => {
                if(event.data === 'stop') {
                    put();
                }
            };
            
            wss.current.onerror = (error) => {
                console.warn('erro:',error)
            };
            
            wss.current.onclose = (event) => {
                setisDisabled(true);
                Alert.alert('Atenção', 'Conexão com o motor perdida, pressione para reconectar.', [ 
                    {
                        text: 'Reconectar',
                        onPress: () => {
                            conectaWsPlaca();
                        }
                    }
                ])
                console.warn('fechado:', event.code) 
            };
        
            return () => {
                if (wss.current) {
                    wss.current.close(); // Fecha a conexão ao desmontar o componente
                }
            };
        })
    }

    async function get () {
        try {   
            const result = await getRegistros('/registros');
            setTodosRegistros(result)
        } catch (err) {
            setTodosRegistros(null);
            setError('Erro ao carregar os dados');
        }
    }

    async function put () {
        if((idRegistroAtual && idRegistroAtual.current === null) || (novoValorIsOpen && novoValorIsOpen.current === '')) {
            Alert.alert("Atenção", "Algo saiu mal, tente novamente!")
            return false
        }

        data = {
            'is_open': novoValorIsOpen.current
        }

        try {
            const result = await updateRegistro(`/registros/${idRegistroAtual.current}`, data);
            
            if(result.status == 1) {
                setisDisabled(false);
                get();
            }
        } catch (err) {
            Alert.alert('Atenção', 'Erro ao atualizar os dados', [
                {
                    text: 'Fechar',
                    onPress: () => {
                        setisDisabled(false);
                    },
                    style: 'cancel'
                }
            ])
        }
    }
    
    const verificaStatusConexao = (id = '', direcao = '') => {
        setisDisabled(true);
        
        if (wss.current && wss.current.readyState === WebSocket.OPEN && id != '' && direcao != '') {
            idRegistroAtual.current = id;
            novoValorIsOpen.current = direcao;
            wss.current.send(direcao);
        } else {
            Alert.alert("Erro", "Erro ao conectar")
        }
    }

    useEffect(() => { 
        conectaWsPlaca();
    }, [todosRegistros]);

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
                                <TouchableOpacity 
                                    onPress={() => {verificaStatusConexao(`${item.id}`, item.is_open !== '0' ? '0' : '1')}} 
                                    style={[style.botoes, {backgroundColor: item.is_open !== '0' ? theme.colorsBackground.verde : theme.colorsBackground.vermelho, opacity: !isDisabled ? 1 : 0.5}]}
                                    disabled={isDisabled}
                                >
                                    <Text style={style.textBtns}> {formataNome(item.name)} </Text>
                                </TouchableOpacity>
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
    },

    botoes: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 15,
        boxShadow: '6 4 5 0 rgba(0,0,0,0.21)'
    },
    
    textBtns: {
        textTransform: 'uppercase',
        fontSize: 28,
        color: '#fff',
    },

})