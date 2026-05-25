const minutes=document.querySelector("#minutes");
const seconds=document.querySelector("#seconds");

const startBtn=document.querySelector("#start");
const pauseBtn=document.querySelector("#pause");
const resetBtn=document.querySelector("#reset");

const taskInput=document.querySelector("#task-input");
const addTaskBtn=document.querySelector("#add-task-btn");
const taskList=document.querySelector("#task-list");

const quote=document.querySelector("#quote");
const quoteBtn=document.querySelector("#quote-btn");

const toggleThemeBtn=document.querySelector("#theme-toggle");

const taskCounter=document.querySelector("#task-counter");
const totalTasksText=document.querySelector("#total-tasks");

const dsaProgress=document.querySelector(".dsa");
const webProgress=document.querySelector(".web");

const clock=document.querySelector("#clock");
function updateClock(){
    let now=new Date();
    let days=[
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    let day=days[now.getDay()];
    let hours=now.getHours();
    let minutes=now.getMinutes();

    let ampm=hours>=12?"PM":"AM";
    hours=hours%12;
    if(hours===0){
        hours=12;
    }
    minutes=String(minutes).padStart(2,"0");
    clock.innerText =`${day}, ${hours}:${minutes} ${ampm}`;
}

let timeLeft=1500;
let timer;

function updateTimer(){
    let mins=Math.floor(timeLeft/60);
    let secs=timeLeft%60;

    minutes.innerText=String(mins).padStart(2,"0");
    seconds.innerText=String(secs).padStart(2,"0");
}
startBtn.addEventListener("click",()=>{
    if(timer) return;
    timer=setInterval(()=>{
        if(timeLeft>0){
            timeLeft--;
            updateTimer();
        }
        if(timeLeft===0){
            alert("Pomodoro Session completed");
            clearInterval(timer);
            timer=null;
        }

    },1000);
});

pauseBtn.addEventListener("click",()=>{
    clearInterval(timer);
    timer=null;
});

resetBtn.addEventListener("click",()=>{
    clearInterval(timer);
    timer=null;
    timeLeft=1500;
    updateTimer();
});
function updateTaskCounter(){

    let totalTasks =
    document.querySelectorAll("#task-list li").length;

    let completedTasks =
    document.querySelectorAll(".completed").length;

    totalTasksText.innerText =
    `Total Tasks: ${totalTasks}`;

    taskCounter.innerText =
    `Completed: ${completedTasks}`;

}

function updateProgressBars(){
    let totalTasks=document.querySelectorAll("#task-list li").length;
    let completedTasks=document.querySelectorAll(".completed").length;
    if(totalTasks===0){
        dsaProgress.style.width="0%";
        webProgress.style.width="0%";
        return;
    }
    let progressPercent=(completedTasks/totalTasks)*100;
    dsaProgress.style.width=`${progressPercent}%`;
    webProgress.style.width =`${progressPercent}%`;

}

addTaskBtn.addEventListener("click",()=>{
    let taskText=taskInput.value;
    if(taskText===""){
        alert("please enter a task");
        return;
    }
    let li=document.createElement("li");
    li.innerText=taskText;
    let deleteBtn=document.createElement("button");
    deleteBtn.innerText="❌";
    deleteBtn.classList.add("delete-btn");
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
    saveTasks();
    updateTaskCounter();
    updateProgressBars();
    taskInput.value="";
    taskInput.focus();
});

function saveTasks(){
    localStorage.setItem("tasks",taskList.innerHTML);
}
function showTasks(){
    let savedTasks = localStorage.getItem("tasks");

    if(savedTasks){
        taskList.innerHTML = savedTasks;
    }
}
taskList.addEventListener("click", (evt) => {

    // DELETE TASK
    if(evt.target.tagName === "BUTTON"){

        evt.target.parentElement.remove();

        saveTasks();
        updateTaskCounter();
        updateProgressBars();
    }

    // COMPLETE TASK
    else if(evt.target.tagName === "LI"){

        evt.target.classList.toggle("completed");

        saveTasks();
        updateTaskCounter();
        updateProgressBars();
    }

});

async function getQuote(){
       quote.innerText = "Loading...";

    let response =
    await fetch("https://dummyjson.com/quotes/random");

    let data = await response.json();

    quote.innerText = `"${data.quote}"`;
}

quoteBtn.addEventListener("click",()=>{
    getQuote();
});

toggleThemeBtn.addEventListener("click",()=>{

   
    document.body.classList.toggle("light-mode");

    if(document.body.classList.contains("light-mode")){

        localStorage.setItem("theme","light");

        toggleThemeBtn.innerText = "☀️";

    }
    else{

        localStorage.setItem("theme","dark");

        toggleThemeBtn.innerText = "🌙";

    }

});
taskInput.addEventListener("keydown",(evt)=>{
    if(evt.key==="Enter"){
        evt.preventDefault();
        addTaskBtn.click();
    }
});
showTasks();

updateTaskCounter();

getQuote();
updateProgressBars();
updateClock();
setInterval(updateClock,1000);
let savedTheme = localStorage.getItem("theme");

if(savedTheme === "light"){

    document.body.classList.add("light-mode");

    toggleThemeBtn.innerText = "☀️";

}
else{

    toggleThemeBtn.innerText = "🌙";

}