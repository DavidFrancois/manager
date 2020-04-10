import * as axios from 'axios';

const apiUrl = 'http://test.diac.diji.fr:8080/manager/';

const http = {
    getKeys: async () => {
        console.log(`apiUrl = ${apiUrl}`);
        console.log(`API_URL = ${process.env.API_URL}`)
        let response;
        try {
            response = await axios.get(`${apiUrl}keys`);
        } catch (error) {
            console.error(error);
        } 
        return response;
    },

    saveKeys: async body => {
        let response;
        try {
            response = await axios.post(`${apiUrl}keys`, body)
        } catch (error) {
            console.error(error);
        }
        return response;
    },

    getDBSaves: async () => {
        let response;
        try {
            response = await axios.get(`${apiUrl}dbsaves`)
        } catch (error) {
            console.error(error);
        }
        return response;
    },

    removeDBSaves: async nbLines => {
        let response;
        try {
            response = await axios.put(`${apiUrl}dbsaves`, { nbLines })
        } catch (error) {
            console.error(error);
        }
        return response;
    },

    getCertsStatuses: async () => {
        let response;
        try {
            response = await axios.get(`${apiUrl}ssl`);
        } catch (error) {
            console.error(error);
        }
        return response;
    },

    getDomainStatus: async query => {
        let response;
        try {
            response = await axios.get(`${apiUrl}ssl?domain=${query}`);
        } catch (error) {
            console.error(error);
        }
        return response;
    }
}

export default http;