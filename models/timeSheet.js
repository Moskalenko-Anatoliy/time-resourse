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

  async addTimeSheetInfo(reportId, taskId, employeeId, comment, effectTime) {
    const totalTimeSec = effectTime;
    const usefulTime = 100;        
    const noPrice = false;
    
    const noPriceTaskResponse = await crud.query(`select Price from task where id = ${taskId}`);
    if (!noPriceTaskResponse) {
      return;
    }
    const noPriceTask = !noPriceTaskResponse[0].Price;
   
    const projectIdResponse =  await crud.query(`select project from task where id = ${taskId}`);
    const projectId = projectIdResponse[0].project;
    const docDateResponse = await crud.query(`select reportDate from timeUseReport where id = ${reportId}`);
    const docDate = docDateResponse[0].reportDate;     

    const price = await getPrice(true, docDate, projectId, employeeId);
    const sum = price * (effectTime / 3600);
    
    let clientPrice = 0;
    let clientSum = 0;
     if (!noPrice && !noPriceTask) {
       clientPrice = await getPrice(false, docDate, projectId, employeeId);
       clientSum = clientPrice * (effectTime / 3600);
    };

    await crud.query(`
    Insert into timeUseReportDetail (
      Header, 
      task, 
      usefulTime,
      LUT, 
      comment, 
      totaltimesec, 
      effectTime, 
      Price, 
      Sum,
      ClientPrice,
      ClientSum,
      NoPrice, 
      NoPriceTask
    )
    values (
      ${reportId},
      ${taskId},
      100,
      100,
      "${comment}",
      ${totalTimeSec},
      ${effectTime},
      ${price},
      ${sum},
      ${clientPrice},
      ${clientSum},
      ${noPrice},
      ${noPriceTask}
    )            
      `)
  }  

}

//вычисление ставки сотрудника и ставик клиента в разрезе проекта и даты
async function getPrice(employeeFlag, docDate, projectId, employeeId) {

  let price, discount, selfPrice;
  
  try {
    if (employeeFlag) {    
      const rows = await crud.query(`
        Select
          PEPrice.price as price
        from tm_docPEPrice as PEPrice 
          left join tm_docProjectEmployee as ProjectEmployee on PEPrice.header = ProjectEmployee.id
          left join project as Project on ProjectEmployee.header = project.id
        where 
          Project.id = ${projectId} and 
          ProjectEmployee.Employee= ${employeeId} and 
          PEPrice.DocDate <= ${ helper.convertTimeStampToMySqlDate( docDate.getTime() ) }
        order by PEPrice.DocDate desc
        limit 1
      `
    );    
  
    if (rows.length) {
      return rows[0].price;
    }

    return 0;
  };

  const rows = await crud.query(`
    Select
      PEPrice.price as price
    from tm_docPEClientPrice as PEPrice 
      left join tm_docProjectEmployee as ProjectEmployee on PEPrice.header = ProjectEmployee.id
      left join project as Project on ProjectEmployee.header = project.id
    where 
      Project.id = ${projectId} and 
      ProjectEmployee.Employee= ${employeeId} and 
      PEPrice.DocDate <= ${ helper.convertTimeStampToMySqlDate( docDate.getTime() ) }
    order by PEPrice.DocDate desc
    limit 1
  `
  ); 
  
  if (rows.length === 0) {
    return 0;
  }
  
  price = rows[0].price;
  const projectTypeResponse = await crud.query(`select type from project where id = ${projectId} limit 1`);
  
  if (projectTypeResponse[0].type == 2) {
    const discountResponse =  await crud.query(`
      select 
        discount 
      from tm_docprojectDiscount as projectDiscount
        left join project on projectDiscount.header = project.id
      where   
        project.id = ${projectId} and
        projectDiscount.periodFrom <= ${ helper.convertTimeStampToMySqlDate( docDate.getTime() ) } and
        projectDiscount.periodTo >= ${ helper.convertTimeStampToMySqlDate( docDate.getTime() ) }
      limit 1`
    );    
    
    if (discountResponse.length) {
      price -=  price * discountResponse[0].discount / 100;
    }        
  }

  return price;
} catch(e) {
    console.log(e);
}

//   else
//   begin
//     if ds[0].Price and  ExternalFlag = false and (single NoPrice from tm_docProjectEmployee where Employee=:employee_val and header=:ds[0].project_Val) = false then
//     begin
//       price := (Single Price from tm_docPEClientPrice where Header.header=:ds[0].project_val and Header.Employee=:employee_val and RoundDay(DocDate) <= : DocDate order by DocDate desc);
//       if ds[0].project_type = 2 then
//       begin
//         discount := (single discount from tm_docprojectDiscount where periodFrom <= : docDate and periodTo >= : docdate);
//         if discount > 0 then
//           price := price - RoundDiv( price * discount, 100, 2);
//       end;
//       result := price;
//     end
//     else result := 0
//   end;
// end;
}

  

module.exports = new TimeSheet();