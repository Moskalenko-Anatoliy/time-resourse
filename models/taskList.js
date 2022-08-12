const crud = require('../services/db');

class TaskList {
  async getTaskList(employeeId) {
    try {
      const taskFilter = await getTaskFilter(employeeId);
      const rows = await crud.query(
        `
          SELECT 
            project.name as projectName, 
            task.name as taskName,
            task.id as taskId,
            task.realdeadline as realDeadline,
            employee.name as employeeName,
            employee.id as employeeId,
            taskstatus.name as statusName             
          FROM task
            left join employee on task.employee = employee.id
            left join taskstatus on task.status = taskstatus.id
            left join project on task.project = project.id            
          WHERE              
            ifnull(task.Agreement, 0) in (2, 5) and
            taskstatus.complete = false and 
            taskstatus.name not in ('Архив', 'Заморожена') and
            ifnull(project.Freezed, false) = false and
            ifnull(project.Archive, false) = false and
            ${taskFilter}
        `
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
      console.log(err);
    }
  
  }
};

async function getTaskFilter(employeeId) {
  try {
    let filter = `task.employee = ${employeeId}`;
    const rows = await crud.query(`
      Select 
        header from tm_docProjectEmployee as projectEmployee
      Where
      projectEmployee.employee = ${employeeId} and 
        ifnull(projectEmployee.all_task_access, false) = true
   `);
   
   if (rows) {
    const projectArray = rows.map(element => element.header);
    filter += ` or project.id in (${projectArray.join()} )`
    filter = `( ${filter} )`
   }

   return filter;
   

  } catch(err) {
    console.log(err)
  }}


module.exports = new TaskList();
  