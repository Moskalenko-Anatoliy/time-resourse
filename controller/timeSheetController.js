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

  async addTimeSheetInfo(req, res) {
    try {             
      const {reportId, taskId, comment, effectTime} = req.body;
      //addTimeSheetInfo(reportId, taskId, employeeId, comment, effectTime)
      await timeSheet.addTimeSheetInfo(reportId, taskId, req.userId, comment, effectTime);
      return res.status(201).json({"message": "Действие в таймшит добавлено успешно"})
    } catch(e) {          
      console.log(e);
      return res.status(400).json({'message': 'Ошибка создания подхода по таймшиту!'})
    };      
  }
}

module.exports = new TimeSheetController();