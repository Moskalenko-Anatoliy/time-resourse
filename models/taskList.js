const crud = require('../services/db');

class TaskList {
  async getTaskList(empoyeeId) {
    try {
      const rows = await crud.query(
        `
          SELECT 
            project.name as projectName, 
            task.name as taskName,
            task.realdeadline as realDeadline
          FROM task
            left join employee on task.employee = employee.id
            left join taskstatus on task.status = taskstatus.id
            left join project on task.project = project.id
          WHERE 
            employee.id = ? and 
            taskstatus.complete = false and 
            taskstatus.name not in ('Периодические', 'Архив', 'Заморожена') and
            ifnull(project.Freezed, false) = false and
            ifnull(project.Archive, false) = false
        `,
        [empoyeeId]
      );  
    
      rows.forEach(elem => {
        if (elem.realDeadline !== null) {
          elem.timestamp = elem.realDeadline.getTime();      
          elem.realDeadline = elem.realDeadline.toLocaleDateString('ru-RU');            
        } else {
          elem.timestamp = null;
          elem.realDeadline = '';
        }
    
      })
          
      return rows;
      
    } catch(err) {
      console.log('ERROR ERROR ERRROR', err);
    }
  
  }
};


module.exports = new TaskList();
  