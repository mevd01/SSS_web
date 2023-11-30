import React, { useEffect, useState } from "react";
import mobile_detect from "https://cdnjs.cloudflare.com/ajax/libs/mobile-detect/1.4.4/mobile-detect.min.js"
import axios from "axios";
import classes from '../../css/CatalogPage.css';

import SeachBar from "../Parts/SearchBar";
import Catalog from "../Parts/Catalog";

function CatalogPage(){
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [columnsCount, setColumnsCount] = useState(1); // начальное количество колонок
    const[columnsWidth, setColumnsWidth] = useState(100 + '%');

    const[nextProd, setNextProd] = useState({id:1, name:'', brand:'', price:'', description:'', imgsrc:''})
    const[prods, setProds] = useState([])
    
    var oldpos = 0;
    var topPos = 0;
    var catpos = 1;




    // position: bottom: 20px
    function tpToTop(){
        window.scrollBy({top: -window.scrollY, behavior : "smooth"});
    }



    
    async function fillCatalog(){
        for(var i = catpos; i < catpos+10; ++i){
            var response = await axios.post('http://127.0.0.1:8000/users/', {oper:'get_item_info_by_id', id:i});
            if(response.data['answer'] == 1){
                //('description':x 'brand':x,'price':x,'photo_id':x )
                setNextProd({id:i, name:response.data['name'], brand:response.data['brand'], price:response.data['price'], description:response.data['description'], imgsrc:response.data['photo_id']})
            }else{
                break
            }
        }
        catpos += 10;
    }

    useEffect(() => {
        if (nextProd.name !== '') {
            // alert(nextProd.id + ' ' + nextProd.name + ' ' + prods.length)
            addProd(nextProd);
            // if(prodID%10 != 0){
            //     requestNextProd()
            // }


        }
    }, [nextProd.name]);

        // useEffect(() => {
    //     async function requestNextProd(){
    //         if(prodID == 0 || nextProd.id < prodID){
    //             var response = await axios.post('http://127.0.0.1:8000/users/', {oper:'get_item_info_by_id', id:prodID});
    //             if(response.data['answer'] == 1){
    //                 //('description':x 'brand':x,'price':x,'photo_id':x )
    //                 setNextProd({id:prodID, name:response.data['name'], brand:response.data['brand'], price:response.data['price'], description:response.data['description'], imgsrc:response.data['photo_id']})
    //                 alert(prodID + ' ' + response.data['name'])
    //             }
    //         }
    //     }

    //     requestNextProd()
    // }, [prodID])

    function addProd(nextProd){
        setProds([...prods, nextProd])
    }






  

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        }
    

        window.addEventListener('resize', handleResize);
        if(windowWidth <= 400){
            document.getElementById('catalog').style.gridTemplateColumns = 'repeat(1, 100%)'
            alert(document.getElementById('catalog').style.gridTemplateColumns)
        }else if(windowWidth > 400 && windowWidth <= 600){
            document.getElementById('catalog').style.gridTemplateColumns = 'repeat(2, 50%)'
            alert(document.getElementById('catalog').style.gridTemplateColumns)
        }else if(windowWidth > 600 && windowWidth <= 800){
            document.getElementById('catalog').style.gridTemplateColumns = 'repeat(3, 33,3%)'
            alert(document.getElementById('catalog').style.gridTemplateColumns)
        }else if(windowWidth > 800 && windowWidth <= 1200){
            document.getElementById('catalog').style.gridTemplateColumns = 'repeat(4, 25%)'
            alert(document.getElementById('catalog').style.gridTemplateColumns)
        }
        fillCatalog()
        
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, []);

    useEffect(() => {
      if(windowWidth <= 400){
        setColumnsCount(1);
      }else if(windowWidth > 400 && windowWidth <= 600){
        setColumnsCount(2);
      }else if(windowWidth > 600 && windowWidth <= 800){
        setColumnsCount(3);
      }else if(windowWidth > 800 && windowWidth <= 1200){
        setColumnsCount(4);
      }
      setColumnsWidth(100 / columnsCount + '%') // вычисляем ширину колонки в процентах
      document.getElementById('catalog').style.gridTemplateColumns = 'repeat(' + columnsCount + ', ' + columnsWidth + ')'
      alert('repeat(' + windowWidth + ', ' + columnsCount + ', ' + columnsWidth + ')')
    }, [windowWidth]);




    function handleScroll(){
        console.log(topPos)
        if(window.scrollY - oldpos > document.getElementById('catalog').children[0].clientHeight){
            oldpos += document.getElementById('catalog').children[0].clientHeight + 30
            ++topPos

            if(document.getElementById('catalog').children.length - topPos < 3){
                alert('yeah')
                fillCatalog()
            }
        }

        if(window.scrollY - oldpos < -100){
            document.getElementById('to_top').style.bottom = '20px'
        }else{
            document.getElementById('to_top').style.bottom = '-50px'
        }
    };


    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
        window.removeEventListener('scroll', handleScroll);
        }
    }, []);





    return(
        <>
            <h1>SSS</h1>
            <SeachBar/>
            <div className='search_filter'>
            <a>#teg</a>
            <a>#teg</a>
            <a>#teg</a>
            <a>#teg</a>
            </div>
            <div className='search_sorter'>
            <select>
                <option>Что-то</option>
                <option>Что-то</option>
                <option>Что-то</option>
            </select>
            </div>
            <Catalog prods={prods}/>
            <div id='to_top' onClick={tpToTop}>&lt;</div>
        </>
    )
}

export default CatalogPage;