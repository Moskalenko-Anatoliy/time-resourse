import fetchWithAuth from "../modules/fetchWithAuth.js";
import View from "./View.js";
import * as helper from "../modules/helper.js"

export default class extends View {
  constructor() {
    super();
    this.reportId = 0;
    this.effectTime = 0;
    this.timeText = "";
    this.projectList = [];
  }

  async getTimeSheetId() {     
    const response = await fetchWithAuth(`/api/timesheet/get?employeeId=${localStorage.getItem("employeeId")}&reportDate=${new Date().getTime()}`, {
      method: "GET"
    });    

    const timesheet = await response.json();
        
    if (!timesheet || timesheet.length === 0) {    
      return 0;
    };   

    return timesheet[0].reportId;
  }

  async createTimeSheet() {     
    const response = await fetchWithAuth(`/api/timesheet/create?employeeId=${localStorage.getItem("employeeId")}&reportDate=${new Date().getTime()}`, {
      method: "POST"
    });    

    const timesheet = await response.json();
        
    if (!timesheet || timesheet.length === 0) {    
      return 0;
    };   

    return timesheet[0].reportId;
  }  

  async getOrCreateTimeSheet() {
    this.reportId = await this.getTimeSheetId();
    if (this.reportId === 0) {
      this.reportId = await this.createTimeSheet();      
    };

    if (!this.reportId) {
      return
    };

    return this.reportId;
  };

  async addTimeSheet(reportId, taskId, effectTime, comment) {     
    const response = await fetchWithAuth(`/api/timesheet/info/create`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "reportId": reportId,        
        "taskId": taskId,
        "comment": comment,
        "effectTime": effectTime
      }
    )});    

    const timesheet = await response.json();
          
    return timesheet.status;
  }    

  async getInfoTimeSheet() {
    this.projectList = [];

    const infoCandidate = await fetchWithAuth(`/api/timesheet/info/get?reportId=${this.reportId}`, {
      method: "GET"
    });  
    
    const infoTimeSheet = await infoCandidate.json();

    infoTimeSheet.forEach(element =>this.createProjectList(element) )
    this.getTimeSheetParams();

    this.createHtmlProjectList();

    const divTimeSheetResult = document.querySelector(".timesheet-result");
    divTimeSheetResult.textContent = this.timeText;
  }

  getTimeSheetParams() {
    this.effectTime = 0;
    this.projectList.forEach(project => {
      project.taskList.forEach(task => {
        this.effectTime += task.effectTime;
      })
    })    
    this.timeText = `Эффективное время: ${helper.getTimeStringFromSeconds(this.effectTime)}`;
  }

  async updateTimeSheet() {
    this.reportId = await this.getTimeSheetId();
    if (this.reportId === 0) {
      this.reportId = await this.createTimeSheet();      
    };

    if (!this.reportId) {
      return
    };

    await this.getInfoTimeSheet();
  }

  showAll() {
    const elemenstHtml = document.querySelectorAll(".project-list__project.hide, .project-list__task-list__task.hide");
    elemenstHtml.forEach(e => {
      e.classList.remove("hide");
    })
  }

  hideProject() {
    let projectListHtml = document.querySelectorAll(".project-list__project");        

    projectListHtml = document.querySelectorAll(`.project-list__project[data-detail="0"]`);        
    projectListHtml.forEach(project => {
      const taskList = document.querySelectorAll(`.project-list__task-list__task[data-project="${project.dataset.id}"]:not(.hide)`);            
      if (taskList) {
        taskList.forEach(task => task.classList.add("hide"));
      }
    })    
};

detailProjectList(e) {  
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

createFilter() {
  this.showAll();
  this.hideProject();
}



createHtml() {
  document.querySelector("#app").innerHTML = "";

  super.addNavigate();

  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("tasklist-button-wrapper");
  document.querySelector("#app").appendChild(buttonWrapper);    

  const btnGetTimeSheet = document.createElement("button");
  btnGetTimeSheet.classList.add("custom-btn", "task-list__btn");
  btnGetTimeSheet.textContent = "Обновить";
  btnGetTimeSheet.addEventListener("click", async (e) => {
    await this.updateTimeSheet();      
  });
  buttonWrapper.appendChild(btnGetTimeSheet);    

  const timeSheetDiv = document.createElement("div");
  timeSheetDiv.classList.add("timesheet-result");  

  
  document.querySelector("#app").appendChild(timeSheetDiv);

  this.updateTimeSheet();    
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
      this.projectList[projectIndex].taskList = [];
    };  
    
    let taskIndex = this.projectList[projectIndex].taskList.findIndex(elem => {
      return elem.taskId === element.taskId;
    });
    if (taskIndex === -1) {  
      taskIndex = this.projectList[projectIndex].taskList.push({
        taskName: element.taskName,
        taskId: element.taskId,
        realDeadline: element.realDeadline,
        statusName: element.statusName,
        effectTime: 0,
        timeText: "",
        timeSheet: [],
      }) - 1;
    }

    this
      .projectList[projectIndex]
      .taskList[taskIndex]
      .timeSheet.push({
        comment: element.comment,
        effectTime: element.effectTime,
        timeText: helper.getTimeStringFromSeconds(element.effectTime)
      });
    
    this.projectList[projectIndex].taskList[taskIndex].effectTime += element.effectTime;
    this.projectList[projectIndex].taskList[taskIndex].timeText = helper.getTimeStringFromSeconds(
      this.projectList[projectIndex].taskList[taskIndex].effectTime
    )
    
  } 

  createHtmlProjectList() {
    const clearProjectUl = document.querySelector(".project-list");
    if (clearProjectUl) {
      clearProjectUl.remove();
    }

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
          const detailTaskDiv = document.querySelector(`.task-detail[data-taskid="${e.target.dataset.taskid}"]`);
          detailTaskDiv.remove();
        }

      }
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
      spanProjectName.classList.add("project-name")
      projectWrapper.appendChild(spanProjectName);

      projectLi.appendChild(projectWrapper);
 
      const taskUl = document.createElement("ul");
      taskUl.setAttribute("type", "1")
      taskUl.classList.add("project-list__task-list")
      projectLi.appendChild(taskUl);
      this.projectList[projectIndex].taskList.forEach((task, taskIndex) => {
        const taskLi = document.createElement("li");
        taskLi.classList.add("project-list__task-list__task");
        taskLi.classList.add("project-list__task-list__task_card");

        const divTaskName = document.createElement("div");
        divTaskName.textContent =  `${task.taskName}`;
        divTaskName.classList.add("project-list__task-list__task__name")
        taskLi.appendChild(divTaskName);      
        
        const divTaskStatus = document.createElement("div");
        divTaskStatus.textContent =  `${task.statusName}`;
        divTaskStatus.classList.add("project-list__task-list__task__status")
        taskLi.appendChild(divTaskStatus);            

        taskLi.setAttribute("data-project", project.projectId);
        taskLi.setAttribute("data-id", task.taskId);        
        if (task.timestamp) {
          const divTime = document.createElement("div");
          divTime.textContent = `дедлайн - ${task.realDeadline}`;            
          divTime.classList.add("task-list__deadline");
          if (task.timestamp < Date.now()) {
            divTime.classList.add("red");      
          }
          taskLi.appendChild(divTime);       
        }
        taskLi.setAttribute("data-shortlist", task.shortList ? "1" : "0");
                    
        taskLi.setAttribute("data-statusname", task.statusName);                  
                  
        taskUl.appendChild(taskLi);

        let step = 1;
        task.timeSheet.forEach(timesheet => {
          const divComment = document.createElement("div");
          divComment.classList.add("timesheet-detail")
          taskLi.appendChild(divComment);
          divComment.innerHTML =  `${step}. ${timesheet.comment.replaceAll(/\n/g, "<br>")} - ${timesheet.timeText}`;
          step++;
        })

        const taskResult = document.createElement("div");
        taskResult.classList.add("task-result");
        taskResult.textContent = `Время: ${task.timeText}`;
        taskLi.appendChild(taskResult);
      })          
      })

    
    
    document.querySelector("#app").appendChild(projectUl);
    

  }  
  

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
