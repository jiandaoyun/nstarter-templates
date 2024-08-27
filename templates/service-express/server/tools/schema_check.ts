import fs from 'fs';
import { glob } from 'glob';
import { createHash } from 'crypto';
import * as TJS from 'typescript-json-schema';

const config = {
    entityDir: './src/entities',
    schemaFile: './resources/entities.schema.json'
};

const globMatch = `${ config.entityDir }/**/*.ts`;
const hashFile = `${ config.schemaFile }.sha1sum`;

const searchEntityFiles = async () => {
    return await glob(globMatch, {
        cwd: './',
        root: './',
        mark: true,
        dot: true,
        ignore: []
    });
}

/**
 * 生成文件内容 hash
 * @param files
 */
const generateHash = async (files: string[]) => {
    const shasum = createHash('sha1');
    for (const file of files) {
        const content = fs.readFileSync(file, 'utf-8');
        shasum.update(content);
    }
    return shasum.digest('hex');
};

const buildSchema = async () => {
    await TJS.exec(globMatch, '*', {
        ...TJS.getDefaultArgs(),
        required: true,
        excludePrivate: true,
        ignoreErrors: true,
        noExtraProps: true,
        out: config.schemaFile
    });
};

const runSchemaCheck = async () => {
    const files = await searchEntityFiles();
    let oriHash = '';
    try {
        oriHash = fs.readFileSync(hashFile, 'utf-8');
    } catch (err) {}

    const hash = await generateHash(files);
    if (oriHash === hash) {
        // 无内容变更
        return;
    } else {
        console.log(`Entity files have been modified, re-generate json-schema files...`);
        await buildSchema();
        fs.writeFileSync(hashFile, hash, 'utf-8');
    }
};

if (require.main === module) {
    runSchemaCheck().then();
}
