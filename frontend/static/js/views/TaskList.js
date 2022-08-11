import View from "./View.js";
import fetchWithAuth from "../modules/fetchWithAuth.js";

export default class extends View {
  constructor() {
    super()   
    this.tasks = [];
    this.projectList = [];     
  }

  async createHtml() {
    super.addNavigate();
    await this.getTaskList();   
    this.tasks.forEach(element => this.createProjectList(element));
    this.projectList.forEach(project => {      
      project.employeeList.sort((a, b) => a < b);
      project.employeeList.forEach(employee => {
        employee.taskList.sort((a, b) => sortTasks(a, b))
      })
    }); 
    this.createHtmlProjectList();
  }

  async getTaskList() {
    const response = await fetchWithAuth("/api/tasks", {
      method: "GET"
    });
    
    if (!response) { 
      return;
    };
  
    this.tasks = await response.json();
  }

  createHtmlProjectList() {
    const projectUl = document.createElement("ul");
    projectUl.classList.add("project-list");
    this.projectList.forEach((project, projectIndex) => {
      const projectLi = document.createElement("li");
      projectLi.classList.add("project-list__project")
      projectLi.textContent = project.projectName;  
      projectUl.appendChild(projectLi);

      const employeeUl = document.createElement("ul");
      employeeUl.classList.add("project-list__employee-list")
      projectLi.appendChild(employeeUl);
      this.projectList[projectIndex].employeeList.forEach((employee, employeeIndex) => {
        const employeeLi = document.createElement("li");
        employeeLi.classList.add("project-list__employee-list__employee")
        employeeLi.textContent = employee.employeeName;          
        employeeUl.appendChild(employeeLi);

        const taskUl = document.createElement("ul");
        taskUl.setAttribute("type", "1")
        taskUl.classList.add("project-list__task-list")
        employeeLi.appendChild(taskUl);
        this.projectList[projectIndex].employeeList[employeeIndex].taskList.forEach((task, taskIndex) => {
          const taskLi = document.createElement("li");
          taskLi.classList.add("project-list__task-list__task")
          taskLi.textContent = `${taskIndex + 1}. ${task.taskName}`;

          if (task.timestamp !== null) {
            const div = document.createElement("div");
            div.textContent = `дедлайн - ${task.realDeadline}`;            
            div.classList.add("task-list__deadline");
            if (task.timestamp < Date.now()) {
              div.classList.add("red");      
            }
            taskLi.appendChild(div);       
          }
                    
          taskUl.appendChild(taskLi);
        })          
      })

    
    })
    document.querySelector("#app").appendChild(projectUl);


  }

  async createTaskList() {  
  
    this.tasks.sort((a,b) => sortTasks(a, b))
    
    const tbl = document.createElement("table");  
    const tblBody = document.createElement("tbody"); 
    
    const row = document.createElement("tr");
  
    const cell = document.createElement("th");
    const cellText = document.createTextNode("Задача");
    cell.appendChild(cellText);
    row.appendChild(cell);  
  
    tblBody.appendChild(row);
  
    this.tasks.forEach((element, index, array) => {
      
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

  createProjectList(element) {  
    let projectIndex = this.projectList.findIndex(elem => {
      return elem.projectName === element.projectName;
    });
    if (projectIndex === -1) {
      projectIndex = this.projectList.push({projectName: element.projectName}) - 1;
      this.projectList[projectIndex].employeeList = [];
    };
  
    let employeeIndex = this.projectList[projectIndex].employeeList.findIndex(elem => {
      return elem.employeeName === element.employeeName;
    });
    if (employeeIndex === -1) {
      employeeIndex = this.projectList[projectIndex].employeeList.push({employeeName: element.employeeName}) - 1;
      this.projectList[projectIndex].employeeList[employeeIndex].taskList = [];
    }
    
    let taskIndex = this.projectList[projectIndex].employeeList[employeeIndex].taskList.findIndex(elem => {
      return elem.taskId === element.taskId;
    });
    if (taskIndex === -1) {
      taskIndex = this.projectList[projectIndex].employeeList[employeeIndex].taskList.push({
        taskName: element.taskName,
        taskId: element.taskId,
        timestamp: element.timestamp,
        realDeadline: element.realDeadline,
        statusName: element.statusName
      }) - 1;
    }
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



