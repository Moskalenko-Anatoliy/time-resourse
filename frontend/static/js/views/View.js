export default class {
  constructor() {

  }

  async createHtml() {  
    this.addNavigate()  
  }

  addNavigate() {
    document.querySelector("#app").innerHTML = `
      <nav class="main-menu hide"">      
        <a href="/login" id="login-menu" data-link class="hide">Войти</a>              
        <a href="/logout" id="logout-menu">Выйти</a>                      
        <a href="/tasks" id="tasks" data-link>Мои задачи</a>      
      </nav>    `    
      
    if (localStorage.getItem('authorized') == 0) {
      document.querySelector("#logout-menu").classList.add('hide')
      document.querySelector("#login-menu").click()
    } else {
      document.querySelector(".main-menu").classList.remove("hide")      
    }
}
  
}