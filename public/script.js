//import axios from '../axios';

const cas = document.querySelector('.time');
const bottom = document.querySelector('.bottom');
const addWindow = document.querySelector('.add_window');
const datumDiv = document.querySelector('.date');
const date_format = {
  weekday: 'short',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
};
const selectedDay = document.querySelector('.selected-day');
const datePicker = document.querySelector('.date-picker');
const currentMonthDiv = document.querySelector('.current-month');
const nextMonth = document.querySelector('.next-month');
const prevMonth = document.querySelector('.prev-month');
const kalendarneDni = document.querySelector('.days');
let denVKalendari = '';
let counter = 0;
let calendarDropdown = false;
//variable for storing selected edit buttons div
let eventSelector;

const datum = new Date();
let zvolenyDen = datum.getDate();
const dnesnyDen = datum.getDate();
let zvolenyMesiac = datum.getMonth();
const dnesnyMesiac = datum.getMonth();
const nazovMesiaca = [
  'Január',
  'Február',
  'Marec',
  'Apríl',
  'Máj',
  'Jún',
  'Júl',
  'August',
  'September',
  'Október',
  'November',
  'December',
];
const pocetDniMesiaca = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let zvolenyRok = datum.getFullYear();
const dnesnyRok = datum.getFullYear();
let aktualnyDatum =
  dnesnyDen.toString() + (dnesnyMesiac + 1).toString() + dnesnyRok.toString();
let novyDatum =
  zvolenyDen.toString() +
  (zvolenyMesiac + 1).toString() +
  zvolenyRok.toString();

window.onload = fetchEvents();

getPocetDni();
aktualizujZobrazenyDatum();

//--------------------------- EVENT LISTENERS ---------------------------

//side menu slide in
document.querySelector('.hamburger').addEventListener('click', menuOn);
//side menu slide off
document.querySelector('.fa-times').addEventListener('click', menuOff);
//add event - window slide in/out
document.querySelector('.add').addEventListener('click', activityWindow);
//create event
document.querySelector('.add_event').addEventListener('click', createTodo);
//delete or process to edit selected event
document.querySelector('.bottom').addEventListener('click', modifyEvent);
// edit selected event
document.querySelector('.modify_event').addEventListener('click', modifyTodo);
//toggle calendar dropdown
selectedDay.addEventListener('click', calendarToggle);

nextMonth.addEventListener('click', () => {
  zvolenyMesiac++;
  vytvorNovyDatum();
  currentMonthDiv.textContent = nazovMesiaca[zvolenyMesiac] + ' ' + zvolenyRok;
  if (zvolenyMesiac > 11) {
    zvolenyRok++;
    zvolenyMesiac = 0;
    currentMonthDiv.textContent =
      nazovMesiaca[zvolenyMesiac] + ' ' + zvolenyRok;
  }
  getPocetDni();
});

prevMonth.addEventListener('click', () => {
  zvolenyMesiac--;
  vytvorNovyDatum();
  currentMonthDiv.textContent = nazovMesiaca[zvolenyMesiac] + ' ' + zvolenyRok;
  if (zvolenyMesiac < 0) {
    zvolenyRok--;
    zvolenyMesiac = 11;
    currentMonthDiv.textContent =
      nazovMesiaca[zvolenyMesiac] + ' ' + zvolenyRok;
  }
  getPocetDni();
});

denVKalendari.forEach((day) =>
  addEventListener('click', (element) => zvolDen(day, element))
);

// -------------------------STYLING FUNCTIONS------------------------------

// add date on load
datumDiv.textContent = new Date().toLocaleDateString('sk-SK', date_format);

//add time on load
function time() {
  const d = new Date();
  const m = d.getMinutes();
  const h = d.getHours();

  if (m < 10 && h < 10) {
    cas.textContent = '0' + h + ':0' + m;
  } else if (m < 10) {
    cas.textContent = h + ':0' + m;
  } else if (h < 10) {
    cas.textContent = '0' + h + ':' + m;
  } else {
    cas.textContent = h + ':' + m;
  }
}
setInterval(time, 1000);

//slide side menu on
function menuOn() {
  document.querySelector('.menu').style.width = '84%';
  document.querySelector('.fa-times').style.display = 'block';
  document.querySelector('.fa-times').style.opacity = '1';
  document.querySelector('.fa-times').style.cursor = 'pointer';
}

//side menu off
function menuOff() {
  document.querySelector('.menu').style.width = '0';
  document.querySelector('.fa-times').style.display = 'none';
}

//slide in window for creating events
function activityWindow() {
  if (counter % 2 == 0) {
    addWindow.style.transform = 'translateY(0)';
    addWindow.style.zIndex = '1';
    addWindow.style.opacity = '1';
    document.querySelector('.add').textContent = 'Close';
    document.querySelector('.modify_event').style.display = 'none';
    document.querySelector('.add_event').style.display = 'block';
    counter++;
    //slide out
  } else if (counter % 2 != 0) {
    addWindow.style.transform = 'translateY(100%)';
    document.querySelector('.add').textContent = 'Add activity';
    addWindow.style.zIndex = '-1';
    addWindow.style.opacity = '0';
    counter++;
    //clear input fields
    document.querySelector('#name').value = '';
    document.querySelector('#desc').value = '';
    document.querySelector('#time').value = '';
  }
}

//slide in window for editing events
function editWindow(element) {
  if (counter % 2 == 0) {
    addWindow.style.transform = 'translateY(0)';
    addWindow.style.zIndex = '1';
    addWindow.style.opacity = '1';
    document.querySelector('.add').textContent = 'Close';
    document.querySelector('.modify_event').style.display = 'block';
    document.querySelector('.add_event').style.display = 'none';
    //fill input values with editing values
    document.querySelector('#name').value =
      element.previousElementSibling.firstElementChild.innerText;
    document.querySelector('#desc').value =
      element.previousElementSibling.firstElementChild.nextElementSibling.innerText;
    document.querySelector('#time').value =
      element.previousElementSibling.firstElementChild.nextElementSibling.nextElementSibling.innerText;
    counter++;
    //slide out
  } else if (counter % 2 != 0) {
    addWindow.style.transform = 'translateY(100%)';
    document.querySelector('.add').textContent = 'Add activity';
    addWindow.style.zIndex = '-1';
    addWindow.style.opacity = '0';
    counter++;
    //clear input fields
    document.querySelector('#name').value = '';
    document.querySelector('#desc').value = '';
    document.querySelector('#time').value = '';
  }
}

//-----------------------EVENT MODIFICATION-----------------------------

//create event
function createTodo() {
  let eventName = document.querySelector('#name').value;
  let eventDesc = document.querySelector('#desc').value;
  let eventTime = document.querySelector('#time').value;
  const div = document.createElement('div');
  const eventObj = {
    name: eventName,
    description: eventDesc,
    time: eventTime,
  };

  //error if empty input field
  if (eventName == '' || eventDesc == '' || eventTime == '') {
    div.className = 'message message_error';
    div.innerText = 'Prosim vyplňte všetky údaje';
    document
      .querySelector('.add_window')
      .insertBefore(div, document.querySelector('#name'));
    setTimeout(function () {
      div.remove();
    }, 2000);
  } else {
    //create local storage array if empty + push
    if (localStorage.getItem(aktualnyDatum) === null) {
      let storedEvents = [];
      storedEvents.push(eventObj);
      localStorage.setItem(aktualnyDatum, JSON.stringify(storedEvents));
      //or modify existing array of events
    } else {
      let storedEvents = JSON.parse(localStorage.getItem(aktualnyDatum));
      storedEvents.push(eventObj);
      //sort by time
      storedEvents.sort((a, b) => a.time - b.time);
      localStorage.setItem(aktualnyDatum, JSON.stringify(storedEvents));
    }

    //push new/modified array of events to dom
    fetchEvents();

    //confirmation message
    div.className = 'message message_confirm';
    div.innerText = 'Udalosť vytvorená';
    document
      .querySelector('.add_window')
      .insertBefore(div, document.querySelector('#name'));
    setTimeout(function () {
      div.remove();
    }, 2000);
    //clear input fields
    document.querySelector('#name').value = '';
    document.querySelector('#desc').value = '';
    document.querySelector('#time').value = '';
  }
}

async function fetchEvents() {
  const data = await axios.get('/api/v1/tasks').then((res) => res.data.tasks);
  bottom.innerHTML = ''

  data.forEach((task) => {
    if (task.day + task.month + task.year == aktualnyDatum) {
        bottom.innerHTML += `<div class="event">
                        <div class="left_bar"></div>
                        <div class="description">
                        <div class="event_title"><p>${task.name}</p></div>
                        <div class="event_description"><p>${task.description}</p></div>
                        </div>
                        <div class="icons">
                            <i class="fas fa-edit"></i>
                            <i class="fas fa-ban"></i>
                        </div>
                        </div>`;
    }
  });
}

//recognision whether to remove or edit event
function modifyEvent(event) {
  //delete event
  if (event.target.classList.contains('fa-ban')) {
    event.target.parentElement.parentElement.remove();
    deleteFromStorage(event);
    //open edit event window
  } else if (event.target.classList.contains('fa-edit')) {
    editWindow(event.target.parentElement);
    //store selected event div (first child) as variable
    eventSelector =
      event.target.parentElement.previousElementSibling.firstElementChild;
  }
}

//remove event from local storage
function deleteFromStorage(event) {
  const name =
    event.target.parentElement.previousElementSibling.firstElementChild
      .innerText;
  const desc =
    event.target.parentElement.previousElementSibling.firstElementChild
      .nextElementSibling.innerText;
  //time in dom format HH:MM
  const time1 =
    event.target.parentElement.previousElementSibling.firstElementChild
      .nextElementSibling.nextElementSibling.innerText;
  //HHMM time format for comparing
  const time = time1.slice(0, 2) + time1.slice(3, time1.length);
  let storedEvents = JSON.parse(localStorage.getItem(aktualnyDatum));

  //remove matching events from dom and local storage
  for (let i = 0; i < storedEvents.length; i++) {
    if (
      name === storedEvents[i].name &&
      desc === storedEvents[i].description &&
      time === storedEvents[i].time
    ) {
      storedEvents.splice([i], 1);
      localStorage.setItem(aktualnyDatum, JSON.stringify(storedEvents));
    }
  }
}

//edit event on storage + push to dom
function modifyStorage(eventSelector) {
  const name = eventSelector.innerText;
  const desc = eventSelector.nextElementSibling.innerText;
  const div = document.createElement('div');
  //time in dom format HH:MM
  const time1 = eventSelector.nextElementSibling.nextElementSibling.innerText;
  //HHMM time format for comparing
  const time = time1.slice(0, 2) + time1.slice(3, time1.length);

  let eventName = document.querySelector('#name').value;
  let eventDesc = document.querySelector('#desc').value;
  let eventTime = document.querySelector('#time').value;

  const eventObj = {
    name: eventName,
    description: eventDesc,
    time: eventTime,
  };

  let storedEvents = JSON.parse(localStorage.getItem(aktualnyDatum));

  for (let i = 0; i < storedEvents.length; i++) {
    //if local storage and dom event value match
    if (
      name === storedEvents[i].name &&
      desc === storedEvents[i].description &&
      time === storedEvents[i].time
    ) {
      //replace existing with modified
      storedEvents.splice([i], 1, eventObj);
      storedEvents.sort((a, b) => a.time - b.time);
      localStorage.setItem(aktualnyDatum, JSON.stringify(storedEvents));
      //replace existing dom with modified events from local storage
      fetchEvents();

      //confirmation notification
      div.className = 'message message_confirm';
      div.innerText = 'Udalosť upravená';
      document
        .querySelector('.add_window')
        .insertBefore(div, document.querySelector('#name'));
      setTimeout(function () {
        div.remove();
      }, 2000);
    }
  }
}

//pass variable for recognision of clicked element to modifystorage()
function modifyTodo() {
  modifyStorage(eventSelector);
}

//--------------------------- CALENDAR -------------------------

currentMonthDiv.textContent = nazovMesiaca[zvolenyMesiac] + ' ' + zvolenyRok;

//calendar toggle
function calendarToggle() {
  if (calendarDropdown == false) {
    datePicker.style.display = 'block';
    calendarDropdown = true;
  } else {
    datePicker.style.display = 'none';
    calendarDropdown = false;
  }
}

function getPocetDni() {
  kalendarneDni.innerHTML = '';
  for (let i = 1; i <= pocetDniMesiaca[zvolenyMesiac]; i++) {
    if (i == zvolenyDen && aktualnyDatum === novyDatum) {
      kalendarneDni.innerHTML += `<div class="calendar_day picked_day">${i}</div>`;
    } else {
      kalendarneDni.innerHTML += '<div class=calendar_day>' + i + '</div>';
    }
  }
  denVKalendari = document.querySelectorAll('.calendar_day');
}

function zvolDen(day, element) {
  if (day.innerText === element.target.innerHTML) {
    zvolenyDen = element.target.innerText;
    vytvorNovyDatum();
    vytvorAktualnyDatum();
    getPocetDni();
    aktualizujZobrazenyDatum();
    fetchEvents();
  }
}

function vytvorNovyDatum() {
  novyDatum =
    zvolenyDen.toString() +
    (zvolenyMesiac + 1).toString() +
    zvolenyRok.toString();
}

function vytvorAktualnyDatum() {
  aktualnyDatum =
    zvolenyDen.toString() +
    (zvolenyMesiac + 1).toString() +
    zvolenyRok.toString();
}

function aktualizujZobrazenyDatum() {
  if (
    dnesnyDen.toString() +
      (dnesnyMesiac + 1).toString() +
      dnesnyRok.toString() ===
    aktualnyDatum
  ) {
    selectedDay.innerText = 'Dnes';
  } else if (zvolenyDen < 10 && zvolenyMesiac < 10) {
    selectedDay.innerText = `0${zvolenyDen}.0${
      zvolenyMesiac + 1
    }.${zvolenyRok} `;
  } else if (zvolenyDen < 10) {
    selectedDay.innerText = `0${zvolenyDen}.${
      zvolenyMesiac + 1
    }.${zvolenyRok} `;
  } else if (zvolenyMesiac < 10) {
    selectedDay.innerText = `${zvolenyDen}.0${
      zvolenyMesiac + 1
    }.${zvolenyRok} `;
  } else {
    selectedDay.innerText = `${zvolenyDen}.${zvolenyMesiac + 1}.${zvolenyRok} `;
  }
}

