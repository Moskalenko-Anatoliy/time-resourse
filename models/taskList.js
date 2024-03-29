const helper = require('../services/helper');
const e = require('express');
const crud = require('../services/db');


class TaskList {
  async getTaskList(employeeId) {
    try {
      const taskEmployeeFilter = await getEmployeeTaskFilter(employeeId);
      const rows = await crud.query(
        `
          SELECT 
            project.name as projectName, 
            project.id as projectId,
            task.name as taskName,
            task.id as taskId,
            task.realdeadline as realDeadline,
            employee.name as employeeName,
            employee.id as employeeId,
            taskstatus.name as statusName,
            false as shortList          
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
            ${taskEmployeeFilter}
        `
      );
      
      const planTasks = await crud.query(
      `
        SELECT 
          task,
          taskPlan.docdate as docdate,
          false shortList,
          false as earlyShortList
        FROM tm_docTaskPlan as taskPlan
          left join task on taskPlan.task = task.id
          left join employee on task.employee = employee.id
        where 
          task.employee = ${employeeId} and
          ifnull(taskPlan.Done, false) = false and
          taskPlan.docdate <= CURRENT_DATE()
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

        const index = planTasks.findIndex(e => e.task === elem.taskId); 
        if (index > 0) {          
          const date = new Date();
          const roundDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          if (planTasks[index].docdate === roundDay) {
            elem.shortList = true;
          } else {
            elem.earlyShortList = true;
          }
        }
    
      })
          
      return rows;
      
    } catch(err) {
      console.log(err);
    }
  
  }

  async getTask(taskId) {    
    try {
      const rows = await crud.query(
        `
          SELECT 
            project.name as projectName, 
            project.id as projectId,
            task.name as taskName,
            task.id as taskId,
            task.realdeadline as realDeadline,
            employee.name as employeeName,
            employee.id as employeeId,
            taskstatus.name as statusName,
            task.descr,
            0 as effectTime
          FROM task
            left join employee on task.employee = employee.id
            left join taskstatus on task.status = taskstatus.id
            left join project on task.project = project.id            
          WHERE              
            task.id = ${taskId}
        `      
      );

      if (rows) {
        const timeResponse = await crud.query(`select sum(effectTime) as effectTime from timeUseReportDetail where task = ${taskId}`);
        if (timeResponse) {
          rows[0].effectTime = timeResponse[0].effectTime;
        }
        
      }
      return rows;
      
    } catch(e) {
      console.log(e)
    }

        
  }

};



async function getEmployeeTaskFilter(employeeId) {
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
  