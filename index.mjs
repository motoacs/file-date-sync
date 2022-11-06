import fs from 'fs/promises';
import path from 'path';
import { utimes } from 'utimes';

// コマンドライン引数の取得
const args = Array.from(process.argv).slice(2);
const targetDir = args[args.indexOf('-t') + 1];
const referenceDir = args[args.indexOf('-r') + 1];
const testMode = args.includes('--test');

async function main() {
  const targetFiles = await fs.readdir(targetDir);
  const referenceFiles = await fs.readdir(referenceDir);
  if (testMode) {
    console.info('[[[ TEST MODE ]]]');
    console.log('target:', targetFiles);
    console.log('reference:', referenceFiles);
  }

  targetFiles.forEach(async (name) => {
    // 完全一致
    if (referenceFiles.includes(name)) {
      const refStat = await fs.stat(path.join(referenceDir, name));
      const tarStat = await fs.stat(path.join(targetDir, name));

      console.log(
        name,
        ' btime:',
        new Date(tarStat.birthtime).toLocaleString(),
        '=>',
        new Date(refStat.birthtime).toLocaleString(),
        ' mtime:',
        new Date(tarStat.mtime).toLocaleString(),
        '=>',
        new Date(refStat.mtime).toLocaleString(),
      );

      if (!testMode) {
        await utimes(path.join(targetDir, name), {
          btime: new Date(refStat.birthtime).getTime(),
          mtime: new Date(refStat.mtime).getTime(),
        });
      }
    }
    // 部分一致  before:DJI_0001.mp4 after:DJI_0001_001.mp4などでもマッチ
    else  {
      const refFileName = referenceFiles.find((refFileName) => name.includes(refFileName.replace(/\.[^\.]+$/, '')));
      if (refFileName != null) {
        const refStat = await fs.stat(path.join(referenceDir, refFileName));
        const tarStat = await fs.stat(path.join(targetDir, name));
        console.log(
          refFileName,
          '=>',
          name,
          ' btime:',
          new Date(tarStat.birthtime).toLocaleString(),
          '=>',
          new Date(refStat.birthtime).toLocaleString(),
          ' mtime:',
          new Date(tarStat.mtime).toLocaleString(),
          '=>',
          new Date(refStat.mtime).toLocaleString(),
        );

        if (!testMode) {
          await utimes(path.join(targetDir, name), {
            btime: new Date(refStat.birthtime).getTime(),
            mtime: new Date(refStat.mtime).getTime(),
          });
        }
      }
      else console.error('error: not found: ', name);
    }

  });
}


main();
