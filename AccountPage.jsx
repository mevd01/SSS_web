import React from "react";
import classes from '../../css/AccountPage.css'

function AccountPage(){
    return(
        <div className="account">
            <div className="account_info_box">
                <div>Вячеслав Астафьев</div>
                <div>Vycheslav.78@main.ru</div>
                <div>@coolVycheslav</div>
                <div>г. Ленинград, ул. Старая...</div>
                <div>45 лет</div>
            </div>
            <div className="account_features">
                <div className="history">История<span>+</span></div>
                <div className="favorit">Избранное<span>+</span></div>
            </div>
        </div>
    )
}

export default AccountPage; 