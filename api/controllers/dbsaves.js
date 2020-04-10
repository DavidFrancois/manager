const Files = require('../services/files');

const writeLastLines = async (path, nbLines) => {
    const dbsavesLogs = await Files.processLineByLine(path);
    return await Files.writeByLine(path, dbsavesLogs.splice(dbsavesLogs.length - nbLines, nbLines));
}

module.exports = {
    get: async (req, res) => {
        const response = new Response();
        try {
            response.content = await Files.processLineByLine(process.env.DB_LOGS_FILE);
        } catch (e) {
            console.error(e);
            response.code = 500;
        } finally {
            res.status(response.code).send(response.content);
        }
    },

    put: async (req, res) => {
        const response = new Response();

        try {
            response.content = await writeLastLines(process.env.DB_LOGS_FILE, req.body.nbLines);
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