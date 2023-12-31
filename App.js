import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import classes from './css/General.css';

import MainPage from "./components/Pages/MainPage";
import AccountPage from "./components/Pages/AccountPage";
import ProductPage from "./components/Pages/ProductPage";
import LoginPage from "./components/Pages/LoginPage";

import Header from './components/Parts/Header';
import CatalogPage from './components/Pages/CatalogPage';
import Cart from './components/Parts/Cart';
import Menu from './components/Parts/Menu';

function App() {
    const[cartPermit, setCartPermit] = useState(false);
    const[menuPermit, setMenuPermit] = useState(false);

    const[addedProds, setAddedProds] = useState([]);

    async function addToCart(newProd){
        // var responce = await axios.post('http://127.0.0.1:8000/users/', {oper:'add_to_cart', id:newProd.id, size:newProd.size});

        setAddedProds([...addedProds, newProd])
    }

    function requant(operation, prod){
        if(operation === 'minus'){
            //setAddedProds(addedProds[addedProds.indexOf(prod)] = {...prod, quant: prod.quant-1})
        }else if(operation === 'plus'){
            //setAddedProds(addedProds[addedProds.indexOf(prod)] = {...prod, quant: prod.quant+1})
        }
    }
    function removeProd(prod){
        setAddedProds(addedProds.filter(p => p.code !== prod.code))
    }

    useEffect(() => {
        console.log(addedProds)
    }, [addedProds])


    return (
        <BrowserRouter>
            <Header openCart={setCartPermit} openMenu={setMenuPermit}/>

            <main>
                <Routes>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/registr" element={<LoginPage />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/product" element={<ProductPage create={addToCart} permit={setCartPermit} />} />
                    <Route path="*" element={<MainPage />} />
                </Routes>
            </main>

            
            <Cart permit={cartPermit} prods={addedProds} closeCart={setCartPermit} remove={removeProd} requant={requant}/>
            <Menu permit={menuPermit} closeMenu={setMenuPermit}/>

            <footer>
                Футер)
            </footer>
        </BrowserRouter>
    );
}

export default App;
