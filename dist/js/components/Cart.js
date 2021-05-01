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
           thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
           thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
           thisCart.dom.adress = thisCart.dom.wrapper.querySelector(select.cart.address);


       }

       initActions() {
           const thisCart = this;

           thisCart.dom.toggleTrigger.addEventListener('click', function () {
               thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);

           });
           thisCart.dom.productList.addEventListener('updated', function () {
               thisCart.update();
           });
           thisCart.dom.productList.addEventListener('remove', function (event) {
               thisCart.remove(event.detail.cartProduct);

           });
           thisCart.dom.form.addEventListener('submit', function (event) {
               event.preventDefault();
               thisCart.sendOrder();
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
           thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
           thisCart.totalNumber = 0;
           thisCart.subtotalPrice = 0;
           thisCart.totalPrice = 0;

           for (let product of thisCart.products) {
               thisCart.totalNumber += product.amount;
               thisCart.subtotalPrice += product.price;
           }

           if (thisCart.products.length > 0) {
               thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;
           } else {
               thisCart.deliveryFee = 0;
           }


           thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
           thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
           thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;

           for (const elem of thisCart.dom.totalPrice) {
               elem.innerHTML = thisCart.totalPrice;
           }

       }
       remove(cartProduct) {
           const thisCart = this;
           cartProduct.dom.wrapper.remove();

           const index = thisCart.products.indexOf(cartProduct);
           const thisCartRemove = thisCart.products.splice(index, 1);


           thisCart.update();
       }
       sendOrder() {
           const thisCart = this;
           const url = settings.db.url + '/' + settings.db.order;
           const payload = {
               adress: thisCart.dom.adress.value,
               phone: thisCart.dom.phone.value,
               totalPrice: thisCart.totalPrice,
               subTotalPrice: thisCart.subtotalPrice,
               deliveryFee: thisCart.deliveryFee,
               products: [],
           }

           for (let prod of thisCart.products) {
               payload.products.push(prod.getData());
           }
           const options = {
               method: 'POST',
               headers: {
                   'Content-Type': 'application/json',
               },
               body: JSON.stringify(payload),
           };

           fetch(url, options);
       }

   }

   export default Cart;
