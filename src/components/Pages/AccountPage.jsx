import React, { useEffect, useState } from "react";
import classes from '../../css/AccountPage.css'
import axios from "axios";

import ToTopBut from "../UI/ToTopBut/ToTopBut";
import BlackBut from "../UI/BlackBut/BlackBut";
import Catalog from "../Parts/Catalog";
import StoryItem from "../Parts/StackItems/StoryItem";
import { useNavigate } from "react-router-dom";

function AccountPage({SRVRADDRESS}){
    const[startCat, start] = useState('');
    const[availScroll, setAvailScroll] = useState(0);
    const[shouldFill, setShould] = useState('');
    const[catalogPos, setCatalogPos] = useState(0);
    const[shouldFillStory, FillStory] = useState('');
    const[storyPos, setStoryPos] = useState(0);
    const[ScrollFill, setScrollFill] = useState(false);

    const[accountInfo, setAccountInfo] = useState({name:'', surname:'', age:'', net:'', phone:'', address:'', postcode:''});
    const[name, setName] = useState('');
    const[active, setActive] = useState('cls')
    const[vkTg, setVkTg] = useState('tg');
    const[favorHist, setFavorHist] = useState('favor');

    const[nextProd, setNextProd] = useState({id:1, name:'', brand:'', price:'', description:''})
    const[nextOrder, setNextOrder] = useState({mail:'', name:'', phone:'', address:'', postcode:'', cart:[], total:0})
    const[windowWidth, setWindowWidth] = useState(window.innerWidth);
    const[favorIds, setFavorIds] = useState([]);
    const[favorProds, setFavorProds] = useState([]);
    const[storyIds, setStoryIds] = useState([]);
    const[story, setStory] = useState([]);

    const navigate = useNavigate();






    function CreateIdsArr(begin = 0, end = 20){
        let IdsArr = []
        let i = begin
        while(i < end){
            IdsArr.push(favorIds[i][0])
            ++i
        }
        return IdsArr;
    }


    function handleScroll(){
        setAvailScroll(document.getElementById('to_hide').scrollTop)
    }
    useEffect(() => {
        if(document.getElementById('catalog') == undefined){
            return
        }

        if(document.getElementById('catalog').children[0] == undefined){
            return
        }

        const catalog = document.getElementById('catalog')
        if (ScrollFill && document.getElementById('catalog').children[catalog.children.length - 1].offsetTop - availScroll <= 2000 && catalogPos < favorIds.length) {
            setShould(1)
        }
    }, [availScroll])
    useEffect(() => {
        if(shouldFill == 1 && shouldFill != ''){
            setCatalogPos(catalogPos+1)
            //getFavorite(IdsArr)
        }
    }, [shouldFill])
    useEffect(() => {
        if(catalogPos != 0 && catalogPos*20 <= favorIds.length){
            const ids = CreateIdsArr((catalogPos-1)*20, (favorIds.length > catalogPos*20 ?catalogPos*20 :favorIds.length))
            getFavorite(ids)
        }
    }, [catalogPos])
    // useEffect(() => {
    //     if (nextProd.name !== '') {
    //         addProd(nextProd);
    //         start(startCat+1)
    //     }
    // }, [nextProd.name]);
    // function addProd(nextProd){
    //     setFavorProds([...favorProds, nextProd])
    //     setShould(0)
    // }



    function getFavorite(IdsArr){
        axios.post(SRVRADDRESS, {oper:'get_item_info_by_id', ask_ids:IdsArr, mail:getCookie('user')})
        .then(list => {
            let prods = []
            list.data['list'].forEach((item) => {
                if(item.answer == 1){
                    const nextProd = {
                        id:item.id,
                        name:item.name,
                        brand:item.brand,
                        price:item.price,
                        src:item.photo,
                        is_liked:item.is_liked, 
                        description:item.description
                    }
                    prods.push(nextProd)
                    setFavorProds([...prods])
                }
            })
            setShould(0)
        })
    }
    function getStory(){
        let OrderNums = []
        let Story = []
        axios.post(SRVRADDRESS, {oper:'get_order_story', mail:getCookie('user')})
        .then(response => {
            OrderNums = response.data['nums']

            if(OrderNums === undefined || OrderNums.length === 0){
                return
            }
            
            OrderNums.forEach(order => {
                axios.post(SRVRADDRESS, {oper:'get_order_by_num', num:order})
                .then(response => {
                    const newOrder  = {
                        mail:response.data['mail'],
                        name:response.data['name'],
                        phone:response.data['phone'],
                        address:response.data['address'],
                        postcode:response.data['postcode'],
                        date:response.data['date'],
                        status:response.data['status'],
                        cart:[...response.data['busket']],
                        total:response.data['sum']
                    }
                    Story.push(newOrder)
                    setStory([...Story])
                })
                .catch(response => console.log(response))
            })
        })
    }






    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    useEffect(() => {
        async function getAccountInfo(){
            let response = await axios.post(SRVRADDRESS, {oper:'get_account_info_by_mail', mail:getCookie('user')});
        
            setAccountInfo({name:response.data['name'] == 'None'?'':response.data['name'], surname:response.data['surname'] == 'None' ?'' :response.data['surname'], age:response.data['age'] == 'None'?'':response.data['age'], net:response.data['net'] == 'None'?'':response.data['net'], phone:response.data['phone'] == 'None'?'':response.data['phone'], address:response.data['address'] == 'None'?'':response.data['address'], postcode:response.data['postcode'] == 'None'?'':response.data['postcode']})
            if(response.data['name'] != null && response.data['name'] != 'None'){
                setName(response.data['name'])
            }
        }
        function handleResize(){
            setWindowWidth(window.innerWidth);
        }

        if(getCookie('stat') == 'login'){
            getAccountInfo()
            getStory()

            axios.post(SRVRADDRESS, {oper:'liked_list', mail:getCookie('user')})
            .then(response => {
                let favDirtIds = [...response.data['ans']]
    
                if(favDirtIds.length === 0 || favDirtIds.length === undefined){
                    return
                }
    
                let favIds = []
                if(favDirtIds.length < 30){
                    favIds = favDirtIds
                }else{
                    favIds = favDirtIds.slice(0, 21)
                    setFavorIds(favDirtIds.slice(21))
                    setScrollFill(true)
                }

                getFavorite(favIds)
            })



            
            window.addEventListener('resize', handleResize);
            document.getElementById('to_hide').addEventListener('scroll', handleScroll);
            document.getElementById('mother_inp').children[0].style.minWidth = window.innerWidth + 'px'
            document.getElementById('mother_inp').children[1].style.minWidth = window.innerWidth + 'px'
            document.getElementById('fav_hist_inputs').children[0].style.minWidth = window.innerWidth + 'px'
            document.getElementById('fav_hist_inputs').children[1].style.minWidth = window.innerWidth + 'px'
    
    
            if(windowWidth <= 350){
                document.getElementById('catalog').style.gridTemplateColumns = 'repeat(1, 100%)'
            }else if(windowWidth > 350 && windowWidth <= 500){
                document.getElementById('catalog').style.gridTemplateColumns = 'repeat(2, 50%)'
            }else if(windowWidth > 500 && windowWidth <= 750){
                document.getElementById('catalog').style.gridTemplateColumns = 'repeat(3, 33,3%)'
            }else if(windowWidth > 750 && windowWidth <= 1200){
                document.getElementById('catalog').style.gridTemplateColumns = 'repeat(4, 25%)'
            }else if(windowWidth > 1200){
                document.getElementById('catalog').style.gridTemplateColumns = 'repeat(5, 20%)'
            }
    
    
        }else{
            navigate('/registr?func=log')
        }

        return() => {
            window.removeEventListener('resize', handleResize);
            document.getElementById('to_hide').removeEventListener('scroll', handleScroll);
        }
    }, [])



    useEffect(() => {
        document.getElementById('mother_inp').children[0].style.minWidth = window.innerWidth + 'px'
        document.getElementById('mother_inp').children[1].style.minWidth = window.innerWidth + 'px'
        document.getElementById('fav_hist_inputs').children[0].style.minWidth = window.innerWidth + 'px'
        document.getElementById('fav_hist_inputs').children[1].style.minWidth = window.innerWidth + 'px'

        var maxW = document.getElementById('net_input_part').offsetWidth
        document.getElementById('net_vk_input').style.minWidth = maxW-7 + 'px'
        document.getElementById('net_tg_input').style.minWidth = maxW-7 + 'px'

        if(vkTg == 'vk'){
            document.getElementById('mother_inp').style.left = '0'
        }else{
            document.getElementById('mother_inp').style.left = -window.innerWidth + 'px'
        }

        if(windowWidth <= 350){
            document.getElementById('catalog').style.gridTemplateColumns = 'repeat(1, 100%)'
        }else if(windowWidth > 350 && windowWidth <= 500){
            document.getElementById('catalog').style.gridTemplateColumns = 'repeat(2, 50%)'
        }else if(windowWidth > 500 && windowWidth <= 750){
            document.getElementById('catalog').style.gridTemplateColumns = 'repeat(3, 33.33%)'
        }else if(windowWidth > 750 && windowWidth <= 1200){
            document.getElementById('catalog').style.gridTemplateColumns = 'repeat(4, 25%)'
        }
    }, [windowWidth]);





    async function saveAccInfo(){
        await axios.post(SRVRADDRESS, {oper:'set_account_info_by_mail', mail:getCookie('user'), name:accountInfo.name, surname:accountInfo.surname, age:accountInfo.age, net:accountInfo.net, phone:accountInfo.phone, address:accountInfo.address, postcode:accountInfo.postcode});
        window.scrollBy({top: -window.scrollY, behavior : "smooth"});

        if(accountInfo.name != ''){
            setName(accountInfo.name)
        }
    }

    function OpenEditInfo(){
        if(document.getElementById('acc_edit').style.display == 'none' || document.getElementById('acc_edit').style.display == ''){
            document.getElementById('acc_edit').style.display = 'block'
            document.getElementById('acc_feat').style.display = 'none'

            var maxW = document.getElementById('net_input_part').offsetWidth
            document.getElementById('net_vk_input').style.minWidth = maxW-7 + 'px'
            document.getElementById('net_tg_input').style.minWidth = maxW-7 + 'px'

            setActive('opn')
        }else{
            document.getElementById('acc_edit').style.display = 'none'
            document.getElementById('acc_feat').style.display = 'block'

            setActive('cls')
        }
    }

    useEffect(() => {
        if(vkTg == 'vk'){
            document.getElementById('mother_inp').style.left = '0'
        }else{
            document.getElementById('mother_inp').style.left = -window.innerWidth + 'px'
        }
    }, [vkTg])
    useEffect(() => {
        if(favorHist == 'favor'){
            document.getElementById('fav_hist_inputs').style.left = '0'
        }else if(favorHist == 'hist'){
            document.getElementById('fav_hist_inputs').style.left = -window.innerWidth + 'px'
        }
    }, [favorHist])


    return(
        <div className="account">
            <div className="account_info_box">
                <div className="account_icon"></div>
                <div className="account_name">
                    {name == ''
                        ?getCookie('user')
                        :name
                    }
                </div>
                <div className={'account_edit ' + active} onClick={() => OpenEditInfo()}></div>
            </div>
            <div className="account_edit_info" id="acc_edit">
                <h1>Личная информация</h1>
                <div className="account_name_info">
                    <input
                        value={accountInfo.name}
                        onChange={(e) => setAccountInfo({...accountInfo, name:e.target.value})}
                        type="text"
                        className="log_reg_input"
                        id="name_input"
                    />
                    <h2>Имя</h2>
                    <input
                        value={accountInfo.surname}
                        onChange={(e) => setAccountInfo({...accountInfo, surname:e.target.value})}
                        type="text"
                        className="log_reg_input"
                        id="surname_input"
                    />
                    <h2>Фамилия</h2>
                    <input
                        value={accountInfo.age}
                        onChange={(e) => setAccountInfo({...accountInfo, age:e.target.value})}
                        type="text"
                        className="log_reg_input"
                        id="age_input"
                    />
                    <h2>Возраст</h2>
                </div>
                <h1>Контактная информация</h1>
                <div className="account_phone_info">
                    <div className="net_input_part" id="net_input_part">
                        <div className="white_slider">
                            {vkTg == 'tg'
                                ?<>
                                    <div onClick={() => setVkTg('vk')}>VK</div>
                                    <div className="white_slider_active" onClick={() => setVkTg('tg')}>Telegram</div>
                                </>
                                :<>
                                    <div className="white_slider_active" onClick={() => setVkTg('vk')}>VK</div>
                                    <div onClick={() => setVkTg('tg')}>Telegram</div>
                                </>
                            }
                        </div>
                        <div className="slider_vars" id="mother_inp">
                            <div>
                                <input
                                    value={accountInfo.net}
                                    onChange={(e) => setAccountInfo({...accountInfo, net:e.target.value})}
                                    type="text"
                                    placeholder="https://vk.com/vasyavasya"
                                    className="log_reg_input"
                                    id="net_vk_input"
                                />
                            </div>
                            <div>
                                <input
                                    value={accountInfo.net}
                                    onChange={(e) => setAccountInfo({...accountInfo, net:e.target.value})}
                                    type="text"
                                    placeholder="@vasyavasya"
                                    className="log_reg_input"
                                    id="net_tg_input"
                                />
                            </div>
                        </div>
                    </div>
                    <h2>Социальная сеть</h2>
                    <input
                        value={accountInfo.phone}
                        onChange={(e) => setAccountInfo({...accountInfo, phone:e.target.value})}
                        type="text"
                        className="log_reg_input"
                        id="phone_input"
                    />
                    <h2>Номер телефона</h2>
                    <input
                        readOnly
                        value={getCookie('user')}
                        type="text"
                        className="log_reg_input"
                        id="mail_input"
                    />
                    <h2>Email</h2>
                </div>
                <h1>Адрес</h1>
                <div className="account_address_info">
                    <input
                        value={accountInfo.address}
                        onChange={(e) => setAccountInfo({...accountInfo, address:e.target.value})}
                        type="text"
                        className="log_reg_input"
                        id="address_input"
                    />
                    <h2>Адрес</h2>
                    <input
                        value={accountInfo.postcode}
                        onChange={(e) => setAccountInfo({...accountInfo, postcode:e.target.value})}
                        type="text"
                        className="log_reg_input"
                        id="postcode_input"
                    />
                    <h2>Почтовый индекс</h2>
                </div>
                <BlackBut onClick={() => {saveAccInfo(); OpenEditInfo();}}>СОХРАНИТЬ</BlackBut>
            </div>
            <div className="account_features" id="acc_feat">
                <div className="white_slider">
                    {favorHist == 'hist'
                        ?<>
                            <div onClick={() => setFavorHist('favor')}>Избранное</div>
                            <div className="white_slider_active" onClick={() => setFavorHist('hist')}>История</div>
                        </>
                        :<>
                            <div className="white_slider_active" onClick={() => setFavorHist('favor')}>Избранное</div>
                            <div onClick={() => setFavorHist('hist')}>История</div>
                        </>
                    }
                </div>
                <div className="slider_vars" id='fav_hist_inputs'>
                    <div className="favor_part">
                        <Catalog prods={favorProds} SRVRADDRESS={SRVRADDRESS}/>
                        {favorProds.length != 0
                            ?<></>
                            :<h2>Добавьте товары в избранное, чтобы здесть что-то появилось</h2>
                        }
                    </div>
                    <div className="hist_part">
                        {story.map((story_item) =>
                            <StoryItem key={story_item.date} info={story_item} SRVRADDRESS={SRVRADDRESS}/>
                        )}
                        {story.length != 0
                            ?<></>
                            :<h2>Сделайте заказ, чтобы здесть что-то появилось</h2>
                        }
                    </div>
                    <ToTopBut/>
                </div>
            </div>
        </div>
    )
}

export default AccountPage; 