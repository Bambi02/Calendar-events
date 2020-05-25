// add time on load
const cas = document.querySelector('.time');

function time() {
  const d = new Date();
  const m = d.getMinutes();
  const h = d.getHours();

  if (m < 10 && h < 10) {
    cas.textContent = "0" + h + ":0" + m ;
  }else if (m < 10){
    cas.textContent = h + ":0" + m ;
  }else if (h < 10){
    cas.textContent = "0" + h + ":" + m ;
  }else{
    cas.textContent = h + ":" + m ;
  } 
}

setInterval(time, 1000);


// add date on load
const datum = document.querySelector(".date");
const date_format = {weekday:"short", day:"2-digit", month:"long", year:"numeric"}

const d = new Date().toLocaleDateString("sk-SK", date_format);

datum.textContent = d;


//side menu on
document.querySelector(".hamburger").addEventListener("click", menuOn);

function menuOn (){
    document.querySelector(".menu").style.width = "84%";
    document.querySelector(".fa-times").style.display = "block";
    document.querySelector(".fa-times").style.opacity = "1";
    document.querySelector(".fa-times").style.cursor = "pointer";
}


//side menu off
menuOff = () => {
  document.querySelector(".menu").style.width = "0";
  document.querySelector(".fa-times").style.display = "none";
}

document.querySelector(".fa-times").addEventListener("click", menuOff);


//add event window slide in/out
const addWindow = document.querySelector(".add_window");
let counter = 0;

document.querySelector(".add").addEventListener("click", activityWindow);

function activityWindow (){
    if (counter % 2 == 0){
        addWindow.style.transform = "translateY(0)";
        addWindow.style.zIndex = "1";
        addWindow.style.opacity= "1";
        document.querySelector(".add").textContent = "Close";
        document.querySelector(".modify_event").style.display = "none"
        document.querySelector(".add_event").style.display = "block"
        counter ++;
    }else if (counter % 2 != 0){
        addWindow.style.transform = "translateY(100%)";
        document.querySelector(".add").textContent = "Add activity";
        addWindow.style.zIndex = "-1";
        addWindow.style.opacity= "0";
        counter ++;
        //clear input fields
        document.querySelector("#name").value = "";
        document.querySelector("#desc").value = "";
        document.querySelector("#time").value = "";
    }   
}


//add event
const bottom = document.querySelector(".bottom");

createTodo = () => {
  let eventName = document.querySelector("#name").value;
  let eventDesc = document.querySelector("#desc").value;
  let eventTime = document.querySelector("#time").value;
  const div = document.createElement("div");
  const div2 = document.createElement("div");

  //error if empty input field
  if (eventName == "" || eventDesc =="" || eventTime ==""){
    div2.className = "message message_error";
    div2.innerText = "Prosim vyplňte všetky údaje";
    document.querySelector(".add_window").insertBefore(div2, document.querySelector("#name"));
    setTimeout(function(){div2.remove()}, 2000);
  //update existing values if editing + confirmation
  }else if (document.querySelector(".confirm").textContent === "Edit"){

  }else{
    //else create event + confirmation
    div.className = "event";
    div.innerHTML = `<div class="left_bar"></div>
                    <div class="description">
                        <div class="event_title"><p>${eventName}</p></div>
                        <div class="event_description"><p>${eventDesc}</p></div>
                        <div class="event_time"><p>${eventTime}</p></div>
                    </div>
                    <div class="icons">
                        <i class="fas fa-edit"></i>
                        <i class="fas fa-ban"></i>
                    </div>`;
    bottom.appendChild(div);
    div2.className = "message message_confirm";
    div2.innerText = "Udalosť vytvorená";
    document.querySelector(".add_window").insertBefore(div2, document.querySelector("#name"));
    setTimeout(function(){div2.remove()}, 2000);
    //clear input fields
    document.querySelector("#name").value = "";
    document.querySelector("#desc").value = "";
    document.querySelector("#time").value = "";
  }
}

document.querySelector(".add_event").addEventListener("click", createTodo);


//edit widow on/off
function editWindow (element){
  if (counter % 2 == 0){
      addWindow.style.transform = "translateY(0)";
      addWindow.style.zIndex = "1";
      addWindow.style.opacity= "1";
      document.querySelector(".add").textContent = "Close";
      document.querySelector(".modify_event").style.display = "block"
      document.querySelector(".add_event").style.display = "none"
      //fill input values with editing values
      document.querySelector("#name").value = element.previousElementSibling.firstElementChild.innerText;
      document.querySelector("#desc").value = element.previousElementSibling.firstElementChild.nextElementSibling.innerText;
      document.querySelector("#time").value = element.previousElementSibling.firstElementChild.nextElementSibling.nextElementSibling.innerText;
      counter ++;
  }else if (counter % 2 != 0){
      addWindow.style.transform = "translateY(100%)";
      document.querySelector(".add").textContent = "Add activity";
      addWindow.style.zIndex = "-1";
      addWindow.style.opacity= "0";
      counter ++;
      //clear input fields
      document.querySelector("#name").value = "";
      document.querySelector("#desc").value = "";
      document.querySelector("#time").value = "";
  }   
}  

//delete/edit event button
function modifyEvent(event) {
  const descSelector =  event.target.parentElement.previousElementSibling.firstElementChild;
  const div2 = document.createElement("div");
  let counter = 0;
  //delete event
  if(event.target.classList.contains("fa-ban")){
    event.target.parentElement.parentElement.remove();
    //edit event
  }else if(event.target.classList.contains("fa-edit")) { 
    editWindow(event.target.parentElement)
  } 

  modifyTodo = () => {
    descSelector.innerText = document.querySelector("#name").value;
    descSelector.nextElementSibling.innerText = document.querySelector("#desc").value;
    descSelector.nextElementSibling.nextElementSibling.innerText = document.querySelector("#time").value;

    console.log(event.target);
    console.log(event.target.parentElement);
    console.log(event.target.parentElement.previousElementSibling);
    console.log(event.target.parentElement.previousElementSibling.firstElementChild);
    counter ++;
    console.log(counter)

    div2.className = "message message_confirm";
    div2.innerText = "Udalosť upravená";
    document.querySelector(".add_window").insertBefore(div2, document.querySelector("#name"));
    setTimeout(function(){div2.remove()}, 2000);
  }

  document.querySelector(".modify_event").addEventListener("click", modifyTodo);
}

document.querySelector(".bottom").addEventListener("click", modifyEvent);

