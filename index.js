import fs from 'fs'

import clipboardy from 'clipboardy'
import Gyazo from 'gyazo-api'
import ini from 'ini'


const config = ini.parse(fs.readFileSync('./settings.ini', 'utf8'));

const client = new Gyazo(config.gyazo.TOKEN);

const listener = async (type, file) => {
    if (type === 'change') {
        if (/\d{4}-\d{2}-\d{2}_\d{2}\.\d{2}\.\d{2}\.png/.test(file)) {
            const fileName = file.split('\\').pop();

            if (fs.readFileSync(`${config.general.ROOT || `${process.env.APPDATA}/.minecraft`}/${file}`).length > 1000) {
                const result = await client.upload(`${config.general.ROOT || `${process.env.APPDATA}/.minecraft`}/${file}`, {
                    title: fileName,
                    desc: 'uploaded with gyazo-for-minecraft',
                });
                clipboardy.writeSync(result.data.url);
                console.log('uploaded', result.data.permalink_url, result.data.url);
            }
        }
    }
};

const main = async (argc, argv) => {
    const watcher = fs.watch(config.general.ROOT || `${process.env.APPDATA}/.minecraft`, {
        recursive: config.general.RECURSIVE,
        encoding: config.general.ENCODING,
    }, listener);

    console.log('Running');
};

main(process.argv.length, process.argv);
