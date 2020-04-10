const fs = require('fs');
const readline = require('readline');

const writeByLine = async (path, lines, flags) => {
    try {
        const stream = await fs.createWriteStream(path, { flags });
        stream.on('error', (err) => {
            console.log('Error in write stream...');
        });
        lines.forEach(l => stream.write(`${l}\n`));
        stream.end();
    } catch (e) {
        console.error(e);
        return 'Error while writing file';
    }

    return await processLineByLine(path);
}

const processLineByLine = async (path) => {
    let arr = [];

    try {
        const fileStream = await fs.createReadStream(path);

        fileStream.on('error', err => {
            console.log('Error in read stream...', err);
        });
        const rl = await readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            arr = [...arr, line];
        }
    } catch (e) {
        console.error(e);
        return 'Error while reading file';
    }

    return arr;
}

module.exports = { 
    writeByLine: writeByLine,
    processLineByLine: processLineByLine
}