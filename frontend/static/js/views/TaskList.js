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
    
    document.querySelector("#filter-mytask").checked = true;
    this.createFilter();
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

  createCheckBox(name, text, clickEvent) {
    const myCheckBox = document.createElement("input");
    myCheckBox.setAttribute("name", name);
    myCheckBox.setAttribute("type", "checkbox");    
    myCheckBox.setAttribute("id", name);        
    myCheckBox.classList.add("checkbox");
    
    const label = document.createElement("label");
    label.setAttribute("name", `${name}-label"`);
    label.setAttribute("for", name)
    label.textContent = text;
   
    const wrapper = document.querySelector(".checkbox-wrapper");
    wrapper.appendChild(myCheckBox);
    wrapper.appendChild(label);    
    
    myCheckBox.addEventListener("click", clickEvent.bind(this));
 
  }

  showAll() {
    const elemenstHtml = document.querySelectorAll(".project-list__project.hide, .project-list__employee-list__employee.hide, .project-list__employee-list__employee__name.hide, .project-list__task-list__task.hide");      
    elemenstHtml.forEach(e => {
      e.classList.remove("hide");
    })
  }

  hideProject() {
    let projectListHtml = document.querySelectorAll(".project-list__project");        
    projectListHtml.forEach(project => {
      const task = document.querySelector(`.project-list__employee-list__employee:not(.hide) .project-list__task-list__task[data-project="${project.dataset.id}"]:not(.hide)`);      
      if (!task) {  
        project.classList.add("hide");        
      }

      const employeeListHtml = document.querySelectorAll(`.project-list__project[data-id="${project.dataset.id}"]:not(.hide) .project-list__employee-list__employee:not(.hide)`);      
       employeeListHtml.forEach(employee => {
        const task = document.querySelector(`.project-list__project[data-id="${project.dataset.id}"]:not(.hide) .project-list__employee-list__employee[data-id="${employee.dataset.id}"]:not(.hide) .project-list__task-list__task:not(.hide)`);              
        if (!task) {  
          employee.classList.add("hide");        
        }      
      });
    })

    projectListHtml = document.querySelectorAll(`.project-list__project[data-detail="0"]`);        
    projectListHtml.forEach(project => {
      const taskList = document.querySelectorAll(`.project-list__employee-list__employee:not(.hide) .project-list__task-list__task[data-project="${project.dataset.id}"]:not(.hide)`);            
      if (taskList) {
        taskList.forEach(task => task.classList.add("hide"));
      }
      
      const employeeListHtml = document.querySelectorAll(`.project-list__project[data-id="${project.dataset.id}"]:not(.hide) .project-list__employee-list__employee:not(.hide)`);      
      if (employeeListHtml) {
        employeeListHtml.forEach(employee => employee.classList.add("hide"));
      }
    })    
};

  createFilter() {    
    this.showAll();

    const myTask = document.querySelector("#filter-mytask");
    this.createMyTaskFilter(myTask.checked);

    const periodFilter = document.querySelector("#filter-period");
    this.createTaskPeriodFilter(periodFilter.checked);    

    this.hideProject();
    
  }

  createMyTaskFilter(checked) {
    const employeeList = document.querySelectorAll(`[data-my-task = "0"]`)
    employeeList.forEach((e) => {        
      if (checked) {
          e.classList.add("hide");
      } else {
        e.classList.remove("hide");
      }})

      const employeeNames = document.querySelectorAll(".project-list__employee-list__employee__name")
      employeeNames.forEach((e) => {        
      if (checked) {
          e.classList.add("hide");
      } else {
        e.classList.remove("hide");
      }})     
  }

  createTaskPeriodFilter(checked) {         
    const taskList = document.querySelectorAll(`.project-list__task-list__task[data-statusname="Периодические"]`)
    taskList.forEach((e) => {        
    if (!checked) {      
        e.classList.add("hide");
    } else {
      e.classList.remove("hide");
    }})            
  }  

  createHtmlFilter() {
   
    const wrapper = document.createElement("div");
    wrapper.classList.add("checkbox-wrapper"); 
    document.querySelector("#app").appendChild(wrapper); 

    this.createCheckBox("filter-mytask", "Мои", this.createFilter);

    this.createCheckBox("filter-period", "Периодические",  this.createFilter);
                  
  };

  createHtmlProjectList() {
    const projectUl = document.createElement("ul");
    projectUl.classList.add("project-list");
    this.projectList.forEach((project, projectIndex) => {
      const projectLi = document.createElement("li");
      projectLi.classList.add("project-list__project")            
      projectLi.setAttribute("data-id", project.projectId);
      projectLi.setAttribute("data-detail", "1");          
      projectUl.appendChild(projectLi);

      const projectWrapper = document.createElement("div");
      projectWrapper.classList.add("project-wrapper");
      const listDetailBtn = document.createElement("button");
      listDetailBtn.classList.add("button-list");
      listDetailBtn.textContent = '-';
      listDetailBtn.setAttribute("data-projectId", project.projectId)
      projectWrapper.appendChild(listDetailBtn);
      listDetailBtn.addEventListener("click", detailProjectList.bind(this));

      const spanProjectName = document.createElement("span");
      spanProjectName.textContent =  project.projectName;
      projectWrapper.appendChild(spanProjectName);

      projectLi.appendChild(projectWrapper);

      const employeeUl = document.createElement("ul");      
      employeeUl.classList.add("project-list__employee-list")      
      projectLi.appendChild(employeeUl);
      this.projectList[projectIndex].employeeList.forEach((employee, employeeIndex) => {
        const employeeLi = document.createElement("li");                
        employeeLi.setAttribute("data-my-task", localStorage.getItem("employeeId") == employee.employeeId ? "1" : "0");
        employeeLi.classList.add("project-list__employee-list__employee")
        const employeeLiDiv = document.createElement("div");   
        employeeLiDiv.textContent = employee.employeeName; 
        employeeLiDiv.classList.add("project-list__employee-list__employee__name")
        employeeLi.setAttribute("data-id", employee.employeeId);
        employeeLi.appendChild(employeeLiDiv);         
        employeeUl.appendChild(employeeLi);

        const taskUl = document.createElement("ul");
        taskUl.setAttribute("type", "1")
        taskUl.classList.add("project-list__task-list")
        employeeLi.appendChild(taskUl);
        this.projectList[projectIndex].employeeList[employeeIndex].taskList.forEach((task, taskIndex) => {
          const taskLi = document.createElement("li");
          taskLi.classList.add("project-list__task-list__task")
          taskLi.textContent = `${task.taskName}`;
          taskLi.setAttribute("data-project", project.projectId);
          if (task.timestamp !== null) {
            const divTime = document.createElement("div");
            divTime.textContent = `дедлайн - ${task.realDeadline}`;            
            divTime.classList.add("task-list__deadline");
            if (task.timestamp < Date.now()) {
              divTime.classList.add("red");      
            }
            taskLi.appendChild(divTime);       
          }
                     
          taskLi.setAttribute("data-statusname", task.statusName);          

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
      projectIndex = this.projectList.push({
        projectName: element.projectName,
        projectId: element.projectId
      }) - 1;
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

function detailProjectList(e) {  
  const project = document.querySelector(`.project-list__project[data-id="${e.target.dataset.projectid}"`);
  if (e.target.textContent === "-") {
    project.dataset.detail = "0";
    e.target.textContent = "+";
  } else {
    project.dataset.detail = "1";
    e.target.textContent = "-";
  }

  this.createFilter();
}



