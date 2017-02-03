const desc = process.argv[2];
const date = new Date();
const fs = require('fs');

const newLine = toExcelTime(date) + ',' + desc + '\n';
fs.appendFile('time.csv', newLine, err=>console.log(err));

function toExcelTime(date){
  const day = 24 * 60 * 60 * 1000
  const unixTime = date.getTime() - (date.getTimezoneOffset() * 1000 * 60);
  const excelOffSet = 25569;
  const daysPast = Math.floor(unixTime / day);
  const hoursPast = (date.getHours() + (date.getMinutes() / 60)) / 24
  return daysPast + hoursPast + excelOffSet;
}
