const desc = process.argv[2];
const project = process.argv[3] | 'none';
const date = new Date();
const fs = require('fs');
const inherits = require('util').inherits;
const Transform = require('stream').Transform;
const PassThrough = require('stream').PassThrough;

//TODO check for commas

class TimeElapsed extends Transform{
  constructor(options){
    super(options);
  }
}
TimeElapsed.prototype._transform = function (chunk, enc, cb){
  const allLines = chunk.toString().split('\n').map(x => {
    return x + ',45';
  })
  cb(null, allLines.join('\n'));
}

const newLine = toExcelTime(date) + ',,' + desc + ',' + project + '\n';
fs.appendFile('time.csv', newLine, err=>console.log(err));

// const read = fs.createReadStream('time.csv');
// const write = fs.createWriteStream('time2.csv');
// read.pipe(new TimeElapsed()).pipe(write);

function toExcelTime(date){
  const day = 24 * 60 * 60 * 1000
  const unixTime = date.getTime() - (date.getTimezoneOffset() * 1000 * 60);
  const excelOffSet = 25569;
  const daysPast = Math.floor(unixTime / day);
  const hoursPast = (date.getHours() + (date.getMinutes() / 60)) / 24
  return daysPast + hoursPast + excelOffSet;
}
