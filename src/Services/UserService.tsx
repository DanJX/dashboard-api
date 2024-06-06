import axios from "axios";

const getUsers = async () => {
    try{
        const response = await axios.get('https://localhost:7029/Usuarios');
        return response.data.result;
    }
    catch(e){
        console.error(e);
    }
}

const createUser = async (user: any) => {
    try {
        const response = await axios.post('https://localhost:7029/Usuarios', user);
        return response.data;
    } catch (e) {
        console.error(e);
    }
}

const deleteUser = async (id: number) => {
    try {
        const response = await axios.delete(`https://localhost:7029/Usuarios/${id}`);
        return response.data;
    } catch (e) {
        console.error(e);
    }
}

const updateUser = async (user: any) => {
    try {
        const response = await axios.put(`https://localhost:7029/Usuarios/${user.pkUsuario}`, user);
        return response.data;
    } catch (e) {
        console.error(e);
    }
}

export { getUsers, createUser, deleteUser, updateUser}