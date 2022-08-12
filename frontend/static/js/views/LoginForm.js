import View from "./View.js";
import * as helper from "../modules/helper.js";

export default class extends View {
  constructor() {
    super()    
    this.accessToken = ""
  }

  async createHtml() {
    this.createLoginForm()        
  }

  async createLoginForm() {  
    document.querySelector('#app').innerHTML = ` 
    <form id="form-elem" class="login-form">
    <div class="login-container">
      <section>
          <label for="login">Логин</label>
          <input class="login-input" id="login" name="login" type="text" autocomplete="login" required autofocus>
      </section>
      <section>
          <label for="current-password">Пароль</label>
          <input class="login-input" id="current-password" name="password" type="password" autocomplete="current-password" required>
          
          <div id="show-password">
            <input type="checkbox" id="show-password">
            <label for="show-password">Показать пароль</label>
          </div>
           
      </section>
      <button class="login-button" name="login-button" type="submit">Войти</button>
    </div>
  </form>  `

  

  document.querySelector('#show-password').addEventListener('click', (e) => {                
    document.querySelector("#current-password").type = e.target.checked ? "text" : "password";    
  });

  
  
  const btn = document.querySelector('.login-button');
  btn.addEventListener('click', async (e) => {
    e.preventDefault();
  
    const serverConfigResponse = await fetch('/static/config.json');
    const serverConfig =  await serverConfigResponse.json();      
  
    const response = await fetch(`http://${serverConfig.host}:${serverConfig.port}/api/auth/login`, {
      method: "POST",
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "login": document.querySelector('#login').value,
        "password": document.querySelector('#current-password').value,
      })
    });
    const result = await response.json();    
  
    if (result.accessToken) {
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("authorized", 1);   
      const payLoad = helper.parseJwt(result.accessToken);  
      localStorage.setItem("employeeId", payLoad.userId);

      let event = new Event("showTaskList", {bubbles: true}); // (2)
      document.dispatchEvent(event);       

      //document.querySelector("#tasks").click() 
        
    } else {
      alert("Неверный логин или пароль");
      localStorage.setItem("authorized", 0);
      localStorage.removeItem("accessToken");           
      localStorage.removeItem("employeeId");   
    }

  });
  
  }  

}

