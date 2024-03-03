import React, { useEffect, useState } from "react";
import classes from '../../../css/StoryItem.css'
import axios from "axios";

import OrderProd from "./OrderProd";

function StoryItem({SRVRADDRESS, info, ...props}){
    const[cartItems, setCart] = useState([]);
    const[prods, setProds] = useState([]);

    useEffect(() => {
        setCart(info.cart)
    }, [])
    useEffect(() => {
        if(cartItems != '' && cartItems != undefined){
            getStoryCart()
        }
    }, [cartItems])

    function getStoryCart(){
        let ids = []
        let sizes = []
        let cart = []

        cartItems.forEach(item => {
            ids.push(item[0])
            sizes.push(item[1])
        })
        
        axios.post(SRVRADDRESS, {oper:'get_item_info_by_id', ask_ids:ids, mail:getCookie('user')})
        .then(response => {
            response.data['list'].forEach(prod => {
                if(prod.answer !== 1){
                    return
                }

                const Prod = {
                    id:prod.id,
                    name:prod.name,
                    src:prod.photo,
                    quant:1,
                    size:sizes[ids.indexOf(prod.id)]
                }

                cart.push(Prod)
                setProds([...cart])
            })
        })
    }







    function ToBeautyCost(refer){
        let masterpiece = ''
        for(let i = 0; i < String(refer).length; ++i){
            if(i%3 == 0){
                masterpiece = ' ' + masterpiece
                masterpiece = String(refer)[String(refer).length-(i+1)] + masterpiece
            }else{
                masterpiece = String(refer)[String(refer).length-(i+1)] + masterpiece
            }
        }
        return masterpiece
    }


    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    return(
        <div className="story_item">
            <div className="story_top_part">
                <div className="story_date">{info.date.substring(0, 11)}</div>
                <div className="story_stat">{info.status}</div>
            </div>
            <div className="story_personal_part">
                <div>{info.name}</div>
                <div>{'Номер: ' + info.phone}</div>
            </div>
            <div className="story_adrs_part">
                <div>Адрес доставки: </div>
                <div>{info.address}</div>
            </div>
            <div className="story_mid_part">
                {prods.map((prod) =>
                    <OrderProd key={prod.id+prod.size} prod={prod} SRVRADDRESS={SRVRADDRESS} callCost={'yes'}/>
                )}
            </div>
            <div className="story_bot_part">
                <div>Итого:</div>
                <div>{info.total + '₽'}</div>
            </div>
        </div>
    )
}

export default StoryItem;