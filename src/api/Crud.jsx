import axios from 'axios';

const API_URL = 'https://smartparking-production-dee6.up.railway.app/parking/';

// Mapeo de tipos de usuario para conversión y registro a la base de datos
const USER_TYPE_MAP = {
    'Administrador': 3,
    'Empleado': 2,
    'Cliente': 1,
    3: 'Administrador',
    2: 'Empleado',
    1: 'Cliente'
};

//obtención de token, opcional
const getConfig = () => ({
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
    }
});

// Función para transformar datos antes de enviar
const transformUserData = (userData, toBackend = true) => {
    if (toBackend) {
        return {
            ...userData,
            tipo: typeof userData.tipo === 'string' ? USER_TYPE_MAP[userData.tipo] : userData.tipo
        };
    } else {
        return {
            ...userData,
            tipo: USER_TYPE_MAP[userData.tipo] || userData.tipo
        };
    }
};

export const getUsers = async () => {
    try {
        const response = await axios.get(API_URL, getConfig());
        return response.data.map(user => transformUserData(user, false));
    } catch (error) {
        console.error('Error al obtener usuarios:', error.response?.data || error.message);
        throw error;
    }
};

export const getUserById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}${id}`, getConfig());
        return transformUserData(response.data, false);
    } catch (error) {
        console.error('Error al obtener usuario:', error.response?.data || error.message);
        throw error;
    }
};

export const createUser = async (userData) => {
    try {
        const transformedData = transformUserData(userData);
        const response = await axios.post(API_URL, transformedData, getConfig());
        return transformUserData(response.data, false);
    } catch (error) {
        console.error('Error al crear usuario:', error.response?.data || error.message);
        throw error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const transformedData = transformUserData(userData);
        const response = await axios.patch(`${API_URL}${id}`, transformedData, getConfig());
        return transformUserData(response.data, false);
    } catch (error) {
        console.error('Error al actualizar usuario:', error.response?.data || error.message);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}${id}`, getConfig());
        return response.data;
    } catch (error) {
        console.error('Error al eliminar usuario:', error.response?.data || error.message);
        throw error;
    }
};