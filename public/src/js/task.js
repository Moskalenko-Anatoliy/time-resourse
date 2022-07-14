document.body.onload = createTaskList;

async function createTaskList() {
  
  const serverConfigResponse = await fetch('/config.json');
  const serverConfig =  await serverConfigResponse.json();    

  const response = await fetch(`http://${serverConfig.host}:${serverConfig.port}/api/tasks`);
  const tasks = await response.json();
  
  tasks.sort((a, b) => {
    if (a.projectName > b.projectName) {
      return 1
    }

    if (a.projectName < b.projectName) {
      return -1
    }    

    if (a.taskName > b.taskName) {
      return 1
    }

    if (a.taskName < b.taskName) {
      return -1
    }

    return 0
  })
  
  const tbl = document.createElement("table");  
  const tblBody = document.createElement("tbody"); 
  
  const row = document.createElement("tr");

  cell = document.createElement("th");
  cellText = document.createTextNode("Задача");
  cell.appendChild(cellText);
  row.appendChild(cell);  

  tblBody.appendChild(row);

  tasks.forEach((element, index, array) => {
    
    let row;
    let cell;
    let cellText;

    if (index === 0 || element.projectName !== array[index - 1].projectName) {
      row = document.createElement("tr");  
      cell = document.createElement("td");
      cell.setAttribute('colspan', '3');
      cellText = document.createTextNode(element.projectName);
      cell.classList.add('task-list__project')
      cell.appendChild(cellText);
      row.appendChild(cell);   
      tblBody.appendChild(row);      
    }
    
    row = document.createElement("tr"); 
    row.classList.add('task-list__task')
        
    cell = document.createElement("td");


    // cell = document.createElement("td");
    // cellText = document.createTextNode(element.realDeadline);
    // console.log(Date.parse(element.realDeadline))
    // if (element.timestamp !== null && element.timestamp < Date.now()) {
    //   cell.classList.add('red');
    //   cell.dataset.deadline = element.realDeadline;
    // }
    // cell.appendChild(cellText);
    // row.appendChild(cell);      

    if (element.timestamp !== null) {
      //cell.dataset.deadline = element.realDeadline;
      const span = document.createElement("span");
      const spanText = document.createTextNode(element.realDeadline);
      span.appendChild(spanText);
      span.classList.add('task-list__deadline');
      if (element.timestamp < Date.now()) {
        span.classList.add('red');      
      }
      cell.appendChild(span);       
    }

    cellText = document.createTextNode(element.taskName);
    cell.appendChild(cellText);
    row.appendChild(cell);      

    tblBody.appendChild(row);
  })

  tbl.appendChild(tblBody);
  
  document.body.appendChild(tbl);

  tbl.classList.add("task-list");
}