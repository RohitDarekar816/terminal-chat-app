const axios = require('axios');

module.exports = async (username) => {
    try {
        const response = await axios.get(`http://192.168.0.101:3001/auth/tokens/${username}`);
        const token = response.data
        return token;
    } catch(error) {
        console.error(error.response.data); 
    }
    
}