const Files = require('../services/files');

const checkMinLength = length =>  length >= (process.MIN_AUTH_KEY_NUMBER || 2);

module.exports = {

    get: async (req, res) => {
        const response = new Response();

        try {
            response.content = await Files.processLineByLine(process.env.KEYS_FILE);
        } catch (e) {
            console.error(e);
            response.code = 500;
        } finally {
            res.status(response.code).send(response.content);
        }
    },

    post: async (req, res) => {
        const response = new Response();
        
        if (!checkMinLength(req.body.keys.length)) {
            res.status(400).send( `Bad request: minimum size is ${process.env.MIN_AUTH_KEY_NUMBER || 2}`);
            return;
        }

        try {
            response.content = await Files.writeByLine(process.env.KEYS_FILE, req.body.keys, 'w');
            console.log(`Wrote file`, response.content)
        } catch (e) {
            console.error(e);
            response.code = 500;
        } finally {
            res.status(response.code).send(response.content);
        }
    }
}

class Response {
    constructor() {
        this.code = 200;
        this.content = null;
        this.error = null;
    }
}