import React, { useEffect, useState } from "react";
import OutsideClickHandler from 'react-outside-click-handler';
import classes from '../../../css/Cart.css'
import { Link } from "react-router-dom";

import InCartProd from "../StackItems/InCartProd";
import BlackBut from "../../UI/BlackBut/BlackBut";

function Cart({SRVRADDRESS, permit, prods, closeCart, remove, requant}){
    const[cartProds, setCartProds] = useState(prods);
    useEffect(() => {
        setCartProds(prods)
    }, [prods])

    function outsideHandle(){
        if(permit){
            closeCart(false)
        }
    }

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
            document.getElementById('to_hide').style.overflow = 'hidden'
        }else{
            elem.style.right = '-101%'
            document.getElementById('to_hide').style.overflow = 'scroll'
        }
    }, [permit])

    return(
        <OutsideClickHandler onOutsideClick={() => outsideHandle()}>
            <div className="cart_window" id='cart'>
                <div id="close_cart" onClick={() => {closeCart(false)}}></div>
                <h1 className="cart_h1">Корзина:</h1>
                <div className="incart_prod_part">
                    {cartProds.length !== 0
                        ?cartProds.map((prod) =>
                            <InCartProd prod={prod} remove={remove} requant={requant} SRVRADDRESS={SRVRADDRESS}/>
                        )
                        :<h2>Начните свои покупки!</h2>
                    }
                </div>

                {prods[0] !== undefined
                    ?<Link to='/order' onClick={() => {closeCart(false)}}><BlackBut>К ОФОРМЛЕНИЮ</BlackBut></Link>
                    :<></>
                }
            </div>
        </OutsideClickHandler>
    )
}

export default Cart;