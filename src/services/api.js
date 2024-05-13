import axios from 'axios';
import { config } from '../utils/config/confij';

export default axios.create({
    baseURL: config.apiUrl
});