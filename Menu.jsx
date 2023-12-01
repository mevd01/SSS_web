import React, { useEffect, useState } from "react";
import classes from '../../css/Menu.css'
import { Link } from "react-router-dom";

function Menu(props){
    const[windowWidth, setWindowWidth] = useState(window.innerWidth)
    const[permit, setPermit] = useState(true)
    useEffect(() => {
        if(windowWidth > 500){
            setPermit(false)
        }else{
            setPermit(true)
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

    useEffect(() => {
        var elem = document.getElementById('menu')
        if(props.permit){
            elem.style.left = '0px'
            document.getElementsByTagName('main')[0].style.height = (window.innerHeight - 60) + 'px';
            document.getElementsByTagName('main')[0].style.overflow = 'hidden'
            document.getElementsByTagName('footer')[0].style.display = 'none'
        }else{
            elem.style.left = '-100%'
            document.getElementsByTagName('main')[0].style.height = '100%';
            document.getElementsByTagName('main')[0].style.overflow = 'scroll'
            document.getElementsByTagName('footer')[0].style.display = 'block'
        }
    }, [props.permit])

    return(
        <div className="menu_window" id="menu">
            <div className="menu_spec_space">
                <div className="inmenu_logo"></div>
                <div id="close_menu" onClick={() => {props.closeMenu(false)}}></div>
            </div>
            <div className="menu_main_part">
                {permit
                ?   <div className='menu_sections'>
                        <Link to='/catalog'><div onClick={() => {props.closeMenu(false)}}>КАТАЛОГ<div className="inmenu_more_icon"></div></div></Link>
                        <Link to='/'><div onClick={() => {props.closeMenu(false)}}>ОТЗЫВЫ<div className="inmenu_more_icon"></div></div></Link>
                        <Link to='/'><div onClick={() => {props.closeMenu(false)}}>FAQ<div className="inmenu_more_icon"></div></div></Link>
                    </div>
                :<></>
                }
                <div className="log_reg_links">
                    <Link to='/registr'><div className="reg_link" onClick={() => {props.closeMenu(false)}}>РЕГИСТРАЦИЯ</div></Link>
                    <Link to='/registr'><div className="login_link" onClick={() => {props.closeMenu(false)}}>ВОЙТИ</div></Link>
                </div>
            </div>
        </div>
    )
}

export default Menu;