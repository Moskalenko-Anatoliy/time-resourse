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

// function showError(field, errorMessage) {
// 	const errorSpan = document.createElement("span");
// 	const errorMessage = document.createTextNode(errorMessage);

// 	errorSpan.appendChild(errorMessage);
// 	errorSpan.className = "errorMsg";

// 	var fieldLabel = document.getElementById(field).previousSibling;
// 	while (fieldLabel.nodeName.toLowerCase() != "label") {
// 		fieldLabel = fieldLabel.previousSibling;
// 	}
// 	fieldLabel.appendChild(errorSpan);
// }

export { parseJwt, getTimeStringFromSeconds};