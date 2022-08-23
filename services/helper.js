function convertTimeStampToMySqlDate(timestamp) {
  const docdate = new Date(+timestamp);  
 // return `'${docdate.toISOString().slice(0, 10).replace("T", " ")}'`;
 return `'${docdate.getFullYear()}-${pad(docdate.getMonth() + 1)}-${docdate.getDate()}'`
}

module.exports = {
  convertTimeStampToMySqlDate
}

function pad(number) {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}
