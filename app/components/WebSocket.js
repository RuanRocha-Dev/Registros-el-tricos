import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';

import { formataNome } from '../utils/funcoesGlobais';
import { theme } from '../service/Theme';
import { createRegistro, createRegistroEsp, updateRegistro } from '../service/Api';


export default ({ dados, callBackGet }) => {
    const btnLigado = require('../../assets/img/Red_Switch_On.png')
    const btnDesligado = require('../../assets/img/Red_Switch_Off.png')
    
    async function post (comando = null, id, ip_placa = null) {
        if(comando === null) {
            Alert.alert("Erro", "Erro ao receber comando, tente novamente.");
            return false;
        }
        
        if(ip_placa === null) {
            Alert.alert("Atenção", "Motor não cadastrado para essa ação!");
            return false;
        }

        data = {
            comando
        }

        try {
            const result = await createRegistroEsp(`/comand/enviar-comando/${ip_placa}`, data);
            if(result.resposta === 'stop') {
                put(comando, id)
            }
        } catch (err) {
            Alert.alert("Erro", "Erro ao enviar comando, tente novamente.");
        }
    }

    async function put (comando = null, id) {
        if(comando === null) {
            Alert.alert("Erro", "Erro ao inserir comando no banco de dados.");
        }

        data = {
            'is_open': String(comando)
        }

        try {
            const result = await updateRegistro(`/registros/${id}`, data);
            
            if(result.status == 1) {
                callBackGet();
            }
        } catch (err) {
            Alert.alert('Atenção', 'Erro ao atualizar os dados');
        }
    }

    return (
        <TouchableOpacity 
            onPress={() => {post(dados.is_open !== '0' ? 0 : 1, `${dados.id}`, dados.ip_placa)}} 
            style={[style.botoes, {backgroundColor: dados.is_open !== '0' ? theme.colorsBackground.verde : theme.colorsBackground.vermelho, opacity: dados.ip_placa !== null ? '' : 0.2}]}
        >
            <Image source={dados.is_open !== '0' ? btnLigado : btnDesligado} style={style.imagens} />
            <Text style={style.textBtns}> {formataNome(dados.name)} </Text>
        </TouchableOpacity>
    );
};

const style = StyleSheet.create({
    botoes: {
        width: '100%',
        height: 65,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderRadius: 15,
        boxShadow: '6 4 5 0 rgba(0,0,0,0.21)'
    },
    
    textBtns: {
        textTransform: 'uppercase',
        fontSize: 24,
        color: '#fff',
    },

    imagens: {
        width: 60,
        height: 60
    }
})