import { templates, select, classNames } from './../settings.js';
import AmountWidget from './AmountWidget.js';

class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.selectedTable = null;
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
  }
}

export default Booking;
