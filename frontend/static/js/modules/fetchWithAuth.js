import * as helper from "./helper.js"

export default async function fetchWithAuth(urlApi, options) {
  try {
    const serverConfigResponse = await fetch('/static/config.json');
    const serverConfig =  await serverConfigResponse.json();  
    
    const url = `http://${serverConfig.host}:${serverConfig.port}${urlApi}`  
        
    let accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      document.querySelector("#login-menu").click();
      return;
    } 
  
    const payLoad = helper.parseJwt(accessToken);
    if (Date.now() >= (payLoad.exp * 1000)) {
      const refreshUrl =  `http://${serverConfig.host}:${serverConfig.port}/api/auth/token`;
      const response = await fetch(refreshUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },      
      });
      const result = await response.json();
      if (response.status === 200) {
        accessToken = result.accessToken;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("authorized", 1);               
          
      } else {
        localStorage.setItem("authorized", 0);
        localStorage.removeItem("accessToken");  
        document.querySelector("#login-menu").click();
        return;        

      }        
    }
  
    if (!options.headers) { // если в запросе отсутствует headers, то задаем их
      options.headers = {};
    }  
    options.headers.Authorization = `Bearer ${accessToken}`; 
      
    return fetch(url, options); // возвращаем изначальную функцию, но уже с валидным токеном в headers
  } catch(e) {
    console.log(e)
  }

}