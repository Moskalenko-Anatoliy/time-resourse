import Nav from "./views/View.js"
import TaskList from "./views/TaskList.js"
import LoginForm from "./views/LoginForm.js"


const navigateTo = url => {
  history.pushState(null, null, url)
  router()
}

const router = async () => {  

  const routes = [
    { path: /\/$/,  view: Nav},
    { path: /\/tasks$/,  view: TaskList},
    { path: /\/login$/,  view: LoginForm},
  ]

  //Test each route for potential match
  const potentialMatches = routes.map( route => {    
    return {
      route,
      isMatched: location.pathname.match(route.path) !== null
    }
  })      

  let match = potentialMatches.find(potentialMatche => potentialMatche.isMatched)  
  
  if (!match) {
    match = routes[0];
  }  
  const view = new match.route.view()  

  await view.createHtml()    
}

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", e => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault()
      navigateTo(e.target.href)
    }                 

    if (e.target.id === "logout-menu") {     
      e.preventDefault() 
      localStorage.removeItem("accessToken");
      localStorage.setItem("authorized", 0);           
      navigateTo("/") 
    }    
       
  });  
  
  router();
 

})

window.addEventListener('popstate', router)

document.addEventListener("showTaskList", (e) => {
  navigateTo("/tasks")
});

document.addEventListener("showLoginForm", (e) => {
  navigateTo("/login")
});

