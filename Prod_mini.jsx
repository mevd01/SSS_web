import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Prod_mini({info, err, SRVRADDRESS}){
    const[checked, setChecked] = useState('none_liked');
    const[imgsrc, setImgsrc] = useState('');
    const[name, setName] = useState('');

    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    
    async function getFavorite(){
        let response = await axios.post(SRVRADDRESS, {oper:'is_liked', id:info.id, mail:getCookie('user')});

        if(response.data['ans'] == true){
            setChecked('liked')
        }else{
            setChecked('none_liked')
        }
    }
    useEffect(() => {
        if(getCookie('stat') == 'login'){
            getFavorite()
        }
        fetch(SRVRADDRESS, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({ oper: 'get_photo_by_tov_id', id:info.id, num:-1})
        })
        .then(response => response.blob())
        .then(blob => {
            setImgsrc(URL.createObjectURL(blob));
        })
        .catch()

        if(info.name[39] != undefined){
            var i = 39
            while(info.name[i] != ' '){
                --i
            }
            setName(info.name.slice(0, i).padEnd(i+3, '.'))
        }else{
            setName(info.name)
        }
    }, [])
    
    async function AddToFavorite(){
        if(getCookie('stat') == 'login'){
            if(checked == 'liked'){
                let response = axios.post(SRVRADDRESS, {oper:'delete_like', id:info.id, mail:getCookie('user')});
                response.then(setChecked('none_liked'))    //!!!! Надо как-то передавать сердечки в страницу каталога Возможно опросто проверять с записанными заранее значениями при выводе товара
            }else{
                let response = axios.post(SRVRADDRESS, {oper:'add_like', id:info.id, mail:getCookie('user')});
                response.then(setChecked('liked'))
            }
        }else{
            err('Войдите в аккаунт, чтобы добавлять в избранное')

            setTimeout(() => {
                err('')
            }, 6000);
        }
    }

    return(
        <div className="prod_mini">
            <div className={"favorite_icon_in_cat " + checked} onClick={() => {AddToFavorite()}}></div>
            <Link to={'/product?art=' + info.id}>
                <div className="prod_gallery">
                    <img src={imgsrc}/>
                </div>
                <div className="prod_main_info">
                    <div className="prod_cat_name">{name}</div>
                    <div className="prod_cat_price">{info.price != 'Нет в наличии' ?'от ' + info.price + '₽' :info.price}</div>
                </div>
            </Link>
        </div>
    )
}

export default Prod_mini;