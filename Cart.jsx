import React, { useEffect } from "react";
import classes from '../../css/Cart.css'

import InCartProd from "./InCartProd";

function Cart({permit, prods, closeCart, remove, requant}){

    useEffect(() => {
        if(permit === true){
            function handlePopstate(e){
                e.preventDefault()
                console.log('Кнопка "назад" была нажата');
                closeCart(false)
            };
        
            window.addEventListener('popstate', handlePopstate);
        
            return () => {
                window.removeEventListener('popstate', handlePopstate);
            };
        }
    }, [permit]);

    useEffect(() => {
        var elem = document.getElementById('cart')
        if(permit){
            elem.style.right = '0px'
            document.getElementsByTagName('main')[0].style.height = (window.innerHeight - 60) + 'px';
            document.getElementsByTagName('main')[0].style.overflow = 'hidden'
            document.getElementsByTagName('footer')[0].style.display = 'none'
        }else{
            elem.style.right = '-100%'
            document.getElementsByTagName('main')[0].style.height = '100%';
            document.getElementsByTagName('main')[0].style.overflow = 'scroll'
            document.getElementsByTagName('footer')[0].style.display = 'block'
        }
    }, [permit])

    return(
        <div className="cart_window" id='cart'>
            <div id="close_cart" onClick={() => {closeCart(false)}}>X</div>
            <h1 className="cart_h1">Корзина:</h1>
            {prods.map((prod) =>
                <InCartProd prod={prod} remove={remove} requant={requant}/>
            )}
        </div>
    )
}

export default Cart;