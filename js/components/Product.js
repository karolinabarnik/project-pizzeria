import { select, templates } from './../settings.js';
import utils from './../utils.js';
import AmountWidget from './AmountWidget.js';

class Product {
  constructor(id, data) {
    const thisProduct = this;

    thisProduct.id = id;
    thisProduct.data = data;

    thisProduct.renderInMenu();
    thisProduct.getElements();
    thisProduct.initAccordion();
    thisProduct.initOrderForm();
    thisProduct.initAmountWidget();
    thisProduct.processOrder();

    console.log('new Product:',
      thisProduct);
  }

  renderInMenu() {
    const thisProduct = this;

    /*generate HTML based on template*/

    const generateHTML = templates.menuProduct(thisProduct.data);

    /*create element using utils.createElementFromHTML*/

    thisProduct.element = utils.createDOMFromHTML(generateHTML);

    /*find menu container*/

    const menuContainer = document.querySelector(select.containerOf.menu);

    /*add element to menu*/

    menuContainer.appendChild(thisProduct.element);
  }

  getElements() {
    const thisProduct = this;

    thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
    thisProduct.form = thisProduct.element.querySelector(select.menuProduct.form);
    thisProduct.formInputs = thisProduct.form.querySelectorAll(select.all.formInputs);
    thisProduct.cartButton = thisProduct.element.querySelector(select.menuProduct.cartButton);
    thisProduct.priceElem = thisProduct.element.querySelector(select.menuProduct.priceElem);
    thisProduct.amountWidgetElem = thisProduct.element.querySelector(select.menuProduct.amountWidget);





  }
  initAccordion() {
    const thisProduct = this;

    /* find the clickable trigger (the element that should react to clicking) */
    const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);

    /* START: add event listener to clickable trigger on event click */
    /* hisProduct.accordionTrigger.*/
    clickableTrigger.addEventListener('click', function (event) {


      /* prevent default action for event */

      event.preventDefault();
      /* find active product (product that has active class) */
      const activeProduct = document.querySelector(select.menuProduct.activeProduct);

      /* if there is active product and it's not thisProduct.element, remove class active from it */

      if (activeProduct && activeProduct != thisProduct.element) {
        activeProduct.classList.remove('active');
      }

      /* toggle active class on thisProduct.element */

      thisProduct.element.classList.toggle('active');

    });

  }
  initOrderForm() {
    const thisProduct = this;
    console.log('initOrderForm');
    thisProduct.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
    });

    for (let input of thisProduct.formInputs) {
      input.addEventListener('change', function () {
        thisProduct.processOrder();
      });
    }

    thisProduct.cartButton.addEventListener('click', function (event) {
      event.preventDefault();
      thisProduct.processOrder();
      thisProduct.addToCart();
    });
  }
  initAmountWidget() {
    const thisProduct = this;

    thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
    thisProduct.amountWidgetElem.addEventListener('updated', function () {
      thisProduct.processOrder();
    });

  }

  processOrder() {
    const thisProduct = this;
    console.log('processOrder');

    /* convert form to object structure e.g. {sauce: ['tomato'], toppings: ['olives', 'redPeppers']} */
    const formData = utils.serializeFormToObject(thisProduct.form);
    console.log('formData', formData);

    // set price to default price
    let price = thisProduct.data.price;

    // for every category (param)...
    for (let paramId in thisProduct.data.params) {

      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];
      console.log('Sprawdzam kategorię', paramId, param);

      // for every option in this category
      for (let optionId in param.options) {

        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const option = param.options[optionId];
        console.log('Sprawdzam opcję', optionId, option);

        // find image for given option e.g. .tomato-suace
        const optionImage = thisProduct.element.querySelector('.' + paramId + '-' + optionId);

        // check if there is param with a name of paramId in formData and if it includes optionId
        if (formData[paramId] && formData[paramId].includes(optionId)) {
          console.log('Ustaliłem, że opcja ta jest wybrana');
          // check if the option is not default
          if (!option.default) {
            console.log('To opcja dodatkowa, więc zwiększam cenę');
            price = price + option.price;
          }

          if (optionImage) optionImage.classList.add('active');
        } else {
          console.log('Ustaliłem, że opcja nie jest wybrana');
          // check if the option is default
          if (option.default) {
            console.log('To opcja domyślna, więc zmniejszam cenę');
            // reduce price variable
            price = price - option.price;
          }
          if (optionImage) optionImage.classList.remove('active');
        }


      }

    }

    /*  assign the same value as price to priceSingle */
    thisProduct.priceSingle = price;

    /*multiply price by amount*/
    price *= thisProduct.amountWidget.value;

    // update calculated price in the HTML
    thisProduct.priceElem.innerHTML = price;
  }

  addToCart() {
    const thisProduct = this;

    //app.cart.add(thisProduct.prepareCartProduct());

    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      detail: {
        product: thisProduct.prepareCartProduct()
      },
    });
    thisProduct.element.dispatchEvent(event);
  }

  prepareCartProduct() {
    const thisProduct = this;

    const productSummary = {
      id: thisProduct.id,
      name: thisProduct.data.name,
      amount: thisProduct.amountWidget.value,
      priceSingle: thisProduct.priceSingle,
      price: thisProduct.priceSingle * thisProduct.amountWidget.value,
      params: thisProduct.prepareCartProductParams(),

    };
    return productSummary;

  }

  prepareCartProductParams() {
    const thisProduct = this;

    /* convert form to object structure e.g. {sauce: ['tomato'], toppings: ['olives', 'redPeppers']} */
    const formData = utils.serializeFormToObject(thisProduct.form);
    console.log('formData', formData);

    //new empty object
    const params = {};

    // for every category (param)...
    for (let paramId in thisProduct.data.params) {

      // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
      const param = thisProduct.data.params[paramId];
      console.log('Sprawdzam kategorię', paramId, param);

      // create category param in params const eg. params = { ingredients: { name: 'Ingredients', options: {}}}
      params[paramId] = {
        label: param.label,
        options: {}
      };


      // for every option in this category
      for (let optionId in param.options) {

        // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
        const option = param.options[optionId];
        console.log('Sprawdzam opcję', optionId, option);

        const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

        if (optionSelected) {
          //option is selected
          params[paramId].options[optionId] = option.label;
        }

      }

    }

    return params;
  }



}

export default Product;
