const Files = require('../services/files');
const sslChecker = require("ssl-checker");

module.exports = {
    get: async (req, res) => {
        const response = new Response();
        try {
            if (!req.query || !req.query.domain) {
                const domains = await Files.processLineByLine(process.env.DOMAINS_FILE);
                const readmeIndex = domains.indexOf('README');
                if (readmeIndex > -1) {
                    domains.splice(readmeIndex, 1);
                }
                const promiseArr = domains.map(domain => sslChecker(domain));

                const check = await Promise.all(promiseArr);
                const domainChecked = check.map((data, index) => ({
                    ...data,
                    domain: domains[index]
                }));

                response.content = domainChecked;
            } else {
                const domainCertStatus = await sslChecker(req.query.domain);
                response.content = domainCertStatus;
            }

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