class BaseWidget{
    constructor(wrapperElement, initialValue){
        const thisWidget = this;

        thisWidget.dom = {};
        thisWidget.dom.wrapper = wrapperElement;

        thisWidget.value = initialValue;
    }

    setValue(value) {
        const thisWidget = this;
    
        const newValue = thisWidget.parseValue(value);
    
        /* TODO: Add validation */
        if (thisWidget.value !== newValue &&
                    && thisWidget.isValid(value){
                      thisWidget.value = newValue;
                      thisWidget.announce();
        } else {
          thisWidget.renderValue();
        }
    
        thisWidget.renderValue();
      }

      parseValue(value){
        return parseInt(value);
      }
      
      isValid(value){
        const thisWidget = this;

      thisWidget.dom.input.value = thisWidget.value;

      }

      announce() {
        const thisWidget = this;
    
        const event = new CustomEvent('updated', {
          bubbles: true
        });
        thisWidget.dom.wrapper.dispatchEvent(event);
      }
}

export default BaseWidget;