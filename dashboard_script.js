
var currentSelectedTasksByType = "in-progress"; // default selected task type


const showPopupOverlay = (elemId="task-popup-overlay") => {
    let popup = document.getElementById(elemId);
    popup.style.scale = 1;
    popup.style.opacity = 1;
    popup.style.borderRadius = 0;
}
const closePopupOverlay = (elemId="task-popup-overlay") => {
    let popup = document.getElementById(elemId);
    popup.style.scale = 0;
    popup.style.opacity = 0;
    popup.style.borderRadius = "50%"
}
const showMobileViewMenu = () => {
    let elem = document.getElementById("mobile-view-side-menu-popup");
    elem.style.opacity = 1;
    elem.style.transform = "translateX(0%)";
}
const closeMobileViewMenu = () => {
    let elem = document.getElementById("mobile-view-side-menu-popup");
    elem.style.opacity = 0;
    elem.style.transform = "translateX(-100%)";
}

// Save data to localStorage
const saveToLocalStorage = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (e) {
        console.error("Error saving to localStorage:", e);
        return false;
    }
}

// Get data from localStorage
const getFromLocalStorage = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error("Error retrieving from localStorage:", e);
        return null;
    }
}

// Remove data from localStorage
const removeFromLocalStorage = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error("Error removing from localStorage:", e);
        return false;
    }
}


const checkForValueMatchInLocalStorage = (key, value) => {
    const item = getFromLocalStorage(key);
    if (item && item === value) {
        return true;
    }
    return false;
}

const createTask = (title, start_time, end_time, description="") => {
    let current_tasks = getFromLocalStorage("user_tasks");
    let task_data = {
        title: titleCase(title), 
        description: description, 
        start_time: start_time, 
        end_time: end_time, 
        status: "in-progress"
    }

    if (current_tasks) {
        let new_task_id = (Object.keys(current_tasks).length).toString(); // id for new task
        current_tasks[new_task_id] = task_data; // assign task data to new id
        saveToLocalStorage("user_tasks", current_tasks); // update tasks
    } else {
        saveToLocalStorage("user_tasks", {"0": task_data});
    }
    loadTasks(); // reload tasks
    closePopupOverlay(); // close task popup
    console.log("Tasks:", getFromLocalStorage("user_tasks"));
}

// show create task popup
let createTaskBtn = document.getElementById("create-task-btn");
createTaskBtn.onclick = () => showPopupOverlay();

// close create task popup
let closePopupBtn = document.getElementById("close-task-popup");
closePopupBtn.onclick = () => {
    console.log("Task ID:", showCreateTaskPopupBtn.dataset);
    clearAllTaskFormFields(); // clear all fields
    closePopupOverlay();
};

// close menu (mobile view)
document.getElementById("close-menu-popup").onclick = closeMobileViewMenu;

// open menu (mobile view)
document.getElementById("mobile-view-menu-btn").onclick = showMobileViewMenu;

// create/update task
let showCreateTaskPopupBtn = document.getElementById("create-update-task");
showCreateTaskPopupBtn.addEventListener("click", (event) => {
    let title = document.getElementById("title-field").value, // get task's title 
    description = document.getElementById("task-desc").value, // get task's description
    start_time = document.getElementById("start-time-field").value, // get task's starting time
    end_time = document.getElementById("end-time-field").value; // get task's starting time

    if ([title, description, start_time, end_time].every(item => item.length > 0)) {
        if (event.target.dataset.taskId) {
            updateTask(event.target.dataset.taskId, title, start_time, end_time, description); // update task
            alert("Task updated successfully!"); // show success message
            closePopupOverlay();
        } else {
            createTask(title, start_time, end_time, description); // create new task

            // empty all fields
            document.getElementById("title-field").value = "";
            document.getElementById("task-desc").value = "";
            document.getElementById("start-time-field").value = "";
            document.getElementById("end-time-field").value = "";

            alert("Task created successfully!"); // show success message
        }
        document.getElementById("task-creation-error-msg").innerText = ""; 
    } else {
        document.getElementById("task-creation-error-msg").innerText = "Please fill all fields!"; // show error message
    }
})

const editTask = (task_id) => {
    let user_tasks = getFromLocalStorage("user_tasks");
    if (user_tasks) {
        let task_data = user_tasks[task_id]; // get task data
        document.getElementById("title-field").value = task_data.title; // set task title
        document.getElementById("task-desc").value = task_data.description; // set task description
        document.getElementById("start-time-field").value = task_data.start_time; // set task starting time
        document.getElementById("end-time-field").value = task_data.end_time; // set task ending time
        document.getElementById("create-update-task").innerText = "Update Task"; // change button text
        document.getElementById("create-update-task-header").innerText = "Edit Task"; // change header text
        showCreateTaskPopupBtn.dataset.taskId = task_id; // set task id to button
        showPopupOverlay();
    }
}

const clearAllTaskFormFields = () => {
    document.getElementById("title-field").value = ""; // clear task title
    document.getElementById("task-desc").value = ""; // clear task description
    document.getElementById("start-time-field").value = ""; // clear task starting time
    document.getElementById("end-time-field").value = ""; // clear task ending time
    document.getElementById("create-update-task").innerText = "Create Task"; // change button text
    document.getElementById("create-update-task-header").innerText = "Create Task"; // change button text
    delete showCreateTaskPopupBtn.dataset.taskId; // remove task id from button
    document.getElementById("task-creation-error-msg").innerText = ""; // clear error message
}

const updateTasksCount = (tasks) => {
    let selected_task_type = currentSelectedTasksByType; // get selected task type
    let total_tasks = Object.keys(tasks).length; // get total tasks count
    let completed_tasks = 0; // get completed tasks count
    let in_progress_tasks = 0; // get in-progress tasks count
    let overdue_tasks = 0; // get overdue tasks count
    for (let task of Object.values(tasks)) {
        if (task.status === "completed") {
            completed_tasks++;
        } else if (task.status === "in-progress") {
            in_progress_tasks++;
        } else if (task.status === "overdue") {
            overdue_tasks++;
        }
    }
    
    document.getElementById("total-tasks-count").innerText = total_tasks; // update total tasks count (desktop view)
    document.getElementById("total-tasks-count-mobile").innerText = total_tasks; // update total tasks count (mobile view)
    document.getElementById("total-tasks-count-by-type").innerText = selected_task_type == "completed" ? completed_tasks: selected_task_type == "in-progress" ? in_progress_tasks : overdue_tasks; // update tasks count by type (desktop view)
}

const checkForOverdueTasks = () => {
    let tasks = getFromLocalStorage("user_tasks");
    let updateTasksStatus = false;
    if (tasks) {
        for (let task_id of Object.keys(tasks)) {
            let end_time = tasks[task_id].end_time; end_time = new Date(end_time);
            if (tasks[task_id].status == "in-progress" && Date.now() > end_time) {
                updateTasksStatus = true;
                tasks[task_id].status = "overdue";
            }
        }
        if (updateTasksStatus) {saveToLocalStorage("user_tasks", tasks); updateTasksCount(user_tasks);}
    }
}

const loadTasks = (type=currentSelectedTasksByType) => {
    let user_tasks = getFromLocalStorage("user_tasks");
    if (user_tasks) {
        let tasksListHTML = document.getElementById("list-of-tasks");
        tasksListHTML.innerHTML = ""; // clear previous tasks
        for (let task_id of Object.keys(user_tasks)) {
            if (user_tasks[task_id].status !== type) continue; // check if task is of selected type
            let end_time = user_tasks[task_id].end_time; end_time = new Date(end_time); end_time = end_time.toLocaleString();
            let taskBoxHTML = 
            `
            <div class="task-box">
                <div class="task-box-top-bar">
                    <h3 class="task-title">${user_tasks[task_id].title}</h3>
                    <i class="fa-solid fa-ellipsis-vertical cursor-point icon-hover"></i>
                </div>
                <p class="task-description">${user_tasks[task_id].description}</p>
                <div class="task-box-bottom-bar">
                    <small><time><i class="fa-solid fa-clock"></i>&nbsp;&nbsp;${end_time}</time></small>
                    <div class="task-box-bottom-bar-right">
                        <i class="fa-solid fa-circle-check check-task-icon-btn icon-hover cursor-point" title="Mark this task as completed" onclick="changeTaskStatus(${task_id});"></i>
                        <i class="fa-solid fa-pen edit-icon-btn icon-hover cursor-point" title="Edit this task" onclick="editTask(${task_id});"></i>
                        <i class="fa-solid fa-trash-can del-icon-btn icon-hover cursor-point" title="Delete this task" onclick="deleteTask(${task_id});"></i>
                    </div>
                </div>
            </div>
            `;
            tasksListHTML.innerHTML += taskBoxHTML; // add task to list
            // console.log("Task ID:", task_id);
        }
        updateTasksCount(user_tasks); // update tasks count
    }
}

const selectListOfTasksByType = (type="in-progress") => {
    let inProgressSelectedElem = document.getElementById("in-progress-tasks");
    let completedSelectedElem = document.getElementById("completed-tasks");
    let overDueSelectedElem = document.getElementById("overdue-tasks");
    
    // Reset all selections first
    inProgressSelectedElem.classList.remove("selected-task-type");
    completedSelectedElem.classList.remove("selected-task-type");
    overDueSelectedElem.classList.remove("selected-task-type");
    
    // Set the new selection based on the type parameter
    if (type === "in-progress") {
        inProgressSelectedElem.classList.add("selected-task-type");
    } else if (type === "completed") {
        completedSelectedElem.classList.add("selected-task-type");
    } else if (type === "overdue") {
        overDueSelectedElem.classList.add("selected-task-type");
    }
    
    // Update the global variable
    currentSelectedTasksByType = type;
    
    // Load tasks by the new type
    loadTasks(type);
    console.log("Selected task type:", currentSelectedTasksByType);
}

const deleteTask = (task_id) => {
    let confirmation = confirm("Are you sure you want to delete this task?"); // confirm deletion
    if (!confirmation) return; // exit if user cancels
    let user_tasks = getFromLocalStorage("user_tasks");
    if (user_tasks) {
        delete user_tasks[task_id]; // delete task
        saveToLocalStorage("user_tasks", user_tasks); // update tasks
        loadTasks(); // reload tasks
    }
}

const updateTask = (task_id, title, start_time, end_time, description="") => {
    let user_tasks = getFromLocalStorage("user_tasks");
    if (user_tasks) {
        let task_status = user_tasks[task_id].status; // get task status
        let task_data = {
            title: titleCase(title), 
            description: description, 
            start_time: start_time, 
            end_time: end_time, 
            status: task_status
        }
        user_tasks[task_id] = task_data; // update task data
        saveToLocalStorage("user_tasks", user_tasks); // update tasks
        loadTasks(); // reload tasks
    }
}

const changeTaskStatus = (task_id, status="completed", confirm_msg="Are you sure you want to mark this task as completed?") => {
    let confirmation = confirm(confirm_msg); // confirm completion
    if (!confirmation) return; // exit if user cancels
    let user_tasks = getFromLocalStorage("user_tasks");
    if (user_tasks) {
        let task_data = user_tasks[task_id]; // get task data
        task_data.status = status; // update task status
        user_tasks[task_id] = task_data; // update task data
        saveToLocalStorage("user_tasks", user_tasks); // update tasks
        loadTasks(); // reload tasks
    }
}

const unselectAllMenuTabs = () => {
    // unselect all
    document.getElementById("tasks-page-side-menu-btn").classList.remove("selected-task-type");
    document.getElementById("tasks-page-popup-menu-btn").classList.remove("selected-task-type");
    document.getElementById("calendar-page-side-menu-btn").classList.remove("selected-task-type");
    document.getElementById("calendar-page-popup-menu-btn").classList.remove("selected-task-type");
}

const pointToTasksPage = (elem) => {
    unselectAllMenuTabs(); // unselect all tabs

    // re-select
    elem.classList.add("selected-task-type");
}

const pointToCalendarPage = (elem) => {
    unselectAllMenuTabs(); // unselect all tabs

    // re-select
    elem.classList.add("selected-task-type");
}

window.document.addEventListener("DOMContentLoaded", () => {
    pointToTasksPage(document.getElementById("tasks-page-side-menu-btn")); // Tasks page by default (desktop)
    pointToTasksPage(document.getElementById("tasks-page-popup-menu-btn")); // Tasks page by default (mobile)
    selectListOfTasksByType(); // load tasks by default selection
    checkForOverdueTasks(); // checks for overdue tasks
})


const signOut = () => {
    if (localStorage.getItem("user_email")) {
        localStorage.setItem("is_login", false);
        if (confirm("Are you sure u want to log out")) {
            if (confirm("Eii eii relax, are you sure you want to logout?")) {
                alert("Fine, bye bye!");
                window.location.href = "/";
            }
        }
    }
}

const titleCase = (str) => {
  return str.toLowerCase().split(' ').map(function(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}