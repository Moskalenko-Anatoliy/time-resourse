import View from "./View.js"
import fetchWithAuth from "../modules/fetchWithAuth.js"

export default class extends View {
  constructor() {
    super()    
  }

  async createHtml() {
    super.addNavigate();
    await createTaskList();
  }
}

function sortTasks(a, b) {
  if (a.projectName < b.projectName) {
    return -1
  }  

  if (a.projectName > b.projectName) {
    return 1
  }    
  
  if (a.timestamp !== null) {

    if (b.timestamp !== null) {        
      if (a.timestamp < b.timestamp) {
        return -1
      } else {
        return 1
      }      
    }            

    return -1      
  }

  if (a.taskName < b.taskName) {
    return -1
  }

  if (a.taskName > b.taskName) {
    return 1
  }

  return 0  
}

async function createTaskList() {  

  const response = await fetchWithAuth("/api/tasks", {
    method: "GET"
  });
  
  if (!response) { 
    return;
  };

  const tasks = await response.json();

  tasks.sort((a, b) => {

    if (a.projectName < b.projectName) {
      return -1
    }  

    if (a.projectName > b.projectName) {
      return 1
    }    
    
    if (a.timestamp !== null) {

      if (b.timestamp !== null) {        
        if (a.timestamp < b.timestamp) {
          return -1
        } else {
          return 1
        }      
      }            

      return -1      
    }

    if (a.taskName < b.taskName) {
      return -1
    }

    if (a.taskName > b.taskName) {
      return 1
    }

    return 0
  })
  
  const tbl = document.createElement("table");  
  const tblBody = document.createElement("tbody"); 
  
  const row = document.createElement("tr");

  const cell = document.createElement("th");
  const cellText = document.createTextNode("Задача");
  cell.appendChild(cellText);
  row.appendChild(cell);  

  tblBody.appendChild(row);

  tasks.forEach((element, index, array) => {
    
    let row;
    let cell;
    let cellText;
    let span;
    let spanText;
    let div;

    if (index === 0 || element.projectName !== array[index - 1].projectName) {
      row = document.createElement("tr");  
      cell = document.createElement("td");
      cell.setAttribute('colspan', '3');
      cellText = document.createTextNode(element.projectName);
      cell.classList.add('task-list__project')
      cell.appendChild(cellText);
      row.appendChild(cell);   
      tblBody.appendChild(row);      
    }
    
    row = document.createElement("tr"); 
    row.classList.add('task-list__task')
        
    cell = document.createElement("td");  

    if (element.timestamp !== null) {
      span = document.createElement("div");
      spanText = document.createTextNode(element.realDeadline);
      span.appendChild(spanText);
      span.classList.add("task-list__deadline");
      if (element.timestamp < Date.now()) {
        span.classList.add("red");      
      }
      cell.appendChild(span);       
    }

    cellText = document.createTextNode(element.taskName);
    cell.appendChild(cellText);
    
    div = document.createElement('div');
    div.classList.add('hide', 'button-wrapper');    
    const btn = document.createElement('button');
    btn.classList.add('custom-btn', 'task-list__btn');
    cellText = document.createTextNode('Открыть');
    btn.appendChild(cellText);
    div.appendChild(btn);
    cell.appendChild(div); 

    row.appendChild(cell); 
    


    tblBody.appendChild(row);
  })

  tbl.appendChild(tblBody);
  
  document.querySelector("#app").appendChild(tbl);

  tbl.classList.add("task-list");
}