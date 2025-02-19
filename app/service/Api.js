//meu ip: 192.168.15.3
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://backend-registros-production.up.railway.app',
});

// Função para fazer requisição GET
export default getRegistros = async (endpoint) => {
    try {
        const response = await api.get(endpoint);
        console.warn(response.data)
        return response.data;
    } catch (error) {
        console.error('Erro ao fazer GET', error);
        throw error;
    }
};

// Função para fazer requisição PUT
export const updateRegistro = async (endpoint, data) => {
    try {
        const response = await api.put(endpoint, data, {
            headers: {
                "Content-Type": "application/json",
                "Connection": "close"
            },
            timeout: 10000 
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao fazer PUT', error);
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
