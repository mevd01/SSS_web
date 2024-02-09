import React, { Children } from "react";
import classes from '../../../css/InfoOverWin.css'

function InfoOverWin({children, ...props}){
    return(
        <div className="window_cover">
            <div className="info_over_window">
                <h1>{children}</h1>
                <div>
                    <div>ОТМЕНА</div>
                    <div>ПРИНЯТЬ</div>
                </div>
            </div>
        </div>
    )
}

export default InfoOverWin;