const TaskList = require('../models/taskList')


class taskListController {
  async getTaskList(req, res) {
    try {                  
      return res.json(await TaskList.getTaskList(req.userId));
    } catch(e) {            
      return res.status(400).json({'message': 'Ошибка получения списка задач!'})
    };        
  };

  async getTask(req, res) {
    try {                     
      return res.json(await TaskList.getTask(req.params.taskId));
    } catch(e) {            
      return res.status(400).json({'message': 'Ошибка получения данных задачи!'})
    };        
  };  
}

module.exports = new taskListController();