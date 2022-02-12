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
document.querySelector('.modify_event').addEventListener('click', modifyTask);
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
  const taskID = element.parentElement.id
  addWindow.id = taskID
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
  const div = document.createElement('div');
  const month = zvolenyMesiac + 1;
  const eventObj = {
    name: eventName,
    description: eventDesc,
    day: zvolenyDen,
    month: month,
    year: zvolenyRok,
  };

  //error if empty input field
  if (eventName == '' || eventDesc == '') {
    div.className = 'message message_error';
    div.innerText = 'Prosim vyplňte všetky údaje';
    document
      .querySelector('.add_window')
      .insertBefore(div, document.querySelector('#name'));
    setTimeout(function () {
      div.remove();
    }, 2000);
  } else {
    axios.post('/api/v1/tasks', eventObj)
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
  }
}

async function fetchEvents() {
  const data = await axios.get('/api/v1/tasks').then((res) => res.data.tasks);
  bottom.innerHTML = ''

  data.forEach((task) => {
    if (task.day + task.month + task.year == aktualnyDatum) {
        bottom.innerHTML += `<div class="event" id=${task._id}>
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
    deleteTask(event);
    //open edit event window
  } else if (event.target.classList.contains('fa-edit')) {
    editWindow(event.target.parentElement);
  }
}

//remove event from local storage
function deleteTask(event) {
  const taskID =
    event.target.parentElement.parentElement.id;

    axios.delete(`/api/v1/tasks/${taskID}`)
    fetchEvents()
}

//edit event on storage + push to dom
function modifyTask(event) {
  const div = document.createElement('div');
  const taskID =
  event.target.parentElement.id

  let eventName = document.querySelector('#name').value;
  let eventDesc = document.querySelector('#desc').value;

  const eventObj = {
    name: eventName,
    description: eventDesc,
  };

  axios.patch(`/api/v1/tasks/${taskID}`, eventObj)

        //confirmation notification
        div.className = 'message message_confirm';
        div.innerText = 'Udalosť upravená';
        document
          .querySelector('.add_window')
          .insertBefore(div, document.querySelector('#name'));
        setTimeout(function () {
          div.remove();
        }, 2000)

        fetchEvents();
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

