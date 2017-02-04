const desc = process.argv[2];
const project = (process.argv[3] === undefined) ? '' : process.argv[3];
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
    const line = x.split(',');
    if(line.length < 3) return '';
    if((!line[1] || line[1] === 0) && line[2] !== desc){
      line[1] = (toExcelTime(date) - line[0]);
    }
    return line.join(',');
  })
  cb(null, allLines.join('\n'));
}

const newLine = toExcelTime(date) + ',,' + desc + ',' + project + '\n';
const read = fs.createReadStream('time.csv');
const write = fs.createWriteStream('time2.csv');
read.pipe(new TimeElapsed()).pipe(write);
read.on('end', ()=>{
  write.end(newLine);
  const source = fs.createReadStream('time2.csv');
  const target = fs.createWriteStream('time.csv');
  source.pipe(target);
})
write.on('error', x => console.log(x));

function toExcelTime(date){
  const day = 24 * 60 * 60 * 1000
  const unixTime = date.getTime() - (date.getTimezoneOffset() * 1000 * 60);
  const excelOffSet = 25569;
  const daysPast = Math.floor(unixTime / day);
  const hoursPast = (date.getHours() + (date.getMinutes() / 60)) / 24
  return daysPast + hoursPast + excelOffSet;
}
