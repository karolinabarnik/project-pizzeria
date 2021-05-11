import { templates, select, classNames, settings } from './../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import datePicker from './DatePicker.js';
import hourPicker from './HourPicker.js';

class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.selectedTable = null;
    thisBooking.getData();

  }
  getData(){
    const thisBooking = this;
    
const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate)
const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate),
    params = {
      booking: [
        startDateParam,
        endDateParam,
        ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],

    }
    
    const urls = {
      bookings:         settings.db.url + '/' + settings.db.bookings
                                       + '?' + params.bookings.join('&'),
      eventsCurrent:   settings.db.url + '/' + settings.db.events 
                                       + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:    settings.db.url + '/' + settings.db.events 
                                       + '?' + params.eventsRepeat.join('&'),
    };
Promise.all([
  fetch(urls.bookings)
  fetch(urls.eventsCurrent)
  fetch(urls.eventsRepeat) 
])
 .then(function(allResponses){
   const bookingsResponse = allResponses[0];
   const eventsCurrentResponse = allResponses[1];
   const eventsRepeatResponse = allResponses[2];
    return Promise.all([ 
      bookingsResponse.json();
      eventsCurrentResponse.json();
      eventsRepeatResponse.json();
    ]})
    .then(function([bookiings, eventsCurrent, eventsRepeat]) {
    });
  }

  render(element) {
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.floorPlan = thisBooking.dom.wrapper.querySelector(select.booking.floorPlan);
    thisWidget.dom.hourPicker = thisWidget.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisWidget.dom.datePicker = thisWidget.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
  }

  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new datePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new hourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.floorPlan.addEventListener('click', function(event) {
      if(event.target.classList.contains(classNames.booking.table)) {
        thisBooking.selectTable(event.target);
      }
    });

  }

  selectTable(table) {
    const thisBooking = this;

    table.classList.add(classNames.booking.tableChosen);
    thisBooking.selectedTable = parseInt(table.getAttribute('data-table'));
   
    for(let table of thisBooking.floorPlan) {
      table.addEventListener('click', function (event) {
        event.preventDefault();
        if (table.classList.contains('booked')) {
          alert('Please choose different table, this one is not available');
        } else {
          const tableId = parseInt(table.getAttribute(settings.booking.tableIdAttribute));
          thisBooking.selectTable === tableId;
          if (thisBooking.selectTable) {
            thisBooking.removeSelected();
          } else {
            table.classList.add(classNames.booking.tableChosen);
            thisBooking.tableChosen = tableId;
             }
          }
        });
      }
  }
removeSelected(){
  const thisBooking = this;
  const chosenTables = document.querySelectorAll('.table-chosen');

  for (let chosen of chosenTables) {
    chosen.classList.remove(classNames.booking.tableChosen);
  } delete thisBooking.chosenTables;
  }
  
 
}

export default Booking;
