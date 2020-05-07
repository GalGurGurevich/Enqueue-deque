var queueNum = JSON.parse(localStorage.getItem('QUEUE_NUM')) || 0;
var PeopleInLine = JSON.parse(localStorage.getItem('PPL_IN_LINE')) || [];
var personGettingService = JSON.parse(localStorage.getItem('PPL_GETTIN_SERVICE')) || []; // I actually need just 1 spot here
var doneWithServiceList = JSON.parse(localStorage.getItem('PPL_FINISHED')) || [];
var pplInLineTable = document.getElementById("pendingTable");
var processTable = document.getElementById("proccesingTable");

for (let i = 0; i < PeopleInLine.length; i++) {
    insertPersonToTable(PeopleInLine[i], pplInLineTable);
}
for (let i = 0; i < personGettingService.length; i++) {
    insertPersonToTable(personGettingService[i], processTable);
}

function AddPersonToQueue() {
    //Create Person and put In waiting Line
    let name = document.getElementById("nameInput").value;
    queueNum += 1;
    let time = new Date();
    let arrival = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    let state =  WaitingState.pending;
    let Person = {name, queueNum, arrival, state, arrival};
    //Save the number of line
    localStorage.setItem('QUEUE_NUM', JSON.stringify(queueNum));

    PeopleInLine.push(Person);
    
    insertPersonToTable(Person, pplInLineTable);
    //Save the line of ppl in storage
    localStorage.setItem('PPL_IN_LINE', JSON.stringify(PeopleInLine));

}

function CallNextPerson() {
    //Take Care of person in Service out
    if(personGettingService.length > 0) {
        let personFinishedProcessing = personGettingService.shift();
        removeFirstPersonFromTable(processTable);
        personFinishedProcessing.WaitingState = WaitingState.finished;
        doneWithServiceList.push(personFinishedProcessing);
    }

    //Take Care of person in Line
    if(PeopleInLine.length > 0) {
        let personNextInLine = PeopleInLine.shift();
        personNextInLine.WaitingState = WaitingState.processing;
        personGettingService.push(personNextInLine);
        
        removeFirstPersonFromTable(pplInLineTable);
        
        insertPersonToTable(personNextInLine, processTable);
    }
    
    localStorage.setItem('PPL_IN_LINE', JSON.stringify(PeopleInLine));
    localStorage.setItem('PPL_GETTIN_SERVICE', JSON.stringify(personGettingService));
    localStorage.setItem('PPL_FINISHED', JSON.stringify(doneWithServiceList));

}

function insertPersonToTable(Person, table) {
    
    let row = document.createElement("tr");
    table.appendChild(row);
    let cell1 = document.createElement("td");
    row.appendChild(cell1)
    let cell2 = document.createElement("td");
    row.appendChild(cell2)
    let cell3 = document.createElement("td");
    row.appendChild(cell3)

    cell1.innerHTML = Person.name;
    cell2.innerHTML = Person.queueNum;
    cell3.innerHTML = Person.arrival;
}

function removeFirstPersonFromTable(table) {
    let row = table.rows[1];
    if (row)
        row.remove();
}

//Wannabe Enum of Person state: 
const WaitingState = { 
    pending: 0,
    processing: 1,
    finished: 2
};
