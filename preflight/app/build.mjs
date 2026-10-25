import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
const source=fs.readFileSync(path.join(root,'dist/index.html'),'utf8');
const html=source.replace('href="/style.css"','href="./dist/style.css"').replace('src="/app.mjs"','src="./dist/app.mjs"').replace('href="/"','href="./"').replace('<title>','<meta name="robots" content="noindex,nofollow,noarchive"><title>');
if(process.argv.includes('--check')){
 if(fs.readFileSync(path.join(root,'index.html'),'utf8')!==html)throw Error('Generated entry is stale. Run npm run build.');
 console.log('Generated subpath entry verified.');
}else fs.writeFileSync(path.join(root,'index.html'),html);
