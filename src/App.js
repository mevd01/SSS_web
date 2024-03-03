import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import classes from './css/General.css';
import axios from 'axios';

import Header from './components/Parts/MainItems/Header';
import Footer from './components/Parts/MainItems/Footer';

import MainPage from "./components/Pages/MainPage";
import AccountPage from "./components/Pages/AccountPage";
import ProductPage from "./components/Pages/ProductPage";
import LoginPage from "./components/Pages/LoginPage";
import UpdatePassPage from './components/Pages/UpdatePassPage';
import OrderPage from './components/Pages/OrderPage';
import CatalogPage from './components/Pages/CatalogPage';
import FuckQPage from './components/Pages/FuckYouPage';

import Cart from './components/Parts/MainItems/Cart';
import Menu from './components/Parts/MainItems/Menu';
import InfoWin from './components/Parts/MainItems/InfoWin';
import InfoOverWin from './components/Parts/MainItems/InfoOverWin';

function App() {
    const SRVRADDRESS = 'http://5.188.119.217/users/'    //МОЙ:  'http://127.0.0.1:8000/users/'   СЕРВЕР:   http://5.188.119.217/users/

    const[cartPermit, setCartPermit] = useState(false);
    const[menuPermit, setMenuPermit] = useState(false);
    const[InfoWinText, setInfoWinText] = useState('')

    const[addedProds, setAddedProds] = useState([]);
    const[tempCart, setTempCart] = useState([]);


    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }



    async function addToCart(newProd){
        let responce = axios.post(SRVRADDRESS, {oper:'add_in_busket', id:newProd.id, size:newProd.size, mail:getCookie('user')});

        responce.then(setAddedProds([...addedProds, newProd]))
    }

    function requant(operation, prod){
        if(operation === 'minus'){
            //setAddedProds(addedProds[addedProds.indexOf(prod)] = {...prod, quant: prod.quant-1})
            setTempCart(...addedProds)
            setAddedProds(tempCart => tempCart.map(item => {
                if (item.code === prod.code) {
                    return { ...item, quant: item.quant-- };
                } else {
                    return item;
                }
            }));
        }else if(operation === 'plus'){
            setTempCart(...addedProds)
            setAddedProds(tempCart => tempCart.map(item => {
                if (item.code === prod.code) {
                    return { ...item, quant: item.quant++ };
                } else {
                    return item;
                }
            }));
        }
    }
    function removeProd(prod){
        let responce = axios.post(SRVRADDRESS, {oper:'delete_from_busket', id:prod.id, size:prod.size, mail:getCookie('user')});
        
        responce.then(setAddedProds(addedProds.filter(p => p.code !== prod.code)))
    }





    function LogOut(){
        document.cookie = 'stat=logout; path=/; max-age=-1' // Запоминаем на пол года
        document.cookie = 'user=""; path=/; max-age=-1'
    }




    useEffect(() => {
        async function getCart(){
            var prod_responce = await axios.post(SRVRADDRESS, {oper:'get_busket', mail:getCookie('user')});
            
            if(prod_responce.data['ans'] == null){
                return
            }else{
                let arr = prod_responce.data['ans']
                let newAddedProds = [...addedProds]; // Создаем копию предыдущего состояния addedProds
                let idsArr = []
                for(let key in arr){
                    idsArr.push(arr[key][0])
                }
                axios.post(SRVRADDRESS, {oper:'get_item_info_by_id', ask_ids:idsArr, mail:getCookie('user')})
                .then(responce => {
                    let i = 0
                    responce.data['list'].forEach(element => {
                        if(element.answer !== 1){
                            return
                        }
                        
                        axios.post(SRVRADDRESS, {oper:'get_cost_by_id_and_size', id:element.id, size:arr[i][1], mail:getCookie('user')})
                        .then(price => {
                            const newCartProd = {
                                id: element.id,
                                name: element.name,
                                brand: element.brand,
                                price: price.data.cost,
                                src: element.photo,
                                size: arr[idsArr.indexOf(element.id)][1],
                                quant: 1,
                                code: element.id + arr[idsArr.indexOf(element.id)][1]
                            }
                            newAddedProds.push(newCartProd); // Добавляем новый объект к копии массива
                        })
                        ++i 
                    });
                })
                setAddedProds(newAddedProds); // Устанавливаем новое состояние addedProds с добавленными объектами
            }
        }


        document.getElementById('to_hide').style.height = window.innerHeight + 'px'
        document.getElementById('to_hide').style.overflow = 'scroll'


        getCart()
    }, [])




    return (
        <BrowserRouter>
            <div id='to_hide'>
                <Header openCart={setCartPermit} openMenu={setMenuPermit}/>

                <main>
                    <Routes>
                        <Route path="/" element={<CatalogPage err={setInfoWinText} SRVRADDRESS={SRVRADDRESS}/>} />
                        {/* <Route path="*" element={<MainPage />} /> */}
                        <Route path="/registr" element={<LoginPage SRVRADDRESS={SRVRADDRESS}/>} />
                        <Route path='/update_pass' element={<UpdatePassPage SRVRADDRESS={SRVRADDRESS}/>} />
                        <Route path="/catalog" element={<CatalogPage err={setInfoWinText} SRVRADDRESS={SRVRADDRESS}/>} />
                        <Route path="/account" element={<AccountPage SRVRADDRESS={SRVRADDRESS}/>} />
                        <Route path="/product" element={<ProductPage create={addToCart} permit={setCartPermit} err={setInfoWinText} SRVRADDRESS={SRVRADDRESS}/>} />
                        <Route path='/order' element={<OrderPage prods={addedProds} SRVRADDRESS={SRVRADDRESS} setCart={setAddedProds}/>} />
                        <Route path='/FAQ' element={<FuckQPage/>} />
                    </Routes>
                </main>

                <Footer/>
            </div>

            {InfoWinText !== ''
                ?<InfoWin path={'/registr?func=log'}>{InfoWinText}</InfoWin>
                :<></>
            }
            {/* <InfoOverWin>qwggvfd&</InfoOverWin> */}
            
            <Cart permit={cartPermit} prods={addedProds} closeCart={setCartPermit} remove={removeProd} requant={requant} SRVRADDRESS={SRVRADDRESS}/>
            <Menu permit={menuPermit} closeMenu={setMenuPermit} LogOut={LogOut} SRVRADDRESS={SRVRADDRESS}/>         
        </BrowserRouter>
    );
}

export default App;
