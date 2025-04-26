import axios from 'axios';

axios.defaults.baseURL =
    process.env.REACT_APP_API_URL ||
    'http://localhost:8080/api';

export default axios;