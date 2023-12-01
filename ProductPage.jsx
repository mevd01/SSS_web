import React, { useEffect, useState } from "react";
import axios from "axios";
import classes from '../../css/ProductPage.css';
import { useLocation } from "react-router-dom";

function ProductPage(props){
    const[prod, setProd] = useState({id:1, name:'', brand:'', price:'', description:'', imgsrc:''});
    const[sizeVars, setSizeVars] = useState([]);
    const[imgs, setImgs] = useState([]);
    const[availSize, setAvailSize] = useState('');
    const[availQuant, setAvailQuant] = useState(1);
    const[availPrice, setAvailPrice] = useState('');
    const[checked, setChecked] = useState('none_liked');

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paramValue = params.get('art');

    var isEvent = false

    useEffect(() => {
        async function requestProd(){
            var response = await axios.post('http://127.0.0.1:8000/users/', {oper:'get_item_info_by_id', id:paramValue});
            if(response.data['answer'] == 1){
                //('description':x 'brand':x,'price':x,'photo_id':x )
                setProd({id:paramValue, name:response.data['name'], brand:response.data['brand'], price:response.data['price'], description:response.data['description'], imgsrc:response.data['photo_id']})
                setAvailPrice('¥' + response.data['price'])
            }else{
                return
            }

            var response = await axios.post('http://127.0.0.1:8000/users/', {oper:'get_all_photos_by_id', id:paramValue});
            setImgs(response.data['photos'])

            var response = await axios.post('http://127.0.0.1:8000/users/', {oper:'get_sizes_by_id', id:paramValue});
            setSizeVars(response.data['sizes'])
        }

        requestProd();
    }, [paramValue])





    function AddToFavorite(){
        if(checked == 'liked'){
            setChecked('none_liked')   //!!!! Надо как-то передавать сердечки в страницу каталога Возможно опросто проверять с записанными заранее значениями при выводе товара
        }else{
            setChecked('liked')
        }
    }

    function moveLeft(){
        var element = document.getElementById('gal')
        var elemPos = Number((element.style.left).replace('px', ''))
        if(0 < Math.abs(elemPos)){
            element.style.left = (elemPos + element.offsetWidth) + 'px';
        }
    }
    function moveRight(){
        var element = document.getElementById('gal')
        var elemPos = Number((element.style.left).replace('px', ''))
        if((element.children.length-1) * element.offsetWidth > Math.abs(elemPos)){
            element.style.left = (elemPos - element.offsetWidth) + 'px';
        }
    }

    function openSizes(){
        var elem = document.getElementById('size_menu').children[1]
        if(elem.offsetHeight == 0){
            elem.style.top = '0px'
            elem.style.height = '100%'
            document.getElementsByClassName[0].style.transform = 'rotate(90deg)'
        }else{
            elem.style.top = '-' + elem.offsetHeight + 'px'
            elem.style.height = '0px'
        }
    }

    async function inputSize(elem){
        if ( !isEvent ) {
            var target = document.getElementById('avail_size')
            if(elem.className == 'size_var'){
                target.innerHTML = elem.children[1].children[0].innerHTML
                setAvailSize(target.innerHTML)
            }else if(elem.className == 'var_size'){
                target.innerHTML = elem.innerHTML
                setAvailSize(target.innerHTML)
            }else if(elem.className == 'var_price'){
                target.innerHTML = elem.parentElement.children[0].innerHTML
                setAvailSize(target.innerHTML)
            }else if(elem.className !== ''){
                target.innerHTML = elem.children[0].innerHTML
                setAvailSize(target.innerHTML)
            }
            
            var response = await axios.post('http://127.0.0.1:8000/users/', {oper:'get_cost_by_id_and_size', id:paramValue, size:availSize});
            setAvailPrice(response.data['cost'])
        
            isEvent = true;
            setTimeout( function() {
                isEvent = false;
            }, 200 );
        }
    }


    async function addToCart(){
        if(availSize !== ''){
            const newCartProd = {
                id: paramValue,
                name: prod.name,
                brand: prod.brand,
                price: availPrice,
                imgsrc: prod.imgsrc,
                size: availSize,
                quant: availQuant,
                code: paramValue + availSize
            }

            props.create(newCartProd)
            props.permit(true)

            setAvailQuant(1)
        }
    }

    return(
        <>
            <div className="main_prod_part">
                <div className="gallery_box">
                    <div className="gallery" id="gal">
                        {imgs.map((img_item) =>
                            <img src={'/img/item_photos/' + img_item}/>
                        )}
                    </div>
                    <div className="control">
                        <div className="left" onClick={moveLeft}>&lt;</div>
                        <div className="right" onClick={moveRight}>&gt;</div>
                    </div>
                    <div className={"favorite_icon_in_page " + checked} onClick={() => {AddToFavorite()}}></div>
                </div>
                <div className="main_info_box">
                    <div className="price">{availPrice}</div>
                    <div className="name">{prod.name}</div>
                    <div className="size_menu" id="size_menu">
                        <div className="menu_head" onClick={openSizes}><div>Размеры:<span id="avail_size"></span></div><div className="anim">&lt;</div></div>
                        <div className="size_part">
                            {sizeVars.map((sizeVar) =>
                                <label className="size_var" onClick={(e) => {inputSize(e.target)}}>
                                    <input type="radio" name="size_checker"/>
                                    <div>
                                        <div className="var_size">{sizeVar[0]}</div>
                                        <div className="var_price">{sizeVar[1]}</div>
                                    </div>
                                </label>
                            )}
                        </div>
                    </div>
                    <div className="buy_but" onClick={addToCart}>В корзину</div>
                </div>
            </div>
            <div className="info_part">
                <div>
                    <h1>Описание:</h1>
                    <div>{prod.description}</div>
                </div>
            </div>
        </>
    )
}

export default ProductPage;