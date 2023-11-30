import React, { useState } from "react"

function Captcha(props){

    //document.getElementsByClassName('captcha')[0].children[0].children[0].src

    return(
        <div className="captcha">
            <h1>Пожалуйста, подтвердите, что вы не робот</h1>
            <div>
                <img src={props.img}/>
            </div>
            <div>
                <input
                    value={props.value}
                    onChange={e => {props.setValue(e.target.value);}}
                />
            </div>
            <div className="cap_but_box">
                <button onClick={e => props.check('check')}>Обновить</button>
                <button onClick={e => props.check('check')}>Отправить</button>
            </div>
        </div>
    )
}

export default Captcha;