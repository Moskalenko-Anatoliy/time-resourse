import View from "./View.js";
import fetchWithAuth from "../modules/fetchWithAuth.js";
import TaskForm from "./TaskForm.js";

export default class extends View {
  constructor() {
    super()   
    this.tasks = [];
    this.projectList = [];
    this.employeeId = 0;     
  }

  async createHtml() {
    super.addNavigate();
    
    this.createTaskAddForm();   
  }

  createTaskAddForm() {
    document.querySelector("#app").innerHTML = document.querySelector("#app").innerHTML +
    `
      <form id="task-add-form">
        <fieldset class="task-add-form">
          <legend>Добавление задачи</legend>
          <label for="login">Наименование</label>
          <input class="task-add-input" id="task-add-name" name="task-add-name" type="text" required autofocus>  
          <label for="task-add-project">Проект</label>
          <input class="task-add-input" id="task-add-project" name="task-add-project"" type="text" required>
          <label for="task-add-common">Общая задача</label>
          <input class="task-add-input" id="task-add-common" name="task-add-common" type="text" required>        
          <label for="task-add-employee">Исполнитель</label>
          <input class="task-add-input" id="task-add-employee" name="task-add-employee"" type="text" required>        
          <label for="task-add-status">Статус</label>
          <input class="task-add-input" id="task-add-status" name="task-add-status"" type="text" required>
          <label for="task-add-descr">Описание</label>
          <textarea class="task-add-textarea" id="task-add-descr" name="task-add-descr"" type="textarea" rows="5" wrap="hard">
          </textarea>
          <div>
            <label for="task-add-deadline">Дедлайн</label>
            <input class="task-add-input" id="task-add-deadline" name="task-add-deadline"" type="date">
            <label for="task-add-deadline">План</label>        
            <input class="task-add-input" id="plan-time" name="plan-time"" type="time" list="time-list">
            <datalist id="time-list">
              <option value="05:00" label="Пять минут">
              <option value="10:00" label="Десять минут">
              <option value="15:00" label="Пятнадцать минут">
              <option value="20:00" label="Двадцать минут">        
              <option value="25:00" label="Двадцать пять минут">
              <option value="30:00" label="Тридцать минут">                
              <option value="45:00" label="Сорок пять минут">                
              <option value="01:00" label="Один час">
              <option value="01:30" label="Полтора часа">
              <option value="02:00" label="Два часа">                
            </datalist>
          </div>
          <button class="custom-btn task-list__btn"" name="task-add-button" type="submit">Создать</button>    
        </fieldset>        
      </form>  `    
  }

}