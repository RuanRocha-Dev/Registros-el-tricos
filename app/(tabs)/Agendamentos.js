import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Keyboard, TouchableOpacity, Alert  } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import LottieView from "lottie-react-native";

import getRegistros, { updateRegistro } from '../service/Api';
import { theme } from '../service/Theme';
import { formatarDataPtBr, formataNome } from '../utils/funcoesGlobais';
import Modal from '../views/Modal';

export default () => {
    const [eventoTeclado, setEventoTeclado] = useState(false);
    const [registrosComAgendamento, setRegistrosComAgendamento] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);
    const [qntdElementosAgendados, setQntdElementosAgendados] = useState(false); // Estado para saber quantos regisros tem no banco de dados, para saber se posso ou n deixar habilitado o botão de agendamento

    function ajustaTelaTecladoAberto() { // Evento de teclado que captura se o teclado esta aberto ou fechado
        const tecladoFechado = Keyboard.addListener('keyboardDidHide', () => {
            setEventoTeclado(false);
        });
        
        const tecladoAberto = Keyboard.addListener('keyboardDidShow', () => {
            setEventoTeclado(true);
        });
        
        return () => {
            tecladoFechado.remove();
            tecladoAberto.remove();
        };
    }

    async function getR () {
        try {
            const result = await getRegistros('/registros?scheduled_at=null');
            setRegistrosComAgendamento(result);
        } catch (err) {
            setError('Erro ao carregar os dados');
        }
    }

    function mudaStatusModal (el) {
        setModalAberto(el)
    }

    async function todasAsLinhas () {
        try {
            const result = await getRegistros('/todasLinhas');
                const verificaQntd = Number(result) <= Number(registrosComAgendamento.length); 
                setQntdElementosAgendados(verificaQntd);
        } catch (err) {
            setError('Erro ao carregar os dados');
        }
    }

    async function cancelarAgendamento (id = null) {
        if(id === null) {
            return false;
        }

        data = {
            'scheduled_at': null
        }

        try {
            const result = await updateRegistro(`/registros/${id}`, data);
            if(result) {
                getR();
            }
        } catch (err) {
            Alert.alert("Erro", "Erro ao atualizar os dados")
        }
    }

    function confirmarExclusaoAgendamento (id, nome) {
        Alert.alert('ATENÇÃO', `Excluir o agendamento do ${nome}?`, [
            {
                text: 'Fechar',
                onPress: () => {},
                style: 'cancel'
            },
            {
                text: 'Confirmar',
                onPress: () => cancelarAgendamento(id)
            }
        ])
    }

    useFocusEffect(
        useCallback(() => {
            getR();
            ajustaTelaTecladoAberto();
        }, [])
    ); 

    useFocusEffect(
        useCallback(() => {
            todasAsLinhas();
        }, [registrosComAgendamento])
    );
    return (
    <SafeAreaView style={style.container}>
        <View style={[style.itemUnico, {height: eventoTeclado ? '60%' : '40%'}]}>
            {registrosComAgendamento != 0 ? (
                <FlatList
                    data={registrosComAgendamento}
                    renderItem = {({ item }) => (
                        <TouchableOpacity style={style.containerText} onPress={() => confirmarExclusaoAgendamento(item.id, item.name)}>
                            <Text style={style.texto}>
                                {formataNome(item.name)}  
                                - 
                                <Text style={{ fontWeight: 'bold' }} > {item.is_open === '0' ? 'vai abrir' : 'vai fechar'} </Text> 
                            </Text>
                            <Text style={style.texto}> {formatarDataPtBr(item.scheduled_at)} </Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={item => item.id}
                    contentContainerStyle={style.lista}
                />
            ) : (
                <LottieView
                    source={require("../utils/animation/empty.json")}
                    style={{width: "100%", height: "100%"}}
                    autoPlay
                    loop
                />
            )}
        </View>
        <TouchableOpacity style={[style.btnCriar, {opacity: qntdElementosAgendados ? 0.5 : 1}]} disabled={qntdElementosAgendados}  onPress={() => setModalAberto(true)}> 
            <Text style={style.textBtns}> CRIAR AGENDAMENTO </Text> 
        </TouchableOpacity>
        <Modal visivel={modalAberto} funcao={mudaStatusModal} escutaEvento={(e) => e ? getR() : ''}/>
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

    containerText: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colorsBackground.verdeAtivo,
        padding: 10,
        borderRadius: 15,
        boxShadow: '6 4 5 0 rgba(0,0,0,0.21)'
    },
    
    texto: {
        textTransform: 'uppercase',
        fontSize: 20,
        color: '#fff',
    },

    btnCriar: {
        width: '85%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        paddingVertical: 20,
        borderRadius: 15,
        backgroundColor: theme.colorsBackground.verde,
        marginTop: 20,
    },

    textBtns: {
        color: '#fff',
        fontSize: 18,
    }
})