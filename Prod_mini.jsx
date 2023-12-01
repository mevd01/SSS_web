import React, { useState } from "react";
import { Link } from "react-router-dom";

function Prod_mini({info}){
    const[checked, setChecked] = useState('none_liked');

    function AddToFavorite(){
        if(checked == 'liked'){
            setChecked('none_liked')   //!!!! Надо как-то передавать сердечки в страницу каталога Возможно опросто проверять с записанными заранее значениями при выводе товара
        }else{
            setChecked('liked')
        }
    }

    return(
        <div className="prod_mini">
            <div className={"favorite_icon_in_cat " + checked} onClick={() => {AddToFavorite()}}></div>
            <Link to={'/product?art=' + info.id}>
                <div className="prod_gallery">
                    <img src={info.imgsrc}/>
                </div>
                <div className="prod_tags">
                    <a>#cool</a>
                    <a>#cringe</a>
                    <a>#da</a>
                </div>
                <div className="prod_main_info">
                    <div>{info.name}</div>
                    <div>{info.price}</div>
                </div>
            </Link>
        </div>
    )
}

export default Prod_mini;