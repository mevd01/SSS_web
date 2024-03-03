import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Header(props){
    const[windowWidth, setWindowWidth] = useState(window.innerWidth)
    const[permit, setPermit] = useState(true)

    const location = useLocation();

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
            {/* {permit
            ?   <div className='header_sections'>
                    <div><Link to='/catalog'>КАТАЛОГ</Link></div>
                    <div><Link to='/'>ОТЗЫВЫ</Link></div>
                    <div><Link to='/FAQ'>FAQ</Link></div>
                </div>
            :<></>
            } */}
            {location.pathname !== '/order'
                ?<div className='cart_icon' onClick={() => props.openCart(true)}></div>
                :<div className='cart_icon disabled'></div>
            }
      </header>
    )
}

export default Header;