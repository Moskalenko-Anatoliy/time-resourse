const TaskList = require('../models/taskList')

class taskListController {
  async getTaskList(req, res) {
    try {            
      return res.json(await TaskList.getTaskList(req.userId));
    } catch(e) {            
      return res.status(400).json({'message': 'Ошибка получения задач!'})
    };        
  };
}

module.exports = new taskListController();