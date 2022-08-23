const timeSheet = require('../models/timeSheet')


class TimeSheetController {
  constructor() {

  }
  
  async getTimeSheetId(req, res) {
    try {                  
      return res.json(await timeSheet.getTimeSheetId(req.query.employeeId, req.query.reportDate));
    } catch(e) {          
      console.log(e);
      return res.status(400).json({'message': 'Ошибка получения id таймшита!'})
    };        
  };

  async createTimeSheet(req, res) {
    try {   
      const result = await timeSheet.createTimeSheet(req.query.employeeId, req.query.reportDate);
      if (result) {
        return await this.getTimeSheetId(req, res);
      }
    } catch(e) {       
      console.log(e);
      return res.status(400).json({'message': 'Ошибка создания таймшита!'})
    };        
  };  

  async getTimeSheetDetail(req, res) {
    try {                  
      return res.json(await timeSheet.getTimeSheetDetail(req.query.reportId));
    } catch(e) {          
      console.log(e);
      return res.status(400).json({'message': 'Ошибка получения информации по таймшиту!'})
    };        
  };  
}

module.exports = new TimeSheetController();