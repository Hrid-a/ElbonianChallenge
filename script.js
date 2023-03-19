let myTasks = []
let comTasks = []
let progTasks = []

const tasksLoadsFromLocalStorage = JSON.parse(localStorage.getItem("myTasks"))
const pTasksLoadsFromLocalStorage = JSON.parse(localStorage.getItem("progTasks"))
const cTasksLoadsFromLocalStorage = JSON.parse(localStorage.getItem("comTasks"))

const newTasksContainer = document.querySelector("[data-new-tasks]");
const progressedTasks = document.querySelector("[data-progressed-tasks]");
const completedTasks = document.querySelector("[data-completed-tasks]");

const newTaskBtn = document.querySelector("[data-new-task-btn]");
const progressTaskBtn = document.querySelector("[data-progress-btn]");
const completedTaskBtn = document.querySelector("[data-completed-btn]");

const modal = document.querySelector(".modal");
const modalOptions = document.querySelector(".options");
const closeIcon = document.querySelector(".close-icon");

if(tasksLoadsFromLocalStorage) {
    myTasks = tasksLoadsFromLocalStorage;
    renderTasks(myTasks, newTasksContainer);
}

if(pTasksLoadsFromLocalStorage) {
    progTasks= pTasksLoadsFromLocalStorage;
    renderTasks(progTasks, progressedTasks);
}

if(cTasksLoadsFromLocalStorage) {
    comTasks = cTasksLoadsFromLocalStorage;
    renderTasks(comTasks, completedTasks);
}

newTaskBtn.addEventListener("click", (event)=> {
    myTasks.push({
                taskName : "task",
                completed : false,});
    localStorage.setItem("myTasks", JSON.stringify(myTasks))
    renderTasks(myTasks, newTasksContainer);
});

progressTaskBtn.addEventListener("click", ()=> {
    if(myTasks.length){
        renderTasks(myTasks, modalOptions);
        modal.classList.toggle("show");
        modal.classList.toggle("progress")
    }
})

completedTaskBtn.addEventListener("click", (event)=> {
    if(myTasks.length){
        renderTasks(myTasks, modalOptions)
        modal.classList.toggle("show");
        modal.classList.toggle("completed")
    }
})

newTasksContainer.addEventListener("click", (event)=> {

    if(event.target.classList.contains("trash-icon")){
        index = event.target.closest("li").dataset.index;
        deleteTask(index, myTasks, newTasksContainer, "myTasks")
    }else if (event.target.classList.contains("edit-icon")) {
        const inputELement = event.target.parentNode.nextElementSibling
        inputELement.focus()
    }
    
})

progressedTasks.addEventListener("click", (event)=> {

    if(event.target.classList.contains("trash-icon")){
        index = event.target.closest("li").dataset.index;
        deleteTask(index, progTasks, progressedTasks, "progTasks")
    }else if (event.target.classList.contains("edit-icon")) {
        const inputELement = event.target.parentNode.nextElementSibling
        inputELement.focus()
    }
    
})

completedTasks.addEventListener("click", (event)=> {

    if(event.target.classList.contains("trash-icon")){
        index = event.target.closest("li").dataset.index;
        deleteTask(index, comTasks, completedTasks, "comTasks")
    }else if (event.target.classList.contains("edit-icon")) {
        const inputELement = event.target.parentNode.nextElementSibling
        inputELement.focus()
    }
    
})

modal.addEventListener("click", (event)=> {
    if(event.target.classList.contains("option") && modal.classList.contains("progress")){
        index = event.target.closest("li").dataset.index;
        task = myTasks[index];
        progTasks.push(task);
        localStorage.setItem("progTasks", JSON.stringify(progTasks));
        deleteTask(index, myTasks, newTasksContainer, "myTasks");
        renderTasks(progTasks, progressedTasks);
    }
})

modal.addEventListener("click", (event)=> {
    if(event.target.classList.contains("option") && modal.classList.contains("completed")){
        index = event.target.closest("li").dataset.index;
        task = myTasks[index];
        comTasks.push(task);
        task.completed = true;
        localStorage.setItem("comTasks", JSON.stringify(comTasks));
        deleteTask(index, myTasks, newTasksContainer, "myTasks");
        renderTasks(comTasks, completedTasks);
    }
})

closeIcon.addEventListener("click", () => {
    modal.classList.toggle("show");
    if (modal.classList.contains("progress")) {
        modal.classList.remove("progress");
    } else if (modal.classList.contains("completed")) {
        modal.classList.remove("completed");
    }
});


function renderTasks(taskList,container){
    container.innerHTML ="";
    taskList.forEach((task, index) => {
        createTask(task, index, container)
    });
}

function createTask(taskEl, index,container) {
    const taskElement = document.createElement("li");
    const inputTask = document.createElement("input");
    inputTask.type = "text";
    inputTask.value = taskEl.taskName || " ";
    taskElement.innerHTML = `
        <div class="icons">
            <i class="fa-solid fa-pen edit-icon"></i>
            <i class="fa-solid fa-trash trash-icon"></i>
        </div>`
    taskElement.appendChild(inputTask);
    taskElement.dataset.index = index;
    if(container === modalOptions){
        taskElement.classList.add("option");
        inputTask.classList.add("option");
        inputTask.disabled = true
    }
    container.append(taskElement);

    saveNewValues(inputTask,index);
}

function saveNewValues(inputTask,index){
    inputTask.addEventListener("blur", (event)=> {
        if(typeof myTasks[index] !== "undefined"){
            
        myTasks[index].taskName = event.target.value.trim();
        localStorage.setItem("myTasks", JSON.stringify(myTasks));
        }

        renderTasks(myTasks, newTasksContainer);
    })
}

function deleteTask(index, taskList, container, listName) {
    taskList.splice(index, 1);
    localStorage.setItem(listName, JSON.stringify(taskList));
    renderTasks(taskList, container);
}

// ===========================
// The second way 
newTasksContainer.addEventListener("mousedown", function(event) {
    const movableElement = event.target.closest("li");
// THE current mouse position
    const startPosition = {
        x: event.clientX,
        y: event.clientY
    };

    document.addEventListener("mousemove", moveHandler);

    document.addEventListener("mouseup", endHandler);

    function moveHandler(event) {
        const deltaX = event.clientX - startPosition.x;
        const deltaY = event.clientY - startPosition.y;
        
        movableElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }

    function endHandler(event) {
            document.removeEventListener("mousemove", moveHandler);
            document.removeEventListener("mouseup", endHandler);
            const movableElementRect = movableElement.getBoundingClientRect();
            const movableElementCenterX = movableElementRect.left + (movableElementRect.width / 2);
            const movableElementCenterY = movableElementRect.top + (movableElementRect.height / 2);
            // Check if the movable element is over a container element
            const containerElements = document.getElementsByClassName("card");
            for (const containerElement of containerElements) {
                const containerElementRect = containerElement.getBoundingClientRect();
                if (movableElementCenterX >= containerElementRect.left &&
                    movableElementCenterX <= containerElementRect.right &&
                    movableElementCenterY >= containerElementRect.top &&
                    movableElementCenterY <= containerElementRect.bottom) {
                    const containerClass = containerElement.classList;
                    const movableIndex = movableElement.dataset.index
                    const currentTask = myTasks[movableIndex];
    
                    if(containerClass.contains("in-progress")){
                        progTasks.push(currentTask);
                        console.log(currentTask)
                        deleteTask(movableIndex, myTasks, newTasksContainer, "myTasks");
                        localStorage.setItem("progTasks", JSON.stringify(progTasks))
                        renderTasks(progTasks, progressedTasks)
                    }else if (containerClass.contains("completed")) {
                        comTasks.push(currentTask)
                        currentTask.completed = true;
                        deleteTask(movableIndex, myTasks, newTasksContainer, "myTasks");
                        localStorage.setItem("comTasks", JSON.stringify(comTasks))
                        renderTasks(comTasks, completedTasks)
                        
                    }
                    break;
                }
            }
    
    }

});

progressedTasks.addEventListener("mousedown", function(event) {
    const movableElement = event.target.closest("li");
// THE current mouse position
    const startPosition = {
        x: event.clientX,
        y: event.clientY
    };

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", endHandler);

    function moveHandler(event) {
        const deltaX = event.clientX - startPosition.x;
        const deltaY = event.clientY - startPosition.y;
        movableElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }

    function endHandler(event) {
            document.removeEventListener("mousemove", moveHandler);
            document.removeEventListener("mouseup", endHandler);
            
            const movableElementRect = movableElement.getBoundingClientRect();
            const movableElementCenterX = movableElementRect.left + (movableElementRect.width / 2);
            const movableElementCenterY = movableElementRect.top + (movableElementRect.height / 2);
            const containerElements = document.getElementsByClassName("card");
            for (const containerElement of containerElements) {
                const containerElementRect = containerElement.getBoundingClientRect();
                if (movableElementCenterX >= containerElementRect.left &&
                    movableElementCenterX <= containerElementRect.right &&
                    movableElementCenterY >= containerElementRect.top &&
                    movableElementCenterY <= containerElementRect.bottom) {
                    const containerClass = containerElement.classList;
                    const movableIndex = movableElement.dataset.index
                    const currentTask = progTasks[movableIndex];
    
                    if(containerClass.contains("not-started")){
                        myTasks.push(currentTask);
                        deleteTask(movableIndex, progTasks, progressedTasks, "progTasks");
                        localStorage.setItem("myTasks", JSON.stringify(myTasks))
                        renderTasks(myTasks, newTasksContainer)
                    }else if (containerClass.contains("completed")) {
                        comTasks.push(currentTask)
                        currentTask.completed = true;
                        deleteTask(movableIndex, progTasks, progressedTasks, "progTasks");
                        localStorage.setItem("comTasks", JSON.stringify(comTasks))
                        renderTasks(comTasks, completedTasks)
                        
                    }
                    break;
                }
            }
    
    }

});

completedTasks.addEventListener("mousedown", function(event) {
    const movableElement = event.target.closest("li");
// THE current mouse position
    const startPosition = {
        x: event.clientX,
        y: event.clientY
    };

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", endHandler);

    function moveHandler(event) {
        const deltaX = event.clientX - startPosition.x;
        const deltaY = event.clientY - startPosition.y;
        movableElement.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    }

    function endHandler(event) {
            document.removeEventListener("mousemove", moveHandler);
            document.removeEventListener("mouseup", endHandler);
            
            
            const movableElementRect = movableElement.getBoundingClientRect();
            const movableElementCenterX = movableElementRect.left + (movableElementRect.width / 2);
            const movableElementCenterY = movableElementRect.top + (movableElementRect.height / 2);
            // Check if the movable element is over a container element
            const containerElements = document.getElementsByClassName("card");
            for (const containerElement of containerElements) {
                const containerElementRect = containerElement.getBoundingClientRect();
                if (movableElementCenterX >= containerElementRect.left &&
                    movableElementCenterX <= containerElementRect.right &&
                    movableElementCenterY >= containerElementRect.top &&
                    movableElementCenterY <= containerElementRect.bottom) {
                    const containerClass = containerElement.classList;
                    const movableIndex = movableElement.dataset.index
                    const currentTask = comTasks[movableIndex];
    
                    if(containerClass.contains("in-progress")){
                        progTasks.push(currentTask);
                        currentTask.completed = false
                        deleteTask(movableIndex, comTasks, progressedTasks, "comTasks");
                        localStorage.setItem("progTasks", JSON.stringify(progTasks))
                        renderTasks(progTasks, progressedTasks)
                    }else if (containerClass.contains("not-started")) {
                        myTasks.push(currentTask);
                        currentTask.completed = false
                        deleteTask(movableIndex, comTasks, progressedTasks, "comTasks");
                        localStorage.setItem("myTasks", JSON.stringify(myTasks))
                        renderTasks(myTasks, newTasksContainer)
                        
                    }
                    break;
                }
            }
    
    }

});
// ===========================

