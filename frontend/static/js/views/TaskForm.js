import fetchWithAuth from "../modules/fetchWithAuth.js";
import * as helper from "../modules/helper.js"

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

}