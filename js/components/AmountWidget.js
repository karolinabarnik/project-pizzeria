import { settings, select } from './../settings.js';
import BaseWidget from './BaseWidget.js';
class AmountWidget extends BaseWidget{
  constructor(element) {
    super(element, settings.amountWidget.defaultValue);

    const thisWidget = this;

    thisWidget.getElements(element);

    thisWidget.initActions();
  }

  getElements() {
    const thisWidget = this;

    
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }
  setValue(value) {
    const thisWidget = this;

    const newValue = parseInt(value);

    /* TODO: Add validation */
    if (thisWidget.value !== newValue &&
                !isNaN(newValue) &&
                newValue >= settings.amountWidget.defaultMin &&
                newValue <= settings.amountWidget.defaultMax) {

      thisWidget.value = newValue;
      thisWidget.announce();
    } else {
      thisWidget.renderValue();
    }

    parseValue(value){
      return parseInt(value);
    }
    
    isValid(value){
      return !isNaN(value)
      && value >= settings.amountWidget.defaultMin 
      && value <= settings.amountWidget
    }

    renderValue(){
      const thisWidget = this;
      thisWidget.dom.input.value = thisWidget.value;

    }
  }


  initActions() {
    const thisWidget = this;

    thisWidget.dom.input.addEventListener('change', function (event) {
      thisWidget.setValue(event.target.value);
    });
    thisWidget.dom.linkDecrease.addEventListener('click', function () {
      thisWidget.setValue(thisWidget.value - 1);
    });
    thisWidget.dom.linkIncrease.addEventListener('click', function () {
      thisWidget.setValue(thisWidget.value + 1);
    });
  }

  announce() {
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }


}

export default AmountWidget;