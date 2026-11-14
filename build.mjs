import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(root, 'site');
const data = JSON.parse(fs.readFileSync(path.join(root, 'content.json'), 'utf8'));
for (const key of ['name','email','bio','publications','manuscripts','education','experience','awards','skills']) {
  if (data[key] == null) throw new Error(`Missing content field: ${key}`);
}
const ctx = {};
vm.createContext(ctx);
const renderer = fs.readFileSync(path.join(root, 'src/render.js'), 'utf8');
vm.runInContext(renderer, ctx);
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, 'index.html'), ctx.SiteRender.home(data));
fs.writeFileSync(path.join(out, 'cv.html'), ctx.SiteRender.cv(data));
for (const file of ['style.css','editor.html','editor.js','editor.css','render.js','favicon.svg']) {
  fs.copyFileSync(path.join(root, 'src', file), path.join(out, file));
}
fs.writeFileSync(path.join(out, 'content-data.js'), 'window.SITE_CONTENT = ' + JSON.stringify(data, null, 2).replace(/</g,'\\u003c') + ';\n');
fs.copyFileSync(path.join(root, 'content.json'), path.join(out, 'content.json'));
fs.writeFileSync(path.join(out, '.nojekyll'), '');
if (fs.existsSync(path.join(root, 'assets'))) {
  fs.cpSync(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });
}
console.log('Built static website in ' + out);
