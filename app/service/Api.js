//meu ip: 192.168.15.3
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://srv737240.hstgr.cloud', // ip da VPS conexão com a API
    // baseURL: 'http://192.168.15.33:3000', // ip da VPS conexão com a API
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
export const updateRegistro = async (endpoint, data, timeout = 10000) => {
    try {
        const response = await api.put(endpoint, data, { timeout });
        return {'status': 1, 'conteudo': response.data};
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            console.error('Erro: Timeout atingido');
            return { 'status': 0, 'conteudo': 'Servidor não respondeu' };
        }
        throw error;
    }
};

// Função para fazer requisição PUT
export const createRegistro = async (endpoint, data) => {
    try {
        const response = await api.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.error('Erro ao fazer POST', error);
        throw error;
    }
};

// Função para fazer requisição PUT
export const createRegistroEsp = async (endpoint, data) => {
    try {
        const response = await api.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.error('Erro ao fazer POST', error);
        throw error;
    }
};
