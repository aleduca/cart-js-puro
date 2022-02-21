const books = [
    {
        id:1,
        name:'Book1',
        price: 49.90
    },
    {
        id:2,
        name:'Book2',
        price:100.00
    },
    {
        id:3,
        name:'Book3',
        price:97.45
    }
];

function render(){
    let productsHtml = '';
    books.forEach(product => {

        const isInCart = productIsInCart(product.id);
    
        let cartStatus = (isInCart) ? 'in cart' : 'not in cart';
        productsHtml+= `
            <div>
                ${product.name} | <a href="#" class="products" id="${product.id}">
                    Add to cart 
                </a>
                | ${cartStatus}
                | ${formatPrice(product.price)}
                | <a href="" class="products_remove" id="${product.id}">Remove</a>
            </div>
        `
    });
    
    productsList.innerHTML = productsHtml;

    clickAndAddToCart();
}


function formatPrice(price){
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(price);
}

function clickAndAddToCart(){

    const allProducts = document.querySelectorAll('.products');

    allProducts.forEach(product => {
        product.addEventListener('click', function(event)  {
            event.preventDefault();
            const id = event.target.getAttribute('id');
            addProductToCart(getProduct(id));
        });
    });
}

function productIsInCart(id){
    const products = JSON.parse(localStorage.getItem('products'));
    if(products){
        return products.find((product) => {
            return product.id == id;
        })
    }

    return false;
}

function getProduct(id){
    return books.find((product) => {
        return product.id == id;
    })
}

function addProductToCart(productToAdd){
    // if exist in localstorage add qty
    const products = localStorage.getItem('products');

    let price;
    let qtyToAdd = 1;

    if(products){
        const productsInStorage = JSON.parse(products);
        const productFoundInCart = productsInStorage.find((product,index) => {
            if(product.id == productToAdd.id){
                productsInStorage.splice(index,1);
                return product;
            }
        });
 
        if(productFoundInCart){
            qtyToAdd = productFoundInCart['qty']+=1;
            price = productFoundInCart.price + productToAdd.price;
        }else{
            qtyToAdd = 1;
            price = productToAdd.price;
        }

        localStorage.setItem('products',JSON.stringify([...productsInStorage,{...productToAdd,qty:qtyToAdd,price}]));

    }else{
        localStorage.setItem('products', JSON.stringify([{...productToAdd, qty:1}]));
    }

    render();
    totalPriceInCart();
}


function totalPriceInCart(){
    const products = localStorage.getItem('products');

    if(products){
        const productsInStorage = JSON.parse(products);
        const total = productsInStorage.reduce((acc, value) => {
            return acc + value.price;
        },0);
        cartTotal.textContent = 'Total: '+formatPrice(total);
    } else{
        return 0;
    }
}

render();
totalPriceInCart();