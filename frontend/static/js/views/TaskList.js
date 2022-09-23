import View from "./View.js";
import fetchWithAuth from "../modules/fetchWithAuth.js";
import TaskForm from "./TaskForm.js";
import TimeSheet from "./TimeSheet.js";

export default class extends View {
  constructor() {
    super()   
    this.tasks = [];
    this.projectList = [];
    this.employeeId = 0;     
  }

  async createHtml() {
    if ( !(await this.getTaskList()) ) {
      let event = new Event("showLoginForm", {bubbles: true});
      document.dispatchEvent(event);   
      return;
    }

    super.addNavigate();

    this.createTaskListButtons();
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
      return false;
    };          
  
    this.tasks = await response.json();
    return true;
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

  createSearchFilter(taskName) {
    if (!taskName) {
      return;
    }

    const taskList = document.querySelectorAll(`.project-list__task-list__task:not([data-name*="${taskName.toLowerCase()}"])`);
    taskList.forEach(task => task.classList.add("hide"));
  };

  createSearchInput() {
    const inputSearch = document.createElement("input");
    inputSearch.setAttribute("type", "search");
    inputSearch.setAttribute("id", "task-search");
    inputSearch.setAttribute("name", "task-search");
    inputSearch.setAttribute("placeholder", "Поиск по задачам..");

    inputSearch.addEventListener("input", e => {
      this.createFilter();

    })
    
    const wrapper = document.createElement("div");
    wrapper.classList.add("search-wrapper");    
    wrapper.appendChild(inputSearch); 

    document.querySelector("#app").appendChild(wrapper);         
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

    const shortlistFilter = document.querySelector("#filter-shortlist");
    this.createShortListFilter(shortlistFilter.checked); 
   
    const earlyShortlistFilter = document.querySelector("#filter-earlyshortlist");
    this.createEarlyShortListFilter(earlyShortlistFilter.checked); 

    const taskName = document.querySelector("#task-search").value;
    this.createSearchFilter(taskName);

    this.hideProject();
    
  }

  createMyTaskFilter(checked) {
    const employeeList = document.querySelectorAll(`[data-my-task = "0"]`)
    employeeList.forEach((e) => {        
      if (checked) {
          e.classList.add("hide");
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
    const taskList = document.querySelectorAll(`.project-list__task-list__task:not(.hide)[data-statusname="Периодические"]`)    
    taskList.forEach((e) => {        
      if (!checked) {      
          e.classList.add("hide");
      }
    })            
  }
  
  createShortListFilter(checked) {
    const taskList = document.querySelectorAll(`.project-list__task-list__task:not(.hide)[data-shortlist="0"]`)    
    taskList.forEach((e) => {        
      if (checked) {      
          e.classList.add("hide");
      }
    })     
  }

  createEarlyShortListFilter(checked) {
    const taskList = document.querySelectorAll(`.project-list__task-list__task:not(.hide)[data-earlyshortlist="0"]`)    
    taskList.forEach((e) => {        
      if (checked) {      
          e.classList.add("hide");
      }
    })     
  }

  createButton(name, caption, clickEvent) {
    const btn = document.createElement("input");
    btn.setAttribute("type", "button");
    btn.setAttribute("name", name);
    btn.classList.add("custom-btn", "task-list__btn");
    btn.value = caption;
    btn.addEventListener("click", e => clickEvent());    

    return btn;
  };
  
  createTaskListButtons() {
    const wrapper = document.createElement("div");
    wrapper.classList.add("tasklist-button-wrapper");
    document.querySelector("#app").appendChild(wrapper);

    wrapper.appendChild(
      this.createButton("task-update-btn", "Обновить", (e) => alert("Кнопка находится в разработке")      
    )); 

    wrapper.appendChild(
      this.createButton("task-add-btn", "Добавить", (e) => {
        let event = new Event("showTaskAddForm", {bubbles: true});
        document.dispatchEvent(event);
        console.log("showTaskAddForm");
      })
    );
   
    
  }
  
  createAddTaskBtn() {
    const btn = document.createElement("input");
    btn.setAttribute("type", "button");
  }

  createHtmlFilter() {
    this.createSearchInput();

    const wrapper = document.createElement("div");
    wrapper.classList.add("checkbox-wrapper"); 
    document.querySelector("#app").appendChild(wrapper); 

    this.createCheckBox("filter-mytask", "Мои", this.createFilter);

    this.createCheckBox("filter-period", "Период",  this.createFilter);

    this.createCheckBox("filter-shortlist", "Сегодня", this.createFilter); 
    
    this.createCheckBox("filter-earlyshortlist", "Ранние", this.createFilter);
                  
  };    

  createHtmlProjectList() {
    const projectUl = document.createElement("ul");
    projectUl.classList.add("project-list");

    projectUl.addEventListener("click", async (e) => {
      if (e.target.name === "opentask-btn") {
        if (e.target.textContent === "Открыть") {
          const taskForm = new TaskForm(e.target.dataset.taskid);
          await taskForm.getTask();
          taskForm.createHtml();
          e.target.textContent = "Закрыть";
        } else {
          e.target.textContent = "Открыть";
          const detailTaskDiv = document.querySelectorAll(`.task-detail[data-taskid="${e.target.dataset.taskid}"]`);
          detailTaskDiv.forEach(element => element.remove());
        }

      };
      
      if (e.target.name === "timesheetAdd-btn") {               
          const taskForm = new TaskForm(e.target.dataset.taskid);          
          taskForm.createTimeSheetAddForm();
          e.target.disabled = true;
      };

      if (e.target.name === "timesheet-info-close-btn") {
        const timesheetInfoWrapper = document.querySelector(`#timesheet-info-wrapper-${e.target.dataset.taskid}`)
        timesheetInfoWrapper.remove();
        const timesheetAddBtn = document.querySelector(`#timesheetAdd-btn-${e.target.dataset.taskid}`);
        timesheetAddBtn.disabled = false;
      }

      if (e.target.name === "timesheet-info-create-btn") {
        const timeSheet = new TimeSheet();
        await timeSheet.getOrCreateTimeSheet();
        
        if (!timeSheet.reportId) {
          alert("Не удалось создать таймшит на сервере");
          return;
        }

        const comment = document.querySelector(`#timesheet-comment-${e.target.dataset.taskid}`)
        if (!comment.value) {
          alert("Комментарий не должен быть пустым");
          return;
        }

        const timeInput = document.querySelector(`#timesheet-time-${e.target.dataset.taskid}`);        
        if (!timeInput.value) {
          alert("Укажите время")
          return;
        }
        
        const timeText =  timeInput.value;
        const timeArr = timeText.split(":");
        const effectTime = timeArr[0] * 3600 + timeArr[1] * 60;

        await timeSheet.addTimeSheet(timeSheet.reportId, e.target.dataset.taskid, effectTime, comment.value);
      

        const timesheetInfoWrapper = document.querySelector(`#timesheet-info-wrapper-${e.target.dataset.taskid}`)
        timesheetInfoWrapper.remove();
        const timesheetAddBtn = document.querySelector(`#timesheetAdd-btn-${e.target.dataset.taskid}`);
        timesheetAddBtn.disabled = false;
      }


      //TimeSheet

    })

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
          taskLi.setAttribute("data-name", task.taskName.toLowerCase());          
          taskLi.setAttribute("data-project", project.projectId);
          taskLi.setAttribute("data-id", task.taskId);
          if (task.timestamp !== null) {
            const divTime = document.createElement("div");
            divTime.textContent = `дедлайн - ${task.realDeadline}`;            
            divTime.classList.add("task-list__deadline");
            if (task.timestamp < Date.now()) {
              divTime.classList.add("red");      
            }
            taskLi.appendChild(divTime);       
          }
          taskLi.setAttribute("data-shortlist", task.shortList ? "1" : "0");
          taskLi.setAttribute("data-earlyshortlist", task.earlyShortList ? "1" : "0");

          taskLi.setAttribute("data-statusname", task.statusName);          

          const btnWrapper = document.createElement("div");
          btnWrapper.classList.add("hide", "button-wrapper");
          taskLi.appendChild(btnWrapper);                     

          const btn = document.createElement("button");
          btn.classList.add("custom-btn", "task-list__btn");
          btn.textContent = "Открыть";          
          btn.setAttribute("data-taskid", task.taskId);
          btn.setAttribute("name", "opentask-btn")
          btnWrapper.appendChild(btn);   
          
          if (employee.employeeId == localStorage.getItem("employeeId")) {
            const btnTimeSheet = document.createElement("button");
            btnTimeSheet.classList.add("custom-btn", "task-list__btn");
            btnTimeSheet.textContent = "Таймшит";          
            btnTimeSheet.setAttribute("data-taskid", task.taskId);
            btnTimeSheet.setAttribute("id", `timesheetAdd-btn-${task.taskId}`);
            btnTimeSheet.setAttribute("name", "timesheetAdd-btn")
            btnWrapper.appendChild(btnTimeSheet);       
          }
                                            
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
        statusName: element.statusName,
        shortList: element.shortList,
        earlyShortList: element.earlyShortList
      }) - 1;
    }
  }  

  createTaskForm(taskId) {
    const taskForm = document.querySelector(`.project-list__task-list__task[data-id=${taskid}]`);

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





