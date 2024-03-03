import React, { useEffect, useState } from "react";
import classes from '../../../css/OrderProd.css'
import axios from "axios";
import { Link } from "react-router-dom";

function OrderProd({SRVRADDRESS, callCost, ...props}){
    const[price, setPrice] = useState('');


    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }


    useEffect(() => {
        async function getPrice(){
            let response = await axios.post(SRVRADDRESS, {oper:'get_cost_by_id_and_size', id:props.prod.id, size:props.prod.size, mail:getCookie('user')});
            setPrice(response.data['cost'])
        }
        getPrice();
    }, [])
    useEffect(() => {
        async function getPrice(){
            let response = await axios.post(SRVRADDRESS, {oper:'get_cost_by_id_and_size', id:props.prod.id, size:props.prod.size, mail:getCookie('user')});
            setPrice(response.data['cost'])
        }
        getPrice();
    }, [props.prod])

    return(
        <Link to={'/product?art=' + props.prod.id}>
            <div className="OrderProd">
                <div className="order_prod_main_info">
                    <div className="order_template">
                        <img src={`data:image/png;base64,${props.prod.src}`}/>
                    </div>
                    <div className="order_right_text">
                        <div className="cart_name">{props.prod.name}</div>
                    </div>
                </div>
                <div className="order_prod_info">
                    <div className="order_size">{'Размер: ' + props.prod.size + ' x ' + props.prod.quant}</div>
                    <div className="order_price">{price + '₽'}</div>
                </div>
            </div>
        </Link>
    )
}

export default OrderProd;