import fetchWithAuth from "../modules/fetchWithAuth.js";

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
    const divDescr = document.createElement("div");
    divDescr.classList.add("task-detail");
    divDescr.setAttribute("data-taskid", this.taskId);
    divDescr.innerHTML = this.taskData.descr;
    divDescr.innerHTML = divDescr.innerHTML.replaceAll(/\n/g, "<br>");
    taskLi.appendChild(divDescr);
 
    //document.querySelector("#app").appendChild(divDescr);
  }

}