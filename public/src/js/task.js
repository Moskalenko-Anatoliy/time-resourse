document.body.onload = createTaskList;

async function createTaskList() {
  
  const serverConfigResponse = await fetch('/config.json');
  const serverConfig =  await serverConfigResponse.json();  
  console.log('serverConfig', serverConfig)

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

  cell = document.createElement("th");
  cellText = document.createTextNode("Дедлайн");
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
    cellText = document.createTextNode(element.taskName);
    cell.appendChild(cellText);
    row.appendChild(cell);  

    cell = document.createElement("td");
    cellText = document.createTextNode(element.realDeadline);
    console.log(Date.parse(element.realDeadline))
    if (element.timestamp !== null && element.timestamp < Date.now()) {
      cell.classList.add('red');
    }
    cell.appendChild(cellText);
    row.appendChild(cell);      

    tblBody.appendChild(row);
  })

  tbl.appendChild(tblBody);
  
  document.body.appendChild(tbl);

  tbl.classList.add("task-list");
}


const dpt = window.devicePixelRatio;
const widthM = window.screen.width;
const widthH = window.screen.height;
alert(dpt+' '+widthM+' '+widthH+' '+(widthM*dpt)+' '+(widthH*dpt));