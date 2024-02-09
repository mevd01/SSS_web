import React, { useEffect, useState } from "react";
import classes from '../../css/OrderPage.css';
import axios from "axios";

import OrderProd from "../Parts/StackItems/OrderProd";
import BlackBut from "../UI/BlackBut/BlackBut";
import { useNavigate } from "react-router-dom";

function OrderPage({prods, SRVRADDRESS, setCart}){
    const[peronalData, setPersonalData] = useState({surname:'', name:'', mail:'', phone:'', net:''});
    const[shippingData, setShippingData] = useState({cntr:'', town:'', strt:'', house:'', more:''});
    const[windowWidth, setWindowWidth] = useState(window.innerWidth)
    const[orderNum, setOrderNum] = useState('')
    const[errMess, setErr] = useState('');
    const[TotalPrice, setTotal] = useState(0)

    const check = [
        document.getElementById('sur'),
        document.getElementById('name'),
        document.getElementById('mail'),
        document.getElementById('net'),
        document.getElementById('phone'),
        document.getElementById('country'),
        document.getElementById('town'),
        document.getElementById('street'),
        document.getElementById('house'),
    ]
    const titles = document.getElementsByTagName('h2')
    const constTitles = [
        'Фамилия*',
        'Имя*',
        'Email*',
        'Социальная сеть*',
        'Номер телефона*',
        'Страна*',
        'Город*',
        'Улица*',
        'Дом*',
    ]

    const navigate = useNavigate()

    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }


    function CheckInputs(){
        console.log(check[3].value)
        const values = [
            check[0].value,
            check[1].value,
            check[2].value,
            check[3].value,
            check[4].value,
            check[5].value,
            check[6].value,
            check[7].value,
            check[9].value,
        ]

        if(values.includes('')){
            for (let i = 0; i < values.length; ++i) {
                if (values[i] === '') {
                    check[i].style.borderBottomColor = 'red'
                    titles[i].innerHTML = 'Заполните это поле'
                    titles[i].style.color = 'red'
                }
            }
            setErr('Заполните обязательные поля')

            return
        }
        createOrder()
    }
    function madeItNormal(e){
        const elem = e.target
        if(elem.style.borderBottomColor === 'red'){
            for(let i = 0; i < check.length; ++i){
                if(check[i].id === elem.id){
                    titles[i].innerHTML = constTitles[i];
                    titles[i].style.color = 'black'
                    elem.style.borderBottomColor = 'rgb(216, 216, 216)'
                    break
                }
            }
        }
    }




    async function createOrder(){
        let response = await axios.post(SRVRADDRESS, {oper:'create_order', mail:peronalData.mail, name:peronalData.name, surname:peronalData.surname, net:peronalData.net, phone:peronalData.phone, address:shippingData.cntr+' '+shippingData.town+' '+shippingData.strt+' '+shippingData.house+' '+shippingData.more});
        setCart([])
        setOrderNum(response.data['num'])
        window.scrollBy({top: -window.scrollY, behavior : "smooth"});
        document.getElementById('suc_p').style.display = 'block'
        document.getElementById('suc_p').style.height = window.innerHeight-500 + 'px'
        
        document.getElementById('ord_p').style.display = 'none'
    }


    useEffect(() => {
        async function getAccountInfo(){
            let response = await axios.post(SRVRADDRESS, {oper:'get_account_info_by_mail',mail:getCookie('user')});
        
            setPersonalData({name:response.data['name'] == 'None'?'':response.data['name'], surname:response.data['surname'] == 'None' ?'' :response.data['surname'], net:response.data['net'] == 'None'?'':response.data['net'], phone:response.data['phone'] == 'None'?'':response.data['phone'], mail:getCookie('user')})
            setShippingData({address:response.data['address'] == 'None'?'':response.data['address']})
        }
        function handleResize(){
            setWindowWidth(window.innerWidth);
        }

        if(getCookie('stat') == 'login'){
            getAccountInfo()
            window.addEventListener('resize', handleResize);
            document.addEventListener('keypress', KeyPress);
        }else{
            navigate('/registr?func=log')
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('keypress', KeyPress);  
        }
    }, [])    

    function KeyPress(e){
        if (e.key === 'Enter' || e.keyCode === 13) {
            e.preventDefault();
            const inputs = document.getElementsByTagName('input');
            for (let i = 0; i < inputs.length; i++) {
                if (inputs[i] === document.activeElement) {
                if (i < inputs.length - 1) {
                    inputs[i + 1].focus();
                    break;
                }
                }
            }
        }
    }


    function Total(prc){
        if(prc != undefined){
            setTotal(Number(TotalPrice) + Number(prc.replace(' ', '')))
        }
    }




    return(
        <>
        <div className="order_part" id="ord_p">
            <div className="order_cart_part">
                {prods.map((prod) =>
                    <OrderProd prod={prod} SRVRADDRESS={SRVRADDRESS} callCost={'yes'} outCost={Total}/>
                )}
                <div className="story_bot_part">
                    <div>Итого:</div>
                    <div>{TotalPrice + '₽'}</div>
                </div>
            </div>

            <div className="order_input_part" id="ord_inp_p">
                <div>
                    <h1>Контактные данные</h1>
                    <input
                        value={peronalData.surname}
                        onClick={(e) => {madeItNormal(e)}}
                        onChange={(e) => setPersonalData({...peronalData, surname:e.target.value})}
                        className="log_reg_input"
                        id="sur"
                    />
                    <h2>Фамилия*</h2>
                    <input
                        value={peronalData.name}
                        onClick={(e) => {madeItNormal(e)}}
                        onChange={(e) => setPersonalData({...peronalData, name:e.target.value})}
                        className="log_reg_input"
                        id="name"
                    />
                    <h2>Имя*</h2>
                    <input
                        value={peronalData.mail}
                        onClick={(e) => {madeItNormal(e)}}
                        onChange={(e) => setPersonalData({...peronalData, mail:e.target.value})}
                        className="log_reg_input"
                        id="mail"
                    />
                    <h2>Email*</h2>
                    <input
                        value={peronalData.net}
                        onClick={(e) => {madeItNormal(e)}}
                        onChange={(e) => setPersonalData({...peronalData, net:e.target.value})}
                        className="log_reg_input"
                        id="net"
                    />
                    <h2>Социальная сеть*</h2>
                    <input
                        value={peronalData.phone}
                        onClick={(e) => {madeItNormal(e)}}
                        onChange={(e) => setPersonalData({...peronalData, phone:e.target.value})}
                        className="log_reg_input"
                        id="phone"
                    />
                    <h2>Номер телефона*</h2>
                </div>
                <div>
                    <h1>Доставка</h1>
                    <input
                        value={shippingData.cntr}
                        onClick={(e) => {madeItNormal(e)}}
                        onChange={(e) => setShippingData({...shippingData, cntr:e.target.value})}
                        className="log_reg_input"
                        id="country"
                    />
                    <h2>Страна*</h2>
                    <input
                        value={shippingData.town}
                        onClick={(e) => {madeItNormal(e)}}
                        onChange={(e) => setShippingData({...shippingData, town:e.target.value})}
                        className="log_reg_input"
                        id="town"
                    />
                    <h2>Город*</h2>
                    <input
                        value={shippingData.strt}
                        onClick={(e) => {madeItNormal(e)}}
                        onChange={(e) => setShippingData({...shippingData, strt:e.target.value})}
                        className="log_reg_input"
                        id="street"
                    />
                    <h2>Улица*</h2>
                    <input
                        value={shippingData.house}
                        onClick={(e) => {madeItNormal(e)}}
                        onChange={(e) => setShippingData({...shippingData, house:e.target.value})}
                        className="log_reg_input"
                        id="house"
                    />
                    <h2>Дом*</h2>
                    <input
                        value={shippingData.more}
                        onChange={(e) => setShippingData({...shippingData, more:e.target.value})}
                        className="log_reg_input"
                        id="more"
                    />
                    <h2>Уточнение</h2>
                </div>
                <BlackBut onClick={() => CheckInputs()}>ОПЛАТИТЬ</BlackBut>
                {errMess != ''
                    ?<h2 className="err_message">{errMess}</h2>
                    :<></>
                }
            </div>
        </div>
        <div className="success_part" id="suc_p">
            <h1>Заказ успешно создан</h1>
            <div>{'Номер вашего заказа: ' + orderNum}</div>
            <div>В ближайшее время с вами свяжутся</div>
            <BlackBut id='suc_but' onClick={() => navigate('/')}>НА ГЛАВНУЮ</BlackBut>
        </div>
        </>
    )
}

export default OrderPage;