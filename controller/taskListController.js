const TaskList = require('../models/taskList')

class taskListController {
  async getTaskList(req, res) {
    try {            
      res.json(await TaskList.getTaskList(3));
    } catch(e) {            
      res.status(400).json({'message': 'Ошибка получения задач!'})
    };        
  };
}

module.exports = new taskListController();