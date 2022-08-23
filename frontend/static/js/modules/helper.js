function parseJwt(token) {
  return JSON.parse( atob( token.split('.')[1] ) );
};

// конвертация кол-ва секунд в строку формата hh:mm
function getTimeStringFromSeconds(seconds) {

  const hours =  Math.trunc(seconds / 3600);
  const minutes = Math.trunc( (seconds - hours *3600) / 60 );
  return `${hours !== 0 ? hours + " час " : ""}  ${minutes} мин`
} 

function pad(number) {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}

export { parseJwt, getTimeStringFromSeconds};