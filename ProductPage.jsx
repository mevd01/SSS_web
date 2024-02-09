import React, { useEffect, useState } from "react";
import axios from "axios";
import classes from '../../css/ProductPage.css';
import { useLocation, useNavigate } from "react-router-dom";

import BlackBut from "../UI/BlackBut/BlackBut";
import ProdSizeItem from "../Parts/StackItems/ProdSizeItem";
import Captcha from "../Parts/Captcha";

function ProductPage({err, SRVRADDRESS, ...props}){
    const[prod, setProd] = useState({id:1, name:'', brand:'', price:'', description:[]});
    const[windowWidth, setWindowWidth] = useState(window.innerWidth);
    const[sizeVars, setSizeVars] = useState([]);
    const[imgs, setImgs] = useState([]);
    const[nextImg, setNextImg] = useState('')
    const[availSize, setAvailSize] = useState('');
    const[availQuant, setAvailQuant] = useState(1);
    const[availPrice, setAvailPrice] = useState('');
    const[checked, setChecked] = useState('none_liked');
    const[ph_cnt, setPh_cnt] = useState('');
    const[updateStat, setUpdateStat] = useState('')
    const[updateStatText, setStatText] = useState('')

    const[capStat, openCap] = useState(false)
    const[operation, setOperation] = useState('')
    const[capResponse, setCapResponse] = useState();
    const[logRegErrInfo, setLogRegErrInfo] = useState({reg:'', log:'', cap:'', mass:''})

    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paramValue = params.get('art');

    useEffect(() => {
        async function requestProd(){
            var response = await axios.post(SRVRADDRESS, {oper:'get_item_info_by_id', id:paramValue});
            if(response.data['answer'] == 1){
                //('description':x 'brand':x,'price':x,'photo_id':x )
                setProd({id:paramValue, name:response.data['name'], brand:response.data['brand'], price:response.data['price'], description:[...response.data['description']]})
                setAvailPrice(response.data['price'])
            }else{
                return
            }

            let photo_cnt = await axios.post(SRVRADDRESS, {oper:'get_cnt_photos_by_tov_id', id:paramValue})
            setPh_cnt(photo_cnt.data['cnt'])
            for(var i = 1; i <= photo_cnt.data['cnt']; ++i){
                fetch(SRVRADDRESS, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ oper: 'get_photo_by_tov_id', id:paramValue, num:i})
                })
                .then(response => response.blob())
                .then(blob => {
                    setNextImg(URL.createObjectURL(blob))
                });
            }

            var response = await axios.post(SRVRADDRESS, {oper:'get_sizes_by_id', id:paramValue});
            setSizeVars(response.data['sizes'])
        }

        requestProd();
    }, [paramValue])
    useEffect(() => {
        if(nextImg != ''){
            setImgs([...imgs, nextImg])
        }
    }, [nextImg])





    useEffect(() => {
        document.getElementById('to_hide').scrollBy({top: -document.getElementById('to_hide').scrollTop, behavior : "smooth"});
        window.addEventListener('resize', handleResize);

        function handleResize(){
            setWindowWidth(window.innerWidth);
        }

        if(windowWidth <= 400){
            document.getElementById('size_menu').children[1].style.gridTemplateColumns = 'repeat(3, 33.3%)'
        }else if(windowWidth > 400 && windowWidth <= 520){
            document.getElementById('size_menu').children[1].style.gridTemplateColumns = 'repeat(4, 25%)'
        }else if(windowWidth > 520 && windowWidth <= 630){
            document.getElementById('size_menu').children[1].style.gridTemplateColumns = 'repeat(5, 20%)'
        }else if(windowWidth > 630 && windowWidth <= 800){
            document.getElementById('size_menu').children[1].style.gridTemplateColumns = 'repeat(6, 16.66%)'
        }else if(windowWidth > 800 && windowWidth <= 1000){
            document.getElementById('size_menu').children[1].style.gridTemplateColumns = 'repeat(5, 20%)'
        }else if(windowWidth > 1000 && windowWidth <= 1200){
            document.getElementById('size_menu').children[1].style.gridTemplateColumns = 'repeat(6, 16.66%)'
        }

        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])

    useEffect(() => {
        if(windowWidth <= 400){
            document.getElementById('size_menu').children[1].style.gridTemplateColumns = 'repeat(3, 33.3%)'
        }else if(windowWidth > 400 && windowWidth <= 520){
            document.getElementById('size_menu').children[1].style.gridTemplateColumns = 'repeat(4, 25%)'
        }else if(windowWidth > 520 && windowWidth <= 630){
            document.getElementById('size_menu').children[1].style.gridTemplateColumns = 'repeat(5, 20%)'
        }else if(windowWidth > 630 && windowWidth <= 800){
            document.getElementById('size_menu').children[1].style.gridTemplateColumns = 'repeat(6, 16.66%)'
        }else if(windowWidth > 800 && windowWidth <= 1000){
            document.getElementById('size_menu').children[1].style.gridTemplateColumns = 'repeat(5, 20%)'
        }else if(windowWidth > 1000 && windowWidth <= 1200){
            document.getElementById('size_menu').children[1].style.gridTemplateColumns = 'repeat(6, 16.66%)'
        }else if(windowWidth > 1200){
            document.getElementById('size_menu').children[1].style.gridTemplateColumns = 'repeat(4, 25%)'
        }
    }, [windowWidth]);





    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    async function getFavorite(){
        var response = await axios.post(SRVRADDRESS, {oper:'is_liked', id:paramValue, mail:getCookie('user')});
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
        if(/iPhone/.test(window.navigator.userAgent)){
            document.getElementById('move_left').style.transform = 'rotate(180deg)'
            document.getElementById('move_right').style.transform = 'rotate(0deg)'
        }
        axios.post(SRVRADDRESS, {oper:'clicked_tov_with_id', id:paramValue})
    }, [])

    async function AddToFavorite(){
        if(getCookie('stat') == 'login'){
            if(checked == 'liked'){
                axios.post(SRVRADDRESS, {oper:'delete_like', id:paramValue, mail:getCookie('user')})
                .then(setChecked('none_liked'))
            }else{
                axios.post(SRVRADDRESS, {oper:'add_like', id:paramValue, mail:getCookie('user')})
                .then(setChecked('liked'))
            }
        }else{
            err('Войдите в аккаунт, чтобы добавлять в избранное')

            setTimeout(() => {
                err('')
            }, 6000);
        }
    }





    useEffect(() => {
        if(capResponse == 'yes'){
            setUpdateStat('update')
            document.cookie = 'Upcount=' + (Number(getCookie('Upcount'))+1) + '; path=/; max-age=7200'
            setOperation('delete')
            openCap(false)
        }else if(capResponse == 'no'){
            setLogRegErrInfo({...logRegErrInfo, cap:'Неправильно введена капча'})
            setCapResponse('')
        }
    }, [capResponse])

    function AddCaptcha(){
        openCap(true)
        setOperation('create')
    }
    function UpdateRequeste(){
        const count = getCookie('Upcount')
        if(count == undefined){
            document.cookie = 'Upcount=1; path=/; max-age=7200'
        }else if(updateStatText !== 'Цены актуальны'){
            if(Number(count)%3 == 0){
                AddCaptcha()
            }else{
                document.cookie = 'Upcount=' + (Number(count)+1) + '; path=/; max-age=7200'
                setUpdateStat('update')
            }
        }
        console.log(count)
    }

    useEffect(() => {
        if(updateStat === 'update' && updateStatText !== 'Цены актуальны'){
            setStatText('Это займёт не более минуты')
            axios.post(SRVRADDRESS, {oper:'request_avail_size', tov_id:paramValue})
            .then(yes => {
                setUpdateStat('up1')
            })
        }else if(updateStat === 'up1'){
            axios.post(SRVRADDRESS, {oper:'already_updated_tov', tov_id:paramValue})
            .then(ok => {
                if(ok.data['ans'] === 1){
                    axios.post(SRVRADDRESS, {oper:'get_sizes_by_id', id:paramValue})
                    .then(response => {
                        setSizeVars([])
                        setSizeVars(response.data['sizes'])
                        setUpdateStat('good')
                        setStatText('Цены актуальны')
                        setAvailPrice(response.data['sizes'][0][1])
                    })
                }else{
                    setTimeout(() => {
                        setUpdateStat('up2')
                    }, 1000);
                }
            })
        }else if(updateStat === 'up2'){
            axios.post(SRVRADDRESS, {oper:'already_updated_tov', tov_id:paramValue})
            .then(ok => {
                if(ok.data['ans'] === 1){
                    axios.post(SRVRADDRESS, {oper:'get_sizes_by_id', id:paramValue})
                    .then(response => {
                        setSizeVars(response.data['sizes'])
                        setUpdateStat('good')
                        setStatText('Цены актуальны')
                        setAvailPrice(response.data['sizes'][0][1])
                    })
                }else{
                    setTimeout(() => {
                        setUpdateStat('up1')
                    }, 1000);
                }
            })
        }else if(updateStat !== ''){
            setUpdateStat('good')
        }
    }, [updateStat])





    function moveLeft(){
        var element = document.getElementById('gal')
        var elemPos = Number((element.style.left).replace('px', ''))
        if(0 < Math.abs(elemPos)){
            element.style.left = (elemPos + element.offsetWidth) + 'px';
        }else{
            element.style.left = (elemPos - element.offsetWidth)*(Number(ph_cnt)-1) + 'px'
        }
    }
    function moveRight(){
        var element = document.getElementById('gal')
        var elemPos = Number((element.style.left).replace('px', ''))
        if((element.children.length-1) * element.offsetWidth > Math.abs(elemPos)){
            element.style.left = (elemPos - element.offsetWidth) + 'px';
        }else{
            element.style.left = '0px'
        }
    }

    useEffect(() => {
        async function getPrice(){
            var response = await axios.post(SRVRADDRESS, {oper:'get_cost_by_id_and_size', id:paramValue, size:availSize});
            setAvailPrice(response.data['cost'])
        }

        if(availSize != ''){getPrice()}
    }, [availSize])


    function addToCart(){
        if(getCookie('stat') == 'login'){
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
            }else{
                err('Выберите нужный размер')

                setTimeout(() => {
                    err('')
                }, 6000);
            }
        }else{
            err('Войдите в аккаунт, чтобы добавить в корзину')

            setTimeout(() => {
                err('')
            }, 6000);
        }
    }

    return(
        <>
            <div className="main_prod_part">
                <div className="gallery_box">
                    <div className="gallery" id="gal">
                        {imgs.map((img_item) =>
                            <img src={img_item}/>
                        )}
                    </div>
                    <div className="control" id="control">
                        <div className="left" id="move_left" onClick={moveLeft}></div>
                        <div className="right" id="move_right" onClick={moveRight}></div>
                    </div>
                    <div className={"favorite_icon_in_page " + checked} onClick={() => {AddToFavorite()}}></div>
                    <div className="back_to_cat_but" onClick={() => navigate('/catalog')}></div>
                </div>
                <div className="main_info_box">
                    <div className="price">{availPrice != 'Нет в наличии' ?availPrice+'₽' :availPrice}</div>
                    <div className="name">{prod.name}</div>
                    {windowWidth <= 1000 || windowWidth > 1200
                        ?<div className="size_menu" id="size_menu">
                            <div className="size_menu_head">Размеры:</div>
                            <div className="size_part">
                                {availPrice != 'Нет в наличии'
                                    ?sizeVars.map((sizeVar) =>
                                        <ProdSizeItem size={sizeVar[0]} price={sizeVar[1]} set={setAvailSize}/>
                                    )
                                    :<h2>Отсутствуют</h2>
                                }
                            </div>
                            {capStat
                                ?<>
                                    <Captcha SRVRADDRESS={SRVRADDRESS} operation={operation} setOperation={setOperation} setCapResponse={setCapResponse} capResp={setLogRegErrInfo} logRegErrInfo={logRegErrInfo}/>
                                    {logRegErrInfo.cap !== ''
                                        ?<h2 className="cap_err">{logRegErrInfo.cap}</h2>
                                        :<></>
                                    }
                                    <BlackBut onClick={() => setOperation('check')}>ПРОВЕРИТЬ</BlackBut>
                                </>
                                :<div className="size_update" onClick={() => UpdateRequeste()}>
                                    <div className={"up_icon " + updateStat}></div>
                                    <span>{updateStatText == '' ?'Проверить актуальность цен' :updateStatText}</span>
                                </div>
                            }
                        </div>
                        :<></>
                    }
                    {availPrice != 'Нет в наличии'
                        ?<BlackBut onClick={addToCart}>В КОРЗИНУ</BlackBut>
                        :<></>
                    }
                </div>
            </div>
            <div className="info_part">
                {windowWidth > 1000 && windowWidth <= 1200
                    ?<div className="size_menu" id="size_menu">
                        <div className="size_menu_head">Размеры:</div>
                        <div className="size_part">
                            {availPrice != 'Нет в наличии'
                                ?sizeVars.map((sizeVar) =>
                                    <ProdSizeItem size={sizeVar[0]} price={sizeVar[1]} set={setAvailSize}/>
                                )
                                :<h2>Отсутствуют</h2>
                            }
                        </div>
                        <div className="size_update" onClick={() => UpdateRequeste()}>
                            <div className={"up_icon " + updateStat}></div>
                            <span>{updateStatText == '' ?'Проверить актуальность цен' :updateStatText}</span>
                        </div>
                    </div>
                    :<></>
                }
                <div>
                    <h1>Описание:</h1>
                    <div className="prod_discript">
                        {prod.description.map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductPage;