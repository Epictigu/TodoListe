
function addAllTodos() {
    console.log("Versuche Liste aller Todos abzurufen ...");
    fetch("/api/todos", { method: 'get' })
        .then(response => {
            if(response.status == 500) {
                console.log("Fehler 500!");
            }
            return response.json();
        })
        .then(todos => {
            console.log('Server Response: %o', todos);
            todos.forEach(todo => {
                addTodo(todo);
            });
            return todos;
        })
        .catch(error => console.log("error: %o", error));
}

function addTodo(todo){
    var div = document.createElement("div");
    div.className = "todo";
    div.id = "todo-" + todo.ID;

    div.insertAdjacentHTML("beforeend", '<span class="todotitle">' + todo.Title + '</span>');
    div.insertAdjacentHTML("beforeend", '<span class="tododue">Fällig bis: ' + formatDateAndTime(todo.Due) + '</span>');
    div.insertAdjacentHTML("beforeend", '<span class="todoprogress">Fortschritt: ' + todo.Status + '%</span>');

    var todoDel = document.createElement("button");
    todoDel.className = "tododel";
    todoDel.appendChild(document.createTextNode('✕'));
    div.appendChild(todoDel);

    var todoEdit = document.createElement("button");
    todoEdit.className = "todoedit";
    todoEdit.appendChild(document.createTextNode('✎'));
    div.appendChild(todoEdit);

    div.addEventListener("mouseenter", function(event){
        todoDel.style.display = "block";
        todoEdit.style.display = "block";
    }, false);

    div.addEventListener("mouseleave", function(event){
        todoDel.style.display = "none";
        todoEdit.style.display = "none";
    }, false);

    todoDel.onclick = function (){
        console.log("Versuche Todo zu löschen ...");
        fetch("/api/todos/" + todo.ID, { method: 'delete' })
            .then(response => {
                if(response.status == 500){
                    console.log("Fehler 500!");
                }
                return response.json();
            })
            .then(response => {
                console.log('Server Response %o', response);
                div.remove();
            })
            .catch(error => console.log("error: %o", error));
    }

    todoEdit.onclick = function(){
        openEditTodo(todo);
    }


    document.getElementById("todoList").appendChild(div);
}

function addNewTodo(e){
    if(e.preventDefault){
        e.preventDefault;
    }
    e.returnValue = false;

    var textInput = document.getElementById("task");
    var progressInput = document.getElementById("progress");
    var dateInput = document.getElementById("targetDate");
    var timeInput = document.getElementById("targetTime");

    let todo = {
        Title: textInput.value,
        Due: dateInput.value + " " + timeInput.value,
        Status: progressInput.value
    }
    console.log("Versuche Todo hinzuzufügen ...");
    fetch("/api/todos", { method: 'post', headers: new Headers({'content-type': 'application/json'}), body: JSON.stringify(todo) })
        .then(response => response.json())
        .then(response => {
            console.log('Server Response: %o', response);
            todo.ID = response.insertId;
            todo.Due = todo.Due.replace(" ", "T");
            addTodo(todo);
            openAddTodo();
        });
}

function editTodo(e){
    if(e.preventDefault){
        e.preventDefault;
    }
    e.returnValue = false;

    var textInput = document.getElementById("taskEdit");
    var progressInput = document.getElementById("progressEdit");
    var dateInput = document.getElementById("targetDateEdit");
    var timeInput = document.getElementById("targetTimeEdit");

    currentEdit.Title = textInput.value;
    currentEdit.Status = progressInput.value;
    currentEdit.Due = dateInput.value + "T" + timeInput.value;

    console.log("Versuche Todo zu editieren ...");
    fetch("/api/todos/" + currentEdit.ID, { method: 'put', headers: new Headers({'content-type': 'application/json'}), body: JSON.stringify(currentEdit) })
        .then(response => response.json())
        .then(response =>{
            console.log('Server Response: %o', response);

            var targetDiv = document.getElementById("todo-" + currentEdit.ID);
            targetDiv.getElementsByClassName("todotitle")[0].textContent = currentEdit.Title;
            targetDiv.getElementsByClassName("tododue")[0].textContent = "Fällig bis: " + formatDateAndTime(currentEdit.Due);
            targetDiv.getElementsByClassName("todoprogress")[0].textContent = "Fortschritt: " + currentEdit.Status + "%";

            openEditTodo();
        });
}

var isOpened = false;
var isOpenedEdit = false;

function openAddTodo(){
    if(isOpened){
        document.getElementById("task").value = "";
        document.getElementById("progress").value = 0;
        document.getElementById("targetDate").value = "";
        document.getElementById("targetTime").value = "";
    
        document.getElementById("addtodo").style.display = "none";
        var todoList = document.getElementById("todoList")
        todoList.style.filter = "none";
        todoList.style.pointerEvents = "inherit";
        todoList.style.cursor = "inherit";

        isOpened = false;
    } else {
        document.getElementById("addtodo").style.display = "block";
        if(isOpenedEdit){
            document.getElementById("edittodo").style.display = "none";
            isOpenedEdit = false;
        }
        var todoList = document.getElementById("todoList")
        todoList.style.filter = "blur(4px)";
        todoList.style.pointerEvents = "none";
        todoList.style.cursor = "none";

        isOpened = true;
    }
}

var currentEdit;

function openEditTodo(todo){
    if(isOpenedEdit){
        document.getElementById("taskEdit").value = "";
        document.getElementById("progressEdit").value = "";
        document.getElementById("targetDateEdit").value = "";
        document.getElementById("targetTimeEdit").value = "";
    
        document.getElementById("edittodo").style.display = "none";
        var todoList = document.getElementById("todoList")
        todoList.style.filter = "none";
        todoList.style.pointerEvents = "inherit";
        todoList.style.cursor = "inherit";

        isOpenedEdit = false;
    } else {
        currentEdit = todo;

        document.getElementById("taskEdit").value = todo.Title;
        document.getElementById("progressEdit").value = todo.Status;

        var dateDiv = todo.Due.split("T");
        var timePart = dateDiv[1].split(":");

        document.getElementById("targetDateEdit").value = dateDiv[0];
        document.getElementById("targetTimeEdit").value = timePart[0] + ":" + timePart[1];     

        document.getElementById("edittodo").style.display = "block";
        var todoList = document.getElementById("todoList")
        todoList.style.filter = "blur(4px)";
        todoList.style.pointerEvents = "none";
        todoList.style.cursor = "none";   

        isOpenedEdit = true;
    }
}



function formatDateAndTime(input){
    var dateAndTime = input.split("T");
    var datePart = dateAndTime[0].split("-");
    year = datePart[0];
    month = datePart[1];
    day = datePart[2];
  
    var timePart = dateAndTime[1].split(":")

    return day+'.'+month+'.'+year + " " + timePart[0] + ":" + timePart[1];
}