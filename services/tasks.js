const db = require('./db');
const crud = require('./db');

async function getTaskList(empoyeeId) {
  const rows = await crud.query(
    `
      SELECT 
        project.name as projectName, 
        task.name as taskName
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

  return rows;
}

module.exports = {
  getTaskList
}
  