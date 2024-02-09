import React from "react";
import { Link } from "react-router-dom";

function Footer(){
    return(
        <footer>
            <div className="footer_about">
                <h1>О НАС</h1>
                <ul>
                    <li>г. Москва, ул. Раменки 7к2, подъезд 2</li>
                    <li>sneakersaleshopsss@gmail.com</li>
                </ul>
                <div className="social_part">
                    <div className="social_nets">
                        <Link to='https://t.me/sss_sneaker_sale_shop'><div className="tg"></div></Link>
                        <Link to='https://vk.com/sneakersaleshop'><div className="vk"></div></Link>
                        <Link to='https://www.instagram.com/sneaker.shop.sss/'><div className="inst"></div></Link>
                        <Link to='https://www.tiktok.com/@sneakersaleshop?is_from_webapp=1&sender_device=pc'><div className="tt"></div></Link>
                    </div>
                    <div className="footer_about_img"></div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;