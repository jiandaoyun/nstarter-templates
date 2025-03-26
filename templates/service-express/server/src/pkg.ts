import fs from 'fs';
import path from 'path';

const loadPkg = (pkgPath: string) => {
    return JSON.parse(
        fs.readFileSync(pkgPath, 'utf-8')
    );
};

const pkgPath = path.join(__dirname, '../../package.json');
export const pkg = loadPkg(pkgPath);

