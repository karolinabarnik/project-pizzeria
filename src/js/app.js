/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
    'use strict';

  

 

    

   

    const app = {
        initMenu: function () {
            const thisApp = this;
            console.log('thisApp.data', thisApp.data)
            for (let productData in thisApp.data.products) {
                new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);

            }
        },

        initData: function () {
            const thisApp = this;

            thisApp.data = {};
            const url = settings.db.url + '/' + settings.db.product;
            fetch(url)
                .then(function (rawResponse) {
                    return rawResponse.json();
                })
                .then(function (parsedResponse) {
                    console.log('parsedResponse', parsedResponse);

                    /*save parsedResponse at this.App.data.products */
                    thisApp.data.products = parsedResponse

                    /*execute initMenu method */
                    thisApp.initMenu();
                });
            console.log('thisApp.data', JSON.stringify(thisApp.data));
        },

        init: function () {
            const thisApp = this;
            console.log('*** App starting ***');
            console.log('thisApp:', thisApp);
            console.log('classNames:', classNames);
            console.log('settings:', settings);
            console.log('templates:', templates);


            thisApp.initData();
            thisApp.initCart();

        },

        initCart: function () {
            const thisApp = this;

            const cartElem = document.querySelector(select.containerOf.cart);
            thisApp.cart = new Cart(cartElem);
        },
    };


    app.init();
}
