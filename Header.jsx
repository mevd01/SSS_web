import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Header(props){
    const[windowWidth, setWindowWidth] = useState(window.innerWidth)
    const[permit, setPermit] = useState(true)
    useEffect(() => {
        if(windowWidth > 500){
            setPermit(true)
        }else{
            setPermit(false)
        }
    }, [windowWidth])

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        }
    
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])

    return(
        <header>
            <div className='menu_icon' onClick={() => {props.openMenu(true)}}></div>
            {permit
            ?   <div className='header_sections'>
                    <div><Link to='/catalog'>КАТАЛОГ</Link></div>
                    <div><Link to='/'>ОТЗЫВЫ</Link></div>
                    <div><Link to='/'>FAQ</Link></div>
                </div>
            :<></>
            }
            <div className='cart_icon' onClick={() => props.openCart(true)}></div>
      </header>
    )
}

export default Header;