import React, { useEffect, useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

import getRegistros, { updateRegistro } from '../service/Api';
import { theme } from '../service/Theme';
import { formatarDatatempoReal, formataNome } from '../utils/funcoesGlobais';

import InputDefault from '../components/InputDefault';

export default (props) => {
    const [resultados, serResultados] = useState('');
    const [dataAgendamento, setDataAgendamento] = useState('');
    const [horaAgendamento, setHoraAgendamento] = useState('');
    const [registroSelecionado, setRegistroSelecionado] = useState(0);

    async function getRegistrosSemAgendamento () {
        try {
            const result = await getRegistros('/registros?scheduled_at=is');
            serResultados(result)
        } catch (err) {
            setError('Erro ao carregar os dados');
        }
    }

    function valoresData (e) {
        setDataAgendamento(e);
    }

    function valoresHora (e) {
        setHoraAgendamento(e);
    }

    function toogleRegistrosDisponiveis (id) {
        setRegistroSelecionado(id);
    }

    function formatarDataa(dataString) {
        const [data, hora] = dataString.split(' ');
        
        const [dia, mes, ano] = data.split('/');
        
        const [horas, minutos] = hora.split(':');
        
        const dataISO = `${ano}-${mes}-${dia}T${horas}:${minutos}:00Z`;
        
        return dataISO;
    }

    async function salvaAgendamento () {

        if(registroSelecionado == 0 || registroSelecionado == 0) {
            Alert.alert('Atenção', 'Selecione um registro');
            return false;
        }

        if(dataAgendamento == '') {
            Alert.alert('Atenção', 'Campo Data é obrigatório');
            return false;
        }

        if(horaAgendamento == '') {
            Alert.alert('Atenção', 'Campo hora é obrigatório');
            return false;
        }
        
        const dataCompletaAgendamento = `${dataAgendamento} ${horaAgendamento}`;
        if (formatarDataa(dataCompletaAgendamento) < formatarDataa(new Date().toLocaleString())) {
            Alert.alert('Atenção', 'A data completa não pode ser menor que agora.');
            return false;
        }
        
        try {
            const result = await updateRegistro(`/registros/${registroSelecionado}`, {scheduled_at: new Date(formatarDataa(dataCompletaAgendamento))});
            if(result) {
                getRegistrosSemAgendamento();
                props.escutaEvento(true);
                props.funcao(false);
            }
        } catch (err) {
            Alert.alert("Erro", "Erro ao atualizar os dados")
        }
    }

    useEffect(() => {
        if(props.visivel) {
            getRegistrosSemAgendamento();
        }
    }, [props.visivel])

    return (
            <Modal
                animationType="slide" 
                transparent={true}      
                visible={props.visivel}
                onRequestClose={() => props.funcao(false)}
                style={{ flex: 1, position: 'absolute', bottom: 0, left: 0 }}
            >
                <View style={style.modalView}> 
                    <FlatList
                        data={resultados}
                        renderItem = {({ item }) => (
                            <TouchableOpacity style={[style.containerText, Boolean(registroSelecionado == item.id) && style.registroSelecionado ]} onPress={() => toogleRegistrosDisponiveis(item.id, item.is_open)}>
                                <Text style={[style.texto, Boolean(registroSelecionado == item.id) && style.textoRegistroSelecionado]}> 
                                    {formataNome(item.name)}
                                </Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={item => item.id}
                        contentContainerStyle={style.lista}
                    />
                    <View style={style.boxInputs}>
                        <View style={style.itensInput}>
                            <Text style={style.textDatas}> Data </Text>
                            <InputDefault place='Apenas data' funcCallBackData={(e) => valoresData(e, 'data')}/>
                        </View>
                        <View style={style.itensInput}>
                            <Text style={style.textDatas}> Hora </Text>
                            <InputDefault place='Apenas Hora' funcCallBackHora={(e) => valoresHora(e, 'hora')}/>
                        </View>
                    </View>
                    <View style={style.boxBtns}>
                        <TouchableOpacity style={[style.btnAcao, {backgroundColor: '#a80202'}]} onPress={() => props.funcao?.(false)}>
                            <Text style={{ color: '#fff', textAlign: 'center' }}>Fechar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[style.btnAcao, {backgroundColor: theme.colorsBackground.verdeAtivo}]} onPress={() => salvaAgendamento()}>
                            <Text style={{ color: '#fff', textAlign: 'center' }}>Cadastrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
    );
};

const style = StyleSheet.create({
    modalView: {
        flex: 1,
        padding: 30,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.9,
        backgroundColor: theme.colorsBackground.pretoDeFundo,
    },

    lista: {
        minWidth: '100%',
        minHeight: '65%',
        display: 'flex',
        justifyContent: 'space-evenly',
        paddingHorizontal: 20,
        paddingVertical: 0
    },

    containerText: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffff',
        padding: 20,
        borderRadius: 15,
    },

    registroSelecionado: {
        backgroundColor: theme.colorsBackground.verdeAtivo
    },

    textoRegistroSelecionado: {
        color: '#fff'
    },
    
    texto: {
        textTransform: 'uppercase',
        fontSize: 20,
        color: theme.colorsBackground.verde,
    },

    boxInputs: {
        width: '100%',
        height: '35%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    itensInput: {
        width: '80%',
        height: '40%'
    },

    textDatas: {
        minWidth: '100%',
        textAlign: 'left',
        fontSize: 20,
        color: '#fff'
    },

    boxBtns: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },

    btnAcao: {
        width: '35%',
        paddingVertical: 10,
        borderRadius: 5,
    }
});