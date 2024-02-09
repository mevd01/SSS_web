import React, { useEffect, useState } from "react";
import classes from '../../../css/Menu.css'
import { Link } from "react-router-dom";
import axios from "axios";

function Menu({SRVRADDRESS, ...props}){
    const[windowWidth, setWindowWidth] = useState(window.innerWidth)
    const[accName, setAccName] = useState('')



    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    useEffect(() => {
        var elem = document.getElementById('menu')
        if(props.permit){
            elem.style.left = '0px'
            document.getElementById('to_hide').style.overflow = 'hidden'
        }else{
            elem.style.left = '-100%'
            document.getElementById('to_hide').style.overflow = 'scroll'
        }
    }, [props.permit])




    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        }
        async function getAccName(){
            let response = await axios.post(SRVRADDRESS, {oper:'get_account_info_by_mail', mail:getCookie('user')});

            if(response.data['name'] != undefined){
                setAccName(response.data['name'])
            }
        }

        if(getCookie('stat') == 'login'){
            getAccName()
        }

    
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])


    
    return(
        <div className="menu_window" id="menu">
            <div className="menu_spec_space">
                <div className="inmenu_logo"></div>
                <div id="close_menu" onClick={() => {props.closeMenu(false)}}></div>
            </div>
            <div className="menu_main_part">
                <div className='menu_sections'>
                    <Link to='/catalog'><div onClick={() => {props.closeMenu(false)}}>КАТАЛОГ<div className="inmenu_more_icon"></div></div></Link>
                    <Link to='/'><div onClick={() => {props.closeMenu(false)}}>ОТЗЫВЫ<div className="inmenu_more_icon"></div></div></Link>
                    <Link to='/FAQ'><div onClick={() => {props.closeMenu(false)}}>FAQ<div className="inmenu_more_icon"></div></div></Link>
                </div>
                {getCookie('stat') !== 'login'
                    ?<div className="log_reg_links">
                        <Link to='/registr?func=reg'><div className="reg_link" onClick={() => {props.closeMenu(false)}}>РЕГИСТРАЦИЯ</div></Link>
                        <Link to='/registr?func=log'><div className="login_link" onClick={() => {props.closeMenu(false)}}>ВОЙТИ</div></Link>
                    </div>
                    :<div className="menu_profile_part">
                        <Link to='/account'><div className="menu_profile_but" onClick={() => {props.closeMenu(false)}}>
                            <div className="menu_profile_icon"></div>
                            <div className="menu_profile_name">{accName != '' && accName != 'None' ?accName :getCookie('user')}</div>
                            <div className="menu_profile"></div>  
                        </div></Link>
                        <Link to='/'><div className="menu_logout" onClick={() => {props.closeMenu(false); props.LogOut()}}>ВЫЙТИ</div></Link>
                    </div>
                }
            </div>
        </div>
    )
}

export default Menu;