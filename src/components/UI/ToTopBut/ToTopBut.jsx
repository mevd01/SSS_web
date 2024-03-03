import React, { useEffect } from "react";
import classes from './ToTopBut.module.css'

const ToTopBut = () => {
    var fastPos = 0;

    // position: bottom: 20px
    function tpToTop(){
        document.getElementById('to_hide').scrollBy({top: -document.getElementById('to_hide').scrollTop, behavior : "smooth"});
        fastPos = 0
    }

    useEffect(() => {
        document.getElementById('to_hide').addEventListener('scroll', handleScroll);
        return () => {
            document.getElementById('to_hide').removeEventListener('scroll', handleScroll);
        }
    }, [])

    function handleScroll(){
        if(document.getElementById('to_hide').scrollTop - fastPos < 0 && document.getElementById('to_hide').scrollTop > 200){
            document.getElementById('to_top').style.bottom = '20px'
        }else{
            document.getElementById('to_top').style.bottom = '-50px'
        }
        fastPos = document.getElementById('to_hide').scrollTop;
    };

    return(
        <div id="to_top" className={classes.ToTopBut} onClick={tpToTop}></div>
    )
}

export default ToTopBut;