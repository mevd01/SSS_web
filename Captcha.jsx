import axios from "axios";
import React, { useEffect, useState } from "react"

function Captcha({SRVRADDRESS, operation, setOperation, setCapResponse, logRegErrInfo, ...props}){
    const [captchaValue, setCaptchaValue] = useState('');
    const[capSrc, setCapSrc] = useState('');


    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }


    useEffect(() => {
        async function Captcha(operation) {
            if (operation === 'create') {
                setCaptchaValue('')
                fetch(SRVRADDRESS, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ oper: 'create_captcha', cock_id:getCookie('user_id') })
                })
                .then(response => response.blob())
                .then(blob => {
                    setCapSrc(URL.createObjectURL(blob))
                });

                setOperation('none')
            } else if (operation === 'check') {
                if(captchaValue != ''){
                    let response = await axios.post(SRVRADDRESS, {oper:'check_captcha', user_input:captchaValue, cock_id:getCookie('user_id')});
                    setCapResponse(response.data['ans'] == true ?'yes' :'no')
                    setOperation('update')
                }else{
                    props.capResp({...logRegErrInfo, cap:'Введите капчу'})
                    setOperation('none')
                }
            } else if(operation === 'update'){
                await axios.post(SRVRADDRESS, {oper:'delete_captcha', cock_id:getCookie('user_id')});

                setCaptchaValue('')
                fetch(SRVRADDRESS, {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ oper: 'create_captcha', cock_id:getCookie('user_id') })
                })
                .then(response => response.blob())
                .then(blob => {
                    setCapSrc(URL.createObjectURL(blob))
                });

                setOperation('none')
            }else if(operation == 'delete'){
                await axios.post(SRVRADDRESS, {oper:'delete_captcha', cock_id:getCookie('user_id')});
                setOperation('none')
            }
        }

        if(operation != 'none'){Captcha(operation)}
    }, [operation]);






    return(
        <div className="captcha">
            <h1>Пожалуйста, подтвердите, что вы не робот</h1>
            <div className="cap_img_box">
                <img src={capSrc}/>
            </div>
            <div className="cap_but_box">
                <input
                    className="log_reg_input"
                    id="cap_inp"
                    value={captchaValue}
                    onChange={e => {setCaptchaValue(e.target.value); props.capResp({...logRegErrInfo, cap:'', reg:''})}}
                />
                <button onClick={() => setOperation('update')}>ОБНОВИТЬ</button>
            </div>
        </div>
    )
}

export default Captcha;