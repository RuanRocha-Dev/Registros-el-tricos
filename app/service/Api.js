//meu ip: 192.168.15.3
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.15.3:3000',
});

// Função para fazer requisição GET
export default getRegistros = async (endpoint) => {
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.error('Erro ao fazer GET', error);
        throw error;
    }
};

// Função para fazer requisição PUT
export const updateRegistro = async (endpoint, data) => {
    try {
        const response = await api.put(endpoint, data);
        return response.data;
    } catch (error) {
        console.error('Erro ao fazer PUT', error);
        throw error;
    }
};
