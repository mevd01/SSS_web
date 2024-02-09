import React, { useEffect, useState } from "react";
import classes from '../../../css/InCartProd.css'

function InCartProd({SRVRADDRESS, ...props}){
    const[availQuant, setAvailQuant] = useState(props.prod.quant)
    const[price, setPrice] = useState(props.prod.price.replace(' ', ''))
    const[availPrice, setAvailPrice] = useState(0)
    const[imgSrc, setImgSrc] = useState('');

    useEffect(() => {
        if(availQuant != 1){
            setAvailPrice(Number(price) * Number(availQuant))
        }else{
            setAvailPrice(Number(price))
        }
    }, [availQuant])

    useEffect(() => {
        fetch(SRVRADDRESS, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ oper: 'get_photo_by_tov_id', id:props.prod.id, num:-1})
        })
        .then(response => response.blob())
        .then(blob => {
            setImgSrc(URL.createObjectURL(blob));
        });
    }, [props.prod.id])

    function ChengeQuant(operation){
        props.requant(operation, props.prod)

        if(operation === 'minus' && availQuant > 1){
            if(availQuant-1 === 1){
                document.getElementById('minus').className = 'del'
                document.getElementById('minus').innerHTML = ''
            }

            setAvailQuant(availQuant - 1)
        }else if(operation === 'plus'){
            if(availQuant === 1){
                document.getElementById('minus').className = ''
                document.getElementById('minus').innerHTML = '-'
            }

            setAvailQuant(availQuant + 1)
        }else if(operation === 'minus' && availQuant == 1){
            props.remove(props.prod)
        }
    }
    return(
        <div className="inCartProd">
            <div className="cart_prod_main_info">
                <div className="cart_template">
                    <img src={imgSrc}/>
                </div>
                <div className="cart_right_text">
                    <div className="cart_name">{props.prod.name}</div>
                    <div className="quant_menu">
                        <div className="del" id="minus" onClick={() => {ChengeQuant('minus')}}></div>
                        <div id="quant">{availQuant}</div>
                        <div id="plus" onClick={() => {ChengeQuant('plus')}}>+</div>
                    </div>
                </div>
            </div>
            <div className="cart_prod_info">
            <div className="cart_size">{'Размер: ' + props.prod.size}</div>
                <div className="cart_price">{availPrice + '₽'}</div>
            </div>
        </div>
    )
}

export default InCartProd;