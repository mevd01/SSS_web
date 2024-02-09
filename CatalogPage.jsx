import React, { useEffect, useState } from "react";
import axios from "axios";
import classes from '../../css/CatalogPage.css';

import SeachBar from "../Parts/SearchBar";
import FilterPart from "../Parts/FilterPart";
import Catalog from "../Parts/Catalog";
import ToTopBut from "../UI/ToTopBut/ToTopBut";

function CatalogPage({err, SRVRADDRESS}){
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const[availScroll, setAvailScroll] = useState(window.scrollY)
    const[shouldFill, setShould] = useState('')
    const[catalogPos, setCatalogPos] = useState(0)
    const[startCat, start] = useState('')
    const[search, setSearch] = useState('')
    const[availSort, setAvailSort] = useState(0);
    const[nextProd, setNextProd] = useState({id:1, name:'', brand:'', price:'', description:''})
    const[prods, setProds] = useState([]);
    const[prodsIds, setProdIds] = useState([]);
    const[catStat, setCatStat] = useState('');

    const[costMin, setCostMin] = useState(0)
    const[costMax, setCostMax] = useState(1000000)

    var widCof = 1000;
    var catCof = 5;



    useEffect(() => {
        console.log(startCat)
        if(startCat != '' && startCat < 40){
            setShould(1)
        }
    }, [startCat])


    

    function Search(search_value){
        GetList(search_value);
        setSearch(search_value)
    }
    useEffect(() => {
        GetList();
    }, [availSort])
    

    function GetList(ask_search = ''){
        axios.post(SRVRADDRESS, {oper:'get_list_by_search', ask:(search != '' ?search : ask_search), type:availSort, cost_min:costMin, cost_max:costMax})
        .then(response => {
            if(response.data['ids'] !== '-1'){
                setShould(0)
                setProdIds(response.data['ids'])
                setCatalogPos(0)
                setProds([]);
                start(1)
                setCatStat('')
            }else{
                setProds([]);
                err('Ничего не найдено')
                setCatStat('Пока на этом всё')
                setTimeout(() => {
                    err('')
                }, 6000);
            }
        })
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
        if (catalog.children[catalog.children.length - 1].offsetTop - availScroll <= 2000) {
            setShould(1)
        }
    }, [availScroll])
    useEffect(() => {
        if(shouldFill == 1 && shouldFill != ''){
            setCatalogPos(catalogPos+1)
            console.log('qwerty')
        }
    }, [shouldFill])
    useEffect(() => {
        if(catalogPos != 0 && catalogPos <= prodsIds.length){
            axios.post(SRVRADDRESS, {oper:'get_item_info_by_id', id:prodsIds[catalogPos-1][0]})
            .then(response => {
                if(response.data['answer'] == 1){
                    //('description':x 'brand':x,'price':x,'photo_id':x )
                    setNextProd({id:prodsIds[catalogPos-1][0], name:response.data['name'], brand:response.data['brand'], price:response.data['price'], description:response.data['description']})
                }else{
                    setCatStat('Пока на этом всё')
                }
            })
            setShould(0)
        }else if(catalogPos > prodsIds.length){
            setCatStat('Пока на этом всё')
        }
    }, [catalogPos])
    useEffect(() => {
        if (nextProd.name !== '') {
            addProd(nextProd);
            start(startCat+1)
        }
    }, [nextProd.name]);
    function addProd(nextProd){
        setProds([...prods, nextProd])
    }




  


    useEffect(() => {
        //alert(document.cookie)
        window.addEventListener('resize', handleResize);
        document.getElementById('to_hide').addEventListener('scroll', handleScroll);

        function handleResize(){
            setWindowWidth(window.innerWidth);
        }

        if(windowWidth <= 350){
            document.getElementById('catalog').style.gridTemplateColumns = 'repeat(1, 100%)'
            widCof = 700
            catCof = 1
        }else if(windowWidth > 350 && windowWidth <= 500){
            document.getElementById('catalog').style.gridTemplateColumns = 'repeat(2, 50%)'
            widCof = 1000
            catCof = 2
        }else if(windowWidth > 500 && windowWidth <= 750){
            document.getElementById('catalog').style.gridTemplateColumns = 'repeat(3, 33.3%)'
            widCof = 1300
            catCof = 3
        }else if(windowWidth > 750 && windowWidth <= 1200){
            document.getElementById('catalog').style.gridTemplateColumns = 'repeat(4, 25%)'
            widCof = 1500
            catCof = 4
        }else if(windowWidth > 1200){
            document.getElementById('catalog').style.gridTemplateColumns = 'repeat(5, 20%)'
            widCof = 1700
            catCof = 5
        }

        //GetList()
        return () => {
            window.removeEventListener('resize', handleResize);
            document.getElementById('to_hide').removeEventListener('scroll', handleScroll);
        }
    }, [])

    useEffect(() => {
        if(windowWidth <= 350){
            document.getElementById('catalog').style.gridTemplateColumns = 'repeat(1, 100%)'
            widCof = 700
            catCof = 1
        }else if(windowWidth > 350 && windowWidth <= 500){
            document.getElementById('catalog').style.gridTemplateColumns = 'repeat(2, 50%)'
            widCof = 1000
            catCof = 2
        }else if(windowWidth > 500 && windowWidth <= 750){
            document.getElementById('catalog').style.gridTemplateColumns = 'repeat(3, 33.3%)'
            widCof = 1300
            catCof = 3
        }else if(windowWidth > 750 && windowWidth <= 1200){
            document.getElementById('catalog').style.gridTemplateColumns = 'repeat(4, 25%)'
            widCof = 1500
            catCof = 4
        }else if(windowWidth > 1200){
            document.getElementById('catalog').style.gridTemplateColumns = 'repeat(5, 20%)'
            widCof = 1700
            catCof = 5
        }
    }, [windowWidth]);




    return(
        <div className="catalog_part">
            <h1>SSS</h1>
            <SeachBar search={Search}/>
            <FilterPart sorted={setAvailSort} cost_min={setCostMin} cost_max={setCostMax} apply={GetList}/>
            <Catalog prods={prods} err={err} all={catStat} SRVRADDRESS={SRVRADDRESS}/>
            <ToTopBut/>
        </div>
    )
}

export default CatalogPage;
