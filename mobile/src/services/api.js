import axios from 'axios';

const api = axios.create({
    //http://IP:Porta utilizada no node
    baseURL: 'http://192.168.1.2:3333', 
});

export default api;