import fetchWithAuth from "../modules/fetchWithAuth.js";
import * as helper from "../modules/helper.js";

export default class {
  constructor(taskId) {
    this.taskId = taskId;
    this.taskData = {};
  }

  async getTask() {     
    const response = await fetchWithAuth(`/api/tasks/${this.taskId}`, {
      method: "GET"
    });    
    
    if (!response) {    
      return;
    };   
  
    this.taskData = (await response.json())[0];    
  }

  createHtml() {
    const taskLi = document.querySelector(`.project-list__task-list__task[data-id="${this.taskId}"]`);

    const statusDiv = document.createElement("div");
    statusDiv.classList.add("task-detail");
    statusDiv.setAttribute("data-taskid", this.taskId);
    statusDiv.innerHTML = `Статус: ${this.taskData.statusName}`;
    taskLi.appendChild(statusDiv); 

    const timeDiv = document.createElement("div");
    timeDiv.classList.add("task-detail");
    timeDiv.setAttribute("data-taskid", this.taskId);
    timeDiv.innerHTML = `Затраченное время: ${helper.getTimeStringFromSeconds( this.taskData.effectTime )}`;
    taskLi.appendChild(timeDiv);     
    
    
    const divDescr = document.createElement("div");
    divDescr.classList.add("task-detail");
    divDescr.setAttribute("data-taskid", this.taskId);
    divDescr.innerHTML = this.taskData.descr;
    divDescr.innerHTML = divDescr.innerHTML.replaceAll(/\n/g, "<br>");
    taskLi.appendChild(divDescr); 
    
  }

  createTimeSheetAddForm() {
    const taskLi = document.querySelector(`.project-list__task-list__task[data-id="${this.taskId}"]`);

    const timesheetWrapper = document.createElement("div");
    timesheetWrapper.classList.add("timesheet-info-wrapper");
    timesheetWrapper.setAttribute("id", `timesheet-info-wrapper-${this.taskId}`);
    
    const labelComment = document.createElement("label");    
    labelComment.setAttribute("for", `timesheet-comment-${this.taskId}`);
    labelComment.textContent = `Описание действия`;
    timesheetWrapper.appendChild(labelComment); 

    const commentTextArea = document.createElement("textarea");
    commentTextArea.classList.add("timesheet-comment");
    commentTextArea.setAttribute("id", `timesheet-comment-${this.taskId}`);
    commentTextArea.setAttribute("maxlength", 200);
    timesheetWrapper.appendChild(commentTextArea);

    const timeLabel = document.createElement("label");    
    timeLabel.setAttribute("id", `timesheet-label-${this.taskId}`);
    timeLabel.classList.add("timeLabel")
    timeLabel.textContent = "Затраченное время";
    timesheetWrapper.appendChild(timeLabel);    

    const timeInput = document.createElement("input");
    timeInput.setAttribute("type", "time");
    timeInput.setAttribute("id", `timesheet-time-${this.taskId}`); 
    timeInput.value = "00:05";    
    timesheetWrapper.appendChild(timeInput);

    const btnWrapper = document.createElement("div");
    timesheetWrapper.appendChild(btnWrapper);                     

    const btn = document.createElement("button");
    btn.classList.add("custom-btn", "task-list__btn");
    btn.textContent = "Добавить";          
    btn.setAttribute("data-taskid", this.taskId);
    btn.setAttribute("name", "timesheet-info-create-btn")
    btnWrapper.appendChild(btn);   
    
    const btnClose = document.createElement("button");
    btnClose.classList.add("custom-btn", "task-list__btn");
    btnClose.textContent = "Отмена";          
    btnClose.setAttribute("data-taskid", this.taskId);
    btnClose.setAttribute("name", "timesheet-info-close-btn")
    btnWrapper.appendChild(btnClose);                  

    taskLi.appendChild(timesheetWrapper);

  }

  createAddTaskForm() {
    
  }  

}