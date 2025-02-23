import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

import { formataNome } from '../utils/funcoesGlobais';
import { theme } from '../service/Theme';
import { updateRegistro } from '../service/Api';


export default ({ dados, callBackGet }) => {
    const [isDisabled, setisDisabled] = useState(false);
    
    const idRegistroAtual = useRef(null);
    const novoValorIsOpen = useRef(''); 
    const wss = useRef(false);

    function conectaWsPlaca () {
        if(!dados.ip_placa) return;

        wss.current = new WebSocket(`ws://${dados.ip_placa}`);
    
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
            Alert.alert('Atenção', 'Conexão com algum motor perdida, pressione para reconectar.', [ 
                {
                    text: 'Reconectar',
                    onPress: () => {
                        conectaWsPlaca();
                    }
                }
            ])
            console.warn('fechado:', event.code) 
        };
    
        if (wss.current) {
            wss.current.close(); // Fecha a conexão ao desmontar o componente
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
                callBackGet()
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
    }, [])

    return (
        <TouchableOpacity 
            onPress={() => {verificaStatusConexao(`${dados.id}`, dados.is_open !== '0' ? '0' : '1', `${dados.name}`)}} 
            style={[style.botoes, {backgroundColor: dados.is_open !== '0' ? theme.colorsBackground.verde : theme.colorsBackground.vermelho, opacity: !isDisabled ? 1 : 0.5}]}
            disabled={isDisabled}
        >
            <Text style={style.textBtns}> {formataNome(dados.name)} </Text>
        </TouchableOpacity>
    );
};

const style = StyleSheet.create({
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