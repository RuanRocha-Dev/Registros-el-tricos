import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import { createRegistro } from '../service/Api';


// Configura o comportamento das notificações
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export async function sendPushNotification(expoPushToken, nomeRegistro, acao) {
    const message = {
        to: expoPushToken,
        sound: 'sound',
        title: 'Agendamento concluído',
        body: `Registro ${nomeRegistro} ${acao} com sucesso`,
        data: { someData: 'goes here' },
    };

    try {
        const response = await fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        const result = await response.json();
        console.log('Notificação enviada com sucesso:', result);
    } catch (error) {
        console.error('Erro ao enviar notificação:', error);
    }
}

async function salvaTokenDb (token) {
    data = {
        token
    }

    try {
        const result = await createRegistro('/tokens', data);
    } catch (err) {
        Alert.alert("Erro", "Erro ao salvar token")
    }
}

// Função para tratar erros ao registrar as notificações
function handleRegistrationError(errorMessage) {
    alert(errorMessage);
    throw new Error(errorMessage);
}

// Função para registrar notificações push e obter o token
export async function registerForPushNotificationsAsync() {
    if (Platform.OS === 'android') {
        // Corrigir o caminho do som baseado na estrutura de pastas
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            sound: require('../../assets/sound.mp3'),  // Caminho correto
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        } else {
            return false;
        }

        if (finalStatus !== 'granted') {
            handleRegistrationError('Permissão não concedida para obter token push para notificação push!');
            return;
        }
        const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;

        if (!projectId) { 
            handleRegistrationError('ID do projeto não encontrado');
        }
        try {
            const pushTokenString = (
                await Notifications.getExpoPushTokenAsync({
                projectId,
                })
            ).data;
            salvaTokenDb(pushTokenString)
            return pushTokenString;
        } catch (e) {
            handleRegistrationError(`${e}`);
        }
    } else {
        handleRegistrationError('Must use physical device for push notifications');
    }
}
