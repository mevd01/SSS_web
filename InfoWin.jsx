import React from "react";
import classes from '../../../css/InfoWin.css'
import { Link } from "react-router-dom";

function InfoWin({children, ...props}){
    return(
        <Link to={props.path}><div className="info_win">
            {children}
        </div></Link>
    )
}

export default InfoWin;