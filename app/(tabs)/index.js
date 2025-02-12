import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Alert, TouchableOpacity } from 'react-native';

import getRegistros, { updateRegistro } from '../service/Api';
import { formataNome } from '../utils/funcoesGlobais';
import { theme } from '../service/Theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default () => {
    const [todosRegistros, setTodosRegistros] = useState(null);
    const [retornoWebSocket, setRetornoWebSocket] = useState('');
    const [isDisabled, setisDisabled] = useState(false);

    const idRegistroAtual = useRef(null);
    const novoValorIsOpen = useRef('');
    const ws = useRef(null)

    useEffect(() => { 
        ws.current = new WebSocket('ws://192.168.15.32:5088');

        ws.current.onopen = () => {
            setisDisabled(false);
            console.warn('Conexão WebSocket aberta!')
        };
        
        ws.current.onmessage = (event) => {
            // console.warn('evv', event)
            setRetornoWebSocket(event.data);
            if(event.data === 'stop') {
                put();
            }
        };
        
        ws.current.onerror = (error) => {
            console.warn('erro:',error)
        };
        
        ws.current.onclose = (event) => {
            setisDisabled(true);
            // Alert.alert("Erro", "Conexão fechada, reabra o App")
            console.warn('fechado:', event.code) 
        };

        return () => {
            if (ws.current) {
                ws.current.close(); // Fecha a conexão ao desmontar o componente
            }
        };
    }, [])

    async function get () {
        try {   
            const result = await getRegistros('/registros');
            setTodosRegistros(result)
        } catch (err) {
            setError('Erro ao carregar os dados');
        }
    }

    async function put () {
        if((idRegistroAtual && idRegistroAtual.current === null) || (novoValorIsOpen && novoValorIsOpen.current === '')) {
            Alert.alert("Erro", "Algo saiu mal, tente novamente!")
            return false
        }

        data = {
            'is_open': novoValorIsOpen.current
        }

        try {
            const result = await updateRegistro(`/registros/${idRegistroAtual.current}`, data);
            if(result) {
                setisDisabled(false);
                get();
            }
        } catch (err) {
            Alert.alert("Erro", "Erro ao atualizar os dados")
        }
    }
    
    const verificaStatusConexao = (id = '', direcao = '') => {
        setisDisabled(true);

        if (ws.current && ws.current.readyState === WebSocket.OPEN && id != '' && direcao != '') {
            idRegistroAtual.current = id;
            novoValorIsOpen.current = direcao;
            ws.current.send(direcao);
        } else {
            Alert.alert("Erro", "Erro ao conectar")
        }
    }

    useEffect(() => {
        get();
    }, [])
    
    return (
    <SafeAreaView style={style.container}>
        <View style={[style.itemUnico]}>
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
            />
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