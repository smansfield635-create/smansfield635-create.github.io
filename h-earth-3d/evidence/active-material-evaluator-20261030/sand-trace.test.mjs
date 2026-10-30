import test from 'node:test';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';
const here=path.dirname(fileURLToPath(import.meta.url));
test('sand segment clipping, continuous bound and contact gate regressions',()=>{
 execFileSync('python3',['-m','unittest','-v','test_sand_trace.py'],{cwd:here,stdio:['ignore','pipe','pipe']});
});
