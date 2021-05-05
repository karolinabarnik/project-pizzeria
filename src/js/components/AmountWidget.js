import {
    settings,
    select
} from '../settings.js';
import BaseWidget from './BaseWidget.js';

class AmountWidget extends BaseWidget {
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

        const newValue = thisWidget.parseValue(value);

        /* TODO: Add validation */
        if (thisWidget.value !== newValue && thisWidget.isValid(newValue) {

                thisWidget.value = newValue;
                thisWidget.dom.input.value = thisWidget.value;
                thisWidget.announce();
            } else {
                thisWidget.dom.input.value = thisWidget.value;
            }
        }
        parseValue(value) {
            return parseInt(value);
        }
        isValid(value) {
            return !isNaN(value) &&
                value >= settings.amountWidget.defaultMin &&
                value <= settings.amountWidget.defaultMax);

    }

    initActions() {
        const thisWidget = this;

        thisWidget.dom.input.addEventListener('change', function (event) {
            thisWidget.setValue(thisWidget.dom.input.value);
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
        thisWidget.element.dispatchEvent(event);
    }


}
