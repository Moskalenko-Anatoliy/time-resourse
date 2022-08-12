import View from "./View.js";
import fetchWithAuth from "../modules/fetchWithAuth.js";

export default class extends View {
  constructor() {
    super()   
    this.tasks = [];
    this.projectList = [];
    this.employeeId = 0;     
  }

  async createHtml() {
    super.addNavigate();
    await this.getTaskList();   
    this.createHtmlFilter();
    this.tasks.forEach(element => this.createProjectList(element));
    this.projectList.forEach(project => {      
      project.employeeList.sort((a, b) => a < b);
      project.employeeList.forEach(employee => {
        employee.taskList.sort((a, b) => sortTasks(a, b))
      })
    }); 
    this.createHtmlProjectList();
    document.querySelector("#filter-mytask").click();
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

  createHtmlFilter() {
    const myCheckBox = document.createElement("input");
    myCheckBox.setAttribute("name", "filter-mytask");
    myCheckBox.setAttribute("type", "checkbox");    
    myCheckBox.setAttribute("id", "filter-mytask");        
    myCheckBox.classList.add("checkbox");
    
    const label = document.createElement("label");
    label.setAttribute("for", "filter-mytask")
    label.textContent = "Мои"

    const wrapper = document.createElement("div");
    wrapper.classList.add("checkbox-wrapper");    
    wrapper.appendChild(myCheckBox);
    wrapper.appendChild(label);    
    document.querySelector("#app").appendChild(wrapper);  
    
    myCheckBox.addEventListener("click", (event) => {      
      const employeeList = document.querySelectorAll("[data-my-task = '0']")
      employeeList.forEach((e) => {        
        if (event.target.checked) {
            e.classList.add("hide");
        } else {
          e.classList.remove("hide");
        }
      })
    })
  };

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
        employeeLi.setAttribute("data-my-task", localStorage.getItem("employeeId") == employee.employeeId ? "1" : "0");
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
            const divTime = document.createElement("div");
            divTime.textContent = `дедлайн - ${task.realDeadline}`;            
            divTime.classList.add("task-list__deadline");
            if (task.timestamp < Date.now()) {
              divTime.classList.add("red");      
            }
            taskLi.appendChild(divTime);       
          }

          const divBtn = document.createElement("div");
          divBtn.classList.add("hide", "button-wrapper");    
          const btn = document.createElement("button");
          btn.classList.add("custom-btn", "task-list__btn");
          btn.textContent = "Открыть";
          divBtn.appendChild(btn);
          taskLi.appendChild(divBtn);                     
                    
          taskUl.appendChild(taskLi);
        })          
      })

    
    })
    document.querySelector("#app").appendChild(projectUl);


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
      employeeIndex = this.projectList[projectIndex].employeeList.push({
        employeeName: element.employeeName,
        employeeId: element.employeeId
      }) - 1;
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



