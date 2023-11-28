import React from "react";
import { Link } from "react-router-dom";

function Header(props){
    

    return(
        <header>
            <Link to='/'><div className='menu_icon'></div></Link>
            <div className='header_sections'>
                <div><Link to='/catalog'>КАТАЛОГ</Link></div>
                <div><Link to='/'>ОТЗЫВЫ</Link></div>
                <div><Link to='/'>FAQ</Link></div>
            </div>
            <div className='cart_icon' onClick={() => props.openCart(true)}>КОРЗИНА</div>
      </header>
    )
}

export default Header;