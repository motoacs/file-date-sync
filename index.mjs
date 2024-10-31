import fs from 'fs';
import path from 'path';

const args = Array.from(process.argv).slice(2);
const targetDir = args[args.indexOf('-t') + 1];
const referenceDir = args[args.indexOf('-r') + 1];
const testMode = args.includes('--test');

const shiftIndex = args.indexOf('--shift');
const shiftHours = shiftIndex !== -1 ? parseInt(args[shiftIndex + 1], 10) : 0;

function shiftTimestamp(timestamp, hours) {
  const date = new Date(timestamp);
  date.setHours(date.getHours() + hours);
  return date;
}

async function validateDirectories() {
  try {
    await fs.promises.access(targetDir);
    await fs.promises.access(referenceDir);
  } catch (error) {
    console.error('Error: One or both directories do not exist or are not accessible');
    process.exit(1);
  }
}

async function getFileStats(dir, files) {
  return Promise.all(files.map(async file => {
    const stats = await fs.promises.stat(path.join(dir, file));
    return { file, stats };
  }));
}

function logTimeChange(fileName, type, oldTime, newTime) {
  console.log(`${fileName} - ${type}:`);
  console.log(`  Before: ${oldTime.toLocaleString()}`);
  console.log(`  After:  ${newTime.toLocaleString()}`);
}

function updateFileTimestamp(filePath, btime, mtime, testMode) {
  return new Promise((resolve, reject) => {
    if (!testMode) {
      fs.utimes(filePath, btime, mtime, (err) => {
        if (err) reject(err);
        else resolve();
      });
    } else {
      resolve();
    }
  });
}

async function processFile(targetFile, targetStats, referenceStats) {
  const refFile = referenceStats.find(s => targetFile.includes(s.file.replace(/\.[^\.]+$/, '')));

  if (refFile) {
    const shiftedBtime = shiftTimestamp(refFile.stats.birthtime, shiftHours);
    const shiftedMtime = shiftTimestamp(refFile.stats.mtime, shiftHours);

    logTimeChange(targetFile, 'Birth Time', targetStats.birthtime, shiftedBtime);
    logTimeChange(targetFile, 'Modification Time', targetStats.mtime, shiftedMtime);

    await updateFileTimestamp(path.join(targetDir, targetFile), shiftedBtime, shiftedMtime, testMode);
  } else {
    console.error('Error: Reference file not found for', targetFile);
  }
}

async function main() {
  try {
    if (shiftHours < -24 || shiftHours > 24) {
      throw new Error('--shift value must be between -24 and 24');
    }

    await validateDirectories();

    const [targetFiles, referenceFiles] = await Promise.all([
      fs.promises.readdir(targetDir),
      fs.promises.readdir(referenceDir)
    ]);

    if (testMode) {
      console.info('[[[ TEST MODE ]]]');
      console.log('Target Directory:', targetDir);
      console.log('Reference Directory:', referenceDir);
      console.log('Shift Hours:', shiftHours);
    }

    const [targetStats, referenceStats] = await Promise.all([
      getFileStats(targetDir, targetFiles),
      getFileStats(referenceDir, referenceFiles)
    ]);

    for (const { file: targetFile, stats: targetFileStats } of targetStats) {
      await processFile(targetFile, targetFileStats, referenceStats);
    }

    console.log('Process completed successfully.');
  } catch (error) {
    console.error('An error occurred:', error.message);
    process.exit(1);
  }
}

main();