import React, { useEffect, useState } from "react";
import classes from '../../../css/OrderProd.css'
import axios from "axios";
import { Link } from "react-router-dom";

function OrderProd({SRVRADDRESS, callCost, outCost, ...props}){
    const[imgsrc, setImgsrc] = useState('');
    const[price, setPrice] = useState('');

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
            setImgsrc(URL.createObjectURL(blob));
        });

        async function getPrice(){
            var response = await axios.post(SRVRADDRESS, {oper:'get_cost_by_id_and_size', id:props.prod.id, size:props.prod.size});
            setPrice(response.data['cost'])
            if(callCost == 'yes'){
                outCost(response.data['cost'])
            }
        }
        getPrice();
    }, [])

    return(
        <Link to={'/product?art=' + props.prod.id}>
            <div className="OrderProd">
                <div className="order_prod_main_info">
                    <div className="order_template">
                        <img src={imgsrc}/>
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