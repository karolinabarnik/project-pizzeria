/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
    'use strict';

    const select = {
        templateOf: {
            menuProduct: '#template-menu-product',
        },
        containerOf: {
            menu: '#product-list',
            cart: '#cart',
        },
        all: {
            menuProducts: '#product-list > .product',
            menuProductsActive: '#product-list > .product.active',
            formInputs: 'input, select',
        },
        menuProduct: {
            clickable: '.product__header',
            activeProduct: '.product.active',
            form: '.product__order',
            priceElem: '.product__total-price .price',
            imageWrapper: '.product__images',
            amountWidget: '.widget-amount',
            cartButton: '[href="#add-to-cart"]',
        },
        widgets: {
            amount: {
                input: 'input.amount',
                linkDecrease: 'a[href="#less"]',
                linkIncrease: 'a[href="#more"]',
            },
        },
        // CODE ADDED START
        cart: {
            productList: '.cart__order-summary',
            toggleTrigger: '.cart__summary',
            totalNumber: `.cart__total-number`,
            totalPrice: '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
            subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
            deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
            form: '.cart__order',
            formSubmit: '.cart__order [type="submit"]',
            phone: '[name="phone"]',
            address: '[name="address"]',
        },
        cartProduct: {
            amountWidget: '.widget-amount',
            price: '.cart__product-price',
            edit: '[href="#edit"]',
            remove: '[href="#remove"]',
        },
        // CODE ADDED END
    };

    const classNames = {
        menuProduct: {
            wrapperActive: 'active',
            imageVisible: 'active',
        },
        // CODE ADDED START
        cart: {
            wrapperActive: 'active',
        },
        // CODE ADDED END
    };

    const settings = {
        amountWidget: {
            defaultValue: 1,
            defaultMin: 1,
            defaultMax: 9,
        }, // CODE CHANGED
        // CODE ADDED START
        cart: {
            defaultDeliveryFee: 20,
        },
        // CODE ADDED END
    };

    const templates = {
        menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
        // CODE ADDED START
        //cartProduct: Handlebars.compile(document.querySelector(select.templateOf.cartProduct).innerHTML),
        // CODE ADDED END
    };

    class AmountWidget {
        constructor(element) {
            const thisWidget = this;

            thisWidget.getElements(element);
            if (thisWidget.input.value) thisWidget.setValue(thisWidget.input.value);
            else thisWidget.setValue(settings.amountWidget.defaultValue);

            thisWidget.initActions();
        }

        getElements(element) {
            const thisWidget = this;

            thisWidget.element = element;
            thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
            thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
            thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
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
                thisWidget.input.value = thisWidget.value;
                thisWidget.announce();
            } else {
                thisWidget.input.value = thisWidget.value;
            }
        }


        initActions() {
            const thisWidget = this;

            thisWidget.input.addEventListener('change', function (event) {
                thisWidget.setValue(event.target.value);
            });
            thisWidget.linkDecrease.addEventListener('click', function () {
                thisWidget.setValue(thisWidget.value - 1);
            });
            thisWidget.linkIncrease.addEventListener('click', function () {
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

    class Cart {
        constructor(element) {
            const thisCart = this;

            thisCart.products = [];

            thisCart.getElements(element);

            thisCart.initActions();

            console.log('new Cart', thisCart);
        };


        getElements(element) {
            const thisCart = this;

            thisCart.dom = {};

            thisCart.dom.wrapper = element;

            thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
            thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
            thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
            thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subtotalPrice);
            thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
            thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);


        }

        initActions() {
            const thisCart = this;

            thisCart.dom.toggleTrigger.addEventListener('click', function () {
                thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);

            });
        }
        add(menuProduct) {
            const thisCart = this;
            console.log('adding product', menuProduct);

            /*generate HTML based on template*/

            const generatedHTML = templates.cartProduct(menuProduct);

            /*create element using utils.createElementFromHTML*/

            const generatedDOM = utils.createDOMFromHTML(generatedHTML);

            /*add element to menu*/

            thisCart.dom.productList.appendChild(generatedDOM);
            thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
            thisCart.update();

        }

        update() {
            const thisCart = this;
            const deliveryFee = settings.cart.defaultDeliveryFee;
            const totalNumber = 0;
            const subtotalPrice = 0;
            for (let product of thisCart.products) {
                thisCart.totalNumber += product.amount;
                thisCart.subtotalPrice += product.price;
            }
            thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;

            if (product.totalNumber !== 0) {
                thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
            } else {
                thisCart.deliveryFee = 0;
            }


            thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
            thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
            thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
            thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;
        }
    }




    class CartProduct {
        constructor(menuProduct, element) {
            const thisCartProduct = this;

            thisCartProduct.id = menuProduct.id;
            thisCartProduct.amount = menuProduct.amount;
            thisCartProduct.price = menuProduct.price;
            thisCartProduct.getElements(element);
            thisCartProduct.amountWidget(element);
            console.log('thisCartProduct', thisCartProduct);
        }

        getElements(element) {
            const thisCartProduct = this;
            thisCartProduct.dom = {};
            thisCartProduct.dom.wrapper(element);
            thisCartProduct.dom.querySelector(select.cartProduct.amountWidget);
            thisCartProduct.dom.querySelector(select.cartProduct.price);
            thisCartProduct.dom.querySelector(select.cartProduct.edit);
            thisCartProduct.dom.querySelector(select.cartProduct.remove);
        }

        amountWidget(element) {
            const thisCartProduct = this;

            thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
            thisCartProduct.dom.amountWidget.addEventListener('updated', function () {
                thisCartProduct.amount = thisCartProduct.amountWidget.value;
                thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amountWidget.value;
                thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
            });
        }
    }

    const app = {
        initMenu: function () {
            const thisApp = this;
            console.log('thisApp.data', thisApp.data)
            for (let productData in thisApp.data.products) {
                new Product(productData, thisApp.data.products[productData]);
            }
        },

        initData: function () {
            const thisApp = this;

            thisApp.data = dataSource;
        },

        init: function () {
            const thisApp = this;
            console.log('*** App starting ***');
            console.log('thisApp:', thisApp);
            console.log('classNames:', classNames);
            console.log('settings:', settings);
            console.log('templates:', templates);


            thisApp.initData();
            thisApp.initMenu();
            thisApp.initCart();

        },

        initCart: function () {
            const thisApp = this;

            const cartElem = document.querySelector(select.containerOf.cart);
            thisApp.cart = new Cart(cartElem);
        },
    };


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
                console.log("Sprawdzam kategorię", paramId, param);

                // for every option in this category
                for (let optionId in param.options) {

                    // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
                    const option = param.options[optionId];
                    console.log("Sprawdzam opcję", optionId, option);

                    // find image for given option e.g. .tomato-suace
                    const optionImage = thisProduct.element.querySelector('.' + paramId + '-' + optionId);

                    // check if there is param with a name of paramId in formData and if it includes optionId
                    if (formData[paramId] && formData[paramId].includes(optionId)) {
                        console.log("Ustaliłem, że opcja ta jest wybrana")
                        // check if the option is not default
                        if (!option.default) {
                            console.log("To opcja dodatkowa, więc zwiększam cenę")
                            price = price + option.price
                        }

                        if (optionImage) optionImage.classList.add('active');
                    } else {
                        console.log("Ustaliłem, że opcja nie jest wybrana")
                        // check if the option is default
                        if (option.default) {
                            console.log("To opcja domyślna, więc zmniejszam cenę")
                            // reduce price variable
                            price = price - option.price
                        }
                        if (optionImage) optionImage.classList.remove('active');
                    }


                }

            }

            /*multiply price by amount*/
            price *= thisProduct.amountWidget.value;

            /*  assign the same value as price to priceSingle */

            thisProduct.priceSingle = price;

            // update calculated price in the HTML
            thisProduct.priceElem.innerHTML = price;
        }

        addToCart() {
            const thisProduct = this;

            app.cart.add(thisProduct);

            //  thisApp.cart.add(thisProduct.prepareCartProduct);



        };

        prepareCartProduct() {
            const thisProduct = this;

            const productSummary = {
                id: thisProduct.id,
                name: thisProduct.data.name,
                amount: thisProduct.amountWidget.value,
                priceSingle: thisProduct.priceSingle,
                price: thisProduct.priceSingle * thisProduct.amountWidget.value,
                params: thisProduct.prepareCartProductParams,

            };
            return productSummary;

        }

        prepareCartProductParams() {
            const thisProduct = this;

            /* convert form to object structure e.g. {sauce: ['tomato'], toppings: ['olives', 'redPeppers']} */
            const formData = utils.serializeFormToObject(thisProduct.form);
            console.log('formData', formData)

            //new empty object
            const params = {};

            // for every category (param)...
            for (let paramId in thisProduct.data.params) {

                // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
                const param = thisProduct.data.params[paramId];
                console.log("Sprawdzam kategorię", paramId, param);

                // create category param in params const eg. params = { ingredients: { name: 'Ingredients', options: {}}}
                params[paramId] = {
                    name: param.label,
                    options: {}
                }


                // for every option in this category
                for (let optionId in param.options) {

                    // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
                    const option = param.options[optionId];
                    console.log("Sprawdzam opcję", optionId, option);

                    const optionSelected = formData[paramId] && formData[paramId].includes(optionId);

                    if (optionSelected) {
                        //option is selected
                        params[paramId].options = option.name;
                    }

                }

            }

            return params;
        }
    }



    app.init();

}
