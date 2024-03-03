import React, { useEffect, useState } from "react";
import axios from "axios";
import classes from '../../css/CatalogPage.css';

import SeachBar from "../Parts/SearchBar";
import FilterPart from "../Parts/FilterPart";
import Catalog from "../Parts/Catalog";
import ToTopBut from "../UI/ToTopBut/ToTopBut";

function CatalogPage({err, SRVRADDRESS}){
    const[windowWidth, setWindowWidth] = useState(window.innerWidth);
    const[availScroll, setAvailScroll] = useState(window.scrollY)

    const[shouldFill, setShould] = useState('')
    const[catalogPos, setCatalogPos] = useState(0)
    const[startCat, start] = useState('')
    const[search, setSearch] = useState('')
    const[availSort, setAvailSort] = useState(0);
    const[dirts, setDirts] = useState([])
    const[prods, setProds] = useState([]);
    const[prodsIds, setProdIds] = useState([]);
    const[catStat, setCatStat] = useState('');

    const[costMin, setCostMin] = useState(0)
    const[costMax, setCostMax] = useState(1000000)
    const[gen, setGen] = useState(null);

    var widCof = 1000;
    var catCof = 5;


    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }


    useEffect(() => {
        if(startCat != '' && startCat < 2){
            setShould(1)
        }
    }, [startCat])


    

    function ApplyFilter(gen){
        setGen(gen)
    }
    useEffect(() => {
        if(gen != null){
            GetList();
        }
    }, [gen])
    function Search(search_value){
        GetList(search_value);
        setSearch(search_value)
    }
    useEffect(() => {
        GetList();
    }, [availSort])
    

    function GetList(ask_search = ''){
        console.log(gen)
        axios.post(SRVRADDRESS, {
            oper:'get_list_by_search',
            gen:(gen != null ?gen :''),
            ask:(search != '' ?search : ask_search),
            type:availSort,
            cost_min:costMin,
            cost_max:costMax,
            mail:getCookie('user')
        })
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
    function CreateIdsArr(begin = 0, end = 20){
        let IdsArr = []
        let i = begin
        while(i < end){
            IdsArr.push(prodsIds[i][0])
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
        if (catalog.children[catalog.children.length - 1].offsetTop - availScroll <= 2000) {
            setShould(1)
        }
    }, [availScroll])
    useEffect(() => {
        if(shouldFill == 1 && shouldFill != ''){
            setCatalogPos(catalogPos+1)
        }else{
            setShould(0)
        }
    }, [shouldFill])
    useEffect(() => {
        if(catalogPos != 0 && catalogPos*20 <= prodsIds.length){
            const ids = CreateIdsArr((catalogPos-1)*20, (prodsIds.length > catalogPos*20 ?catalogPos*20 :prodsIds.length))

            axios.post(SRVRADDRESS, {oper:'get_item_info_by_id', ask_ids:ids, mail:getCookie('user')})
            .then(response => setDirts(response.data['list']))
        }else if(catalogPos*20 > prodsIds.length){
            setCatStat('Пока на этом всё')
        }
    }, [catalogPos])
    useEffect(() => {
        if(dirts.length != 0){
            let tempArr = []
            let i = 0
            while(dirts.length > i){
                if(dirts[i].answer == 1){
                    //('description':x 'brand':x,'price':x,'photo_id':x )
                    const dirt_prod = {
                        id:dirts[i]['id'],
                        name:dirts[i]['name'],
                        brand:dirts[i]['brand'],
                        price:dirts[i]['price'],
                        description:dirts[i]['description'],
                        is_liked:dirts[i]['is_liked'],
                        src:dirts[i]['photo']
                    }
                    tempArr.push(dirt_prod)
                }else{
                    setCatStat('Пока на этом всё')
                    return
                }
                ++i
            }
            setProds([...prods, ...tempArr])
            setShould(0)
            start(startCat+1)
        }
    }, [dirts])




  


    useEffect(() => {
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
            <FilterPart sorted={setAvailSort} cost_min={setCostMin} cost_max={setCostMax} apply={ApplyFilter}/>
            <Catalog prods={prods} err={err} all={catStat} SRVRADDRESS={SRVRADDRESS}/>
            <ToTopBut/>
        </div>
    )
}

export default CatalogPage;
