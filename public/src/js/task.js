document.body.onload = createTaskList;
let my_div = newDiv = null;

async function createTaskList() {
  
  const serverConfigResponse = await fetch('/config.json');
  const serverConfig =  await serverConfigResponse.json();  
  console.log('serverConfig', serverConfig)

  const response = await fetch(`http://${serverConfig.host}:${serverConfig.port}/api/tasks`);
  const tasks = await response.json();
  
  const tbl = document.createElement("table");  
  const tblBody = document.createElement("tbody"); 
  
  const row = document.createElement("tr");

  let cell = document.createElement("th");
  let cellText = document.createTextNode("Проект");
  cell.appendChild(cellText);
  row.appendChild(cell);     

  cell = document.createElement("th");
  cellText = document.createTextNode("Задача");
  cell.appendChild(cellText);
  row.appendChild(cell);  

  tblBody.appendChild(row);

  tasks.forEach(element => {
    
    const row = document.createElement("tr");

    let cell = document.createElement("td");
    let cellText = document.createTextNode(element.projectName);
    cell.appendChild(cellText);
    row.appendChild(cell);     

    cell = document.createElement("td");
    cellText = document.createTextNode(element.taskName);
    cell.appendChild(cellText);
    row.appendChild(cell);  

    tblBody.appendChild(row);
  })

  tbl.appendChild(tblBody);
  
  document.body.appendChild(tbl);

  tbl.classList.add("task-list");
}

function generate_table() {
  // creates a <table> element and a <tbody> element
   const tbl = document.createElement("table");
   const tblBody = document.createElement("tbody");
 
   // creating all cells
   for (let i = 0; i < 2; i++) {
     // creates a table row
     const row = document.createElement("tr");
 
     for (let j = 0; j < 2; j++) {
       // Create a <td> element and a text node, make the text
       // node the contents of the <td>, and put the <td> at
       // the end of the table row
       const cell = document.createElement("td");
       const cellText = document.createTextNode("cell in row "+i+", column "+j);
       cell.appendChild(cellText);
       row.appendChild(cell);
     }
 
     // add the row to the end of the table body
     tblBody.appendChild(row);
   }
 
   // put the <tbody> in the <table>
   tbl.appendChild(tblBody);
   // appends <table> into <body>
   document.body.appendChild(tbl);
   // sets the border attribute of tbl to '2'
   tbl.setAttribute("border", "2");
 }