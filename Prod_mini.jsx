import React, { useState } from "react";
import { Link } from "react-router-dom";

function Prod_mini({info}){
    return(
        <div className="prod_mini">
            <Link to={'/product?art=' + info.id}>
                <div className="prod_gallery">
                    <img src={info.imgsrc}/>
                </div>
                <div className="prod_tags">
                    <a>#cool</a>
                    <a>#cringe</a>
                    <a>#da</a>
                </div>
                <div className="prod_main_info">
                    <div>{info.name}</div>
                    <div>{info.price}</div>
                </div>
            </Link>
        </div>
    )
}

export default Prod_mini;