const fs = require('fs');
const Stream = require('stream');
const args = require('minimist')(process.argv.slice(2));
const readFilePath = args['path'];
const readStream = fs.createReadStream(readFilePath);
const writeFilePath = './parsedData.txt';
const writeStream = fs.createWriteStream(writeFilePath);

// stream.on is an even listener, specifying that whenever data is read, it will invoke the callback
const createFile = writeFilePath => {
  fs.writeFile(writeFilePath, '', error => {
    if (error) {
      throw error;
    }
    console.log(`Saved file ${writeFilePath}`);
  });
  return true;
}

const readToFile = (readStream, writeStream) => {
  readStream.on('data', data => {
    let chunk = data.toString();
    let chunks = parseLines(chunk);
    chunks.forEach(c => {
      writeStream.write(c);
    });
  });
}

const parseLines = text => {
  text = text.split('\n');
  text.forEach((l, index, arr) => {
    arr[index] = `\n${index}${l}`;
  });
  return text;
}

async function parseFile (readStream, writeStream, writeFilePath) {
  await createFile(writeFilePath);
  readToFile(readStream, writeStream);
}

parseFile(readStream, writeStream, writeFilePath);
