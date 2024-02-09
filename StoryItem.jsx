import React, { useEffect, useState } from "react";
import classes from '../../../css/StoryItem.css'
import axios from "axios";

import OrderProd from "./OrderProd";

function StoryItem({SRVRADDRESS, info, ...props}){
    const[TotalPrice, setTotal] = useState(0)
    const[cartIds, setCart] = useState([]);
    const[cartPos, setCartPos] = useState(0)
    const[fillPos, fill] = useState('')
    const[prods, setProds] = useState([]);
    const[nextProd, setNextProd] = useState({id:'', name:'', quant:'', size:''});
    const[costFillPos, setFillPos] = useState(0);

    useEffect(() => {
        setCart(info.cart)
    }, [])
    useEffect(() => {
        if(cartIds != ''){
            fill(1)
        }
    }, [cartIds])
    useEffect(() => {
        if(fillPos != '' && cartPos < cartIds.length){
            setCartPos(cartPos+1)
        }
    }, [fillPos])
    useEffect(() => {
        if(cartPos != 0){
            axios.post(SRVRADDRESS, {oper:'get_item_info_by_id', id:cartIds[cartPos-1][0]})
            .then(response => {
                setNextProd({id:cartIds[cartPos-1][0], name:response.data['name'], quant:1, size:cartIds[cartPos-1][1]})
            })
        }
    }, [cartPos])
    useEffect(() => {
        if (nextProd.name !== '') {
            addProd(nextProd);
        }
    }, [nextProd.name]);
    function addProd(nextProd){
        setProds([...prods, nextProd])
        fill(fillPos+1)
    }



    function ToBeautyCost(refer){
        let masterpiece = ''
        alert(refer)
        for(let i = 0; i < refer.length; ++i){
            if((refer.length - i)%4 == 0){
                masterpiece += ' '
                masterpiece += refer[i]
            }else{
                masterpiece += refer[i]
            }
            alert(masterpiece)
        }
        return masterpiece
    }



    function Total(prc){
        if(prc != undefined){
            setTotal(Number(TotalPrice) + Number(prc.replace(' ', '')))
        }
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
                    <OrderProd key={prod.id+prod.size} prod={prod} SRVRADDRESS={SRVRADDRESS} callCost={'yes'} outCost={Total}/>
                )}
            </div>
            <div className="story_bot_part">
                <div>Итого:</div>
                <div>{TotalPrice + '₽'}</div>
            </div>
        </div>
    )
}

export default StoryItem;