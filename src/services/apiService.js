import axios from 'axios';
//import { VITE_SERVER_DEV } from '../../../.env';

const apiService = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_DEV}`,
    //headers: {
        //'Content-Type': 'application/json',
    //},
});
  
export default apiService;