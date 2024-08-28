import _ from 'lodash';
import async from 'async';
import fs from 'fs';
import path from 'path';

import { Parser } from 'i18next-scanner';

const config = {
    debug: true,
    src: './src/',
    encoding: 'utf-8',
    concurrency: 10,
    functions: [
        'i18n.t'
    ],
    filePatterns: [
        '*.ts'
    ],
    output: './resources/i18n/server.pot'
};

const _extPattern = _.map(config.filePatterns, path.extname);

/**
 * @class I18nScanner
 */
class I18nScanner {
    private _i18nParser = new Parser({
        keySeparator: false
    });

    /**
     * 扫描文件内容
     * @param {String} content
     */
    public scanContent(content: string) {
        this._i18nParser.parseFuncFromString(content, {
            list: config.functions
        });
    }


    /**
     * 扫描文件
     * @param filePath
     * @static
     */
    public async scanFile(filePath: string) {
        const fileStats = fs.statSync(filePath);
        if (fileStats.isDirectory()) {
            // Directory
            return this.scanDir(filePath);
        } else if (fileStats.isFile()) {
            // file
            if (!_.includes(_extPattern, path.extname(filePath))) {
                return;
            }
            if (config.debug) {
                console.log(`[scan] ${ filePath }`);
            }
            const content = fs.readFileSync(filePath, config.encoding as BufferEncoding);
            return this.scanContent(content);
        } else {
            return;
        }
    }

    /**
     * 扫描目录
     * @param basePath
     */
    public async scanDir(basePath: string) {
        const files = fs.readdirSync(basePath);
        await async.eachLimit(files, config.concurrency, async (file) => {
            await this.scanFile(path.resolve(basePath, file));
        });
    }

    /**
     * @returns I18n key map
     */
    public getI18nKeys() {
        return _.get(this._i18nParser.get(), 'en.translation', {});
    }
}

/**
 * 执行扫描
 */
const runScanner = async () => {
    // fixme esm support
    const { i18nextToPot } = await import('i18next-conv');

    try {
        const scanner = new I18nScanner();
        await scanner.scanDir(config.src);
        // 组装
        const items = scanner.getI18nKeys();
        const sorted: Record<string, string> = {};
        _.forEach(_.keys(items).sort(), (key) => {
            sorted[key] = items[key];
        });
        const i18nTemplate = await i18nextToPot('en', JSON.stringify(sorted));
        fs.writeFileSync(config.output, i18nTemplate);
        return process.exit(0);
    } catch (err: any) {
        console.error(err.stack);
        return process.exit(1);
    }
}

if (require.main === module) {
    runScanner().then();
} else {
    module.exports = I18nScanner;
}
