//    report:=(insert into timeUseReport(Header, reportDate, created,completion) values(:tm_GetParam.GetEmployee,:DayReport,:now(),false))
const e = require('express');
const crud = require('../services/db');
const helper = require('../services/helper')

class TimeSheet {    
  async getTimeSheetId(employeeId, reportDate) {
    try {    
      const row = await crud.query(
        `
          SELECT
            timeUseReport.header as employeeId, timeUseReport.id as reportId
          FROM timeUseReport
            left join employee on employee.id = timeUseReport.header
          WHERE
            header = ${employeeId} and
            reportDate = ${helper.convertTimeStampToMySqlDate(reportDate)}
          LIMIT 1
        `
      );

      return row;
    } catch (err) {
      console.log(err)
    }
  }

  async getTimeSheetDetail(reportId) {
    try {    
      const rows = await crud.query(
        `
          SELECT
            task.name as taskName, 
            task.id as taskId,
            task.realDeadline as realDeadline,
            taskstatus.name as statusName,          
            project.name as projectName, 
            project.id as projectId,
            detail.comment as comment,
            detail.effectTime as effectTime
          FROM timeUseReportDetail as detail
            left join task on detail.task = task.id
            left join taskstatus on task.status = taskstatus.id
            left join project on task.project = project.id
          WHERE
            detail.header = ${reportId}          
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
      }); 

      return rows;
    } catch (err) {
      console.log(err)
    }
  }

  async createTimeSheet(employeeId, reportDate) {
    try {
      const row = await crud.query(
        `
          Insert into timeUseReport(
            Header, 
            reportDate, 
            created,
            completion
          ) values (
            ${employeeId},
            ${helper.convertTimeStampToMySqlDate(reportDate)},
            now(),
            false
          )
        `
      );
      return row;
    } catch (err) {
      console.log(err)
    }
  }

}

module.exports = new TimeSheet();