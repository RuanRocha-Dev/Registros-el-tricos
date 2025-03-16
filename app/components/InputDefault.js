import React, { useState, useEffect, useCallback } from 'react';
import { TextInput, StyleSheet } from 'react-native';

import { formatarDatatempoReal, formatarHora } from '../utils/funcoesGlobais';


export default (props) => {
    const [data, setData] = useState(0);
    const [hora, setHora] = useState(0);

    const chamaCallBack = useCallback((name) => {
        if(props.place === 'Apenas data') {
            setData(formatarDatatempoReal(name));
        } else {
            setHora(formatarHora(name));
        }
    });

    useEffect(() => {
        if(props.funcCallBackHora !== undefined) {
            props.funcCallBackHora(hora);
        } else if(props.funcCallBackData!== undefined ) {
            props.funcCallBackData(data);
        }
    }, [data, hora])

    return (
        <TextInput style={style.inputDefault} keyboardType='numeric' placeholder={props.place} value={props.place === 'Apenas data' ? data : hora} onChangeText={name => chamaCallBack(name)}/>  
    );
};

const style = StyleSheet.create({
    inputDefault: {
        width: '100%',
        height: '150px',
        borderColor: '#ccc',
        borderWidth: 1,     
        borderRadius: 15,   
        fontSize: 20,       
        backgroundColor: '#fff',
        textAlign: 'center'
    }
})

// O que é o "returnKeyType" de um compoente "textInput" em React native?