import React from "react";
import { useEffect , useState } from "react";
import classes from '../../css/LoginPage.css';
import axios from "axios";
//если exist = 0, то надо зарегестрировать пользователя
//если exist = 1, то пользотель есть
import Captcha from "../Parts/Captcha";

function LoginPage(){
    const[loginData, setLoginData] = useState({mail: '', password: ''})
    const [capPermit, setCapPermit] = useState(false);
    const [captchaValue, setCaptchaValue] = useState('');
    const[file, setFile] = useState('');
    const[operation, setOperation] = useState('');

    async function CheckLogin(){
        var response = await axios.post('http://127.0.0.1:8000/users/', {oper:'user_exist',mail:loginData.mail});

        if(response.data['exist'] == 1){
            var but = document.getElementsByClassName('but')[0];
            but.style.backgroundColor = 'red';
        }else if(response.data['exist'] == 0){
            var but = document.getElementsByClassName('but')[0];
            but.style.backgroundColor = 'green';

            setOperation('create');

            var a = {};
            for(const key of Object.keys(loginData)){
                a[key] = loginData[key];
            }
            a['oper'] = 'reg_user';

            await axios.post('http://127.0.0.1:8000/users/', {...a});
        }
    }
    async function ChengeMail(value){
        document.cookie = 'dick=cock; path=/; max-age=31622400'
        var response = await axios.post('http://127.0.0.1:8000/users/', {oper:'check_correct_mail',mail:value});

        if(response.data['answer'] == 1){
            document.getElementsByClassName('alert_radio')[0].style.backgroundColor = 'red';
        }else if(response.data['answer'] == 2){
            document.getElementsByClassName('alert_radio')[0].style.backgroundColor = 'yellow';
        }else if(response.data['answer'] == 3){
            document.getElementsByClassName('alert_radio')[0].style.backgroundColor = 'green';
        }
    }

    useEffect(() => {
        async function Captcha(operation) {
            try {
                if (operation === 'create') {
                    var response = await axios.post('http://127.0.0.1:8000/users/', {oper:'create_captcha'});
                    setFile(response.data['name'])
                    setCapPermit(true);
                    setOperation('')
                } else if (operation === 'check') {
                    alert(captchaValue)
                    var response = await axios.post('http://127.0.0.1:8000/users/', {oper:'check_captcha', user_input:captchaValue, photo:file});
                    setCapPermit(false)
                    await axios.post('http://127.0.0.1:8000/users/', {oper:'delete_captcha', photo:file});
                    setFile('')
                }
            } catch (error) {
                console.error(error);
            }
        }
        Captcha(operation);
    }, [operation]);

    useEffect(() => {
    }, [captchaValue])

    return(
        <>
            <form className="login_part" method="post">
                <h1>Зарегестрироваться</h1>
                <div>
                    <input
                        value={loginData.mail}
                        onChange={e => {setLoginData({...loginData, mail: e.target.value}); ChengeMail(e.target.value)}}
                        type="text"
                        className="mail"
                    />
                    <div className="alert_radio"></div>
                </div>
                <input
                    value={loginData.password}
                    onChange={e => setLoginData({...loginData, password: e.target.value})}
                    type="password"
                    className="password"
                />
                <button className="but"onClick={(e) => {e.preventDefault(); CheckLogin()}}>Отправить</button>
            </form>

            

            <form className="signin_part">
                <h1>Войти</h1>
                <input type="text"/>
                <input type="text"/>    
                <button className="but">ОК</button>
            </form>


            {capPermit
                ?<Captcha check={setOperation} img={'img/captcha/' + file} setValue={setCaptchaValue}/>
                :<></>
            }
        </>
    )
}

export default LoginPage;