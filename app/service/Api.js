//meu ip: 192.168.15.3
import axios from 'axios';

const api = axios.create({
    // baseURL: 'https://backend-registros-production.up.railway.app',
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
