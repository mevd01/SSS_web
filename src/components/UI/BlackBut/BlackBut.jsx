import React from "react";
import classes from './BlackBut.module.css';

const BlackBut = ({children, ...props}) => {
    return(
        <div {...props} className={classes.black_but}>
            {children}
        </div>
    )
}

export default BlackBut;