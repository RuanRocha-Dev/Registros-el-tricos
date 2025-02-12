import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Keyboard, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import getRegistros, { updateRegistro } from '../service/Api';
import { theme } from '../service/Theme';
import { formatarDataPtBr, formataNome } from '../utils/funcoesGlobais';
import Modal from '../views/Modal';

export default () => {
    const [eventoTeclado, setEventoTeclado] = useState(false);
    const [registrosComAgendamento, setRegistrosComAgendamento] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);
    
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
            setRegistrosComAgendamento(result)
        } catch (err) {
            setError('Erro ao carregar os dados');
        }
    }

    useEffect(() => {
        getR();
        ajustaTelaTecladoAberto();
    }, [])

    function mudaStatusModal (el) {
        setModalAberto(el)
    }

    return (
    <SafeAreaView style={style.container}>
        <View style={[style.itemUnico, {height: eventoTeclado ? '60%' : '40%'}]}>
            <FlatList
                data={registrosComAgendamento}
                renderItem = {({ item }) => (
                    <View style={style.containerText}>
                        <Text style={style.texto}>
                            {formataNome(item.name)}  
                            - 
                            <Text style={{ fontWeight: 'bold' }} > {item.is_open === '0' ? 'vai abrir' : 'vai fechar'} </Text> 
                        </Text>
                        <Text style={style.texto}> {formatarDataPtBr(item.scheduled_at)} </Text>
                    </View>
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={style.lista}
            />
        </View>
        <TouchableOpacity style={style.btnCriar} onPress={() => setModalAberto(true)}> 
            <Text style={style.textBtns}> CRIAR AGENDAMENTO </Text> 
        </TouchableOpacity>
        <Modal visivel={modalAberto} funcao={mudaStatusModal}/>
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