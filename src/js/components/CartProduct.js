class CartProduct {
        constructor(menuProduct, element) {
            const thisCartProduct = this;

            thisCartProduct.id = menuProduct.id;
            thisCartProduct.amount = menuProduct.amount;
            thisCartProduct.price = menuProduct.price;
            thisCartProduct.getElements(element);
            thisCartProduct.initAmountWidget(element);
            thisCartProduct.initActions();
            console.log('thisCartProduct', thisCartProduct);
        }

        getElements(element) {
            const thisCartProduct = this;
            thisCartProduct.dom = {};
            thisCartProduct.dom.wrapper = element;
            thisCartProduct.dom.amountWidget = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.amountWidget);
            thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.price);
            thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.edit);
            thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(select.cartProduct.remove);
        }

        initAmountWidget(element) {
            const thisCartProduct = this;
            const event = new CustomEvent('updated', {
                bubbles: true

            });

            thisCartProduct.amountWidget = new AmountWidget(thisCartProduct.dom.amountWidget);
            thisCartProduct.dom.amountWidget.addEventListener('updated', function () {
                thisCartProduct.amount = thisCartProduct.amountWidget.value;
                thisCartProduct.price = thisCartProduct.priceSingle * thisCartProduct.amountWidget.value;
                thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
            });
        }

        remove() {
            const thisCartProduct = this;

            const event = new CustomEvent('remove', {
                bubbles: true,
                detail: {
                    cartProduct: thisCartProduct,
                },
            });
            thisCartProduct.dom.wrapper.dispatchEvent(event);
        }

        initActions() {
            const thisCartProduct = this;
            thisCartProduct.dom.edit.addEventListener('click', function () {});
            thisCartProduct.dom.remove.addEventListener('click', function () {
                thisCartProduct.remove();
            });


        }
        getData() {
            const thisCartProduct = this;

            const prepareCartProducts = {
                id: thisCartProduct.id,
                name: thisCartProduct.name,
                amount: thisCartProduct.amountWidget.value,
                priceSingle: thisCartProduct.priceSingle,
                price: thisCartProduct.priceSingle * thisCartProduct.amountWidget.value,
                params: thisCartProduct.params

            };
            return prepareCartProducts

        }

    }