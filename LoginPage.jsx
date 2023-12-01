import React from "react";
import { useEffect , useState } from "react";
import classes from '../../css/LoginPage.css';
import axios from "axios";
//если exist = 0, то надо зарегестрировать пользователя
//если exist = 1, то пользотель есть
import Captcha from "../Parts/Captcha";

function LoginPage(){
    const[signupData, setSignupData] = useState({mail: '', password: ''})
    const[loginData, setLoginData] = useState({mail: '', password: ''})

    const [capPermit, setCapPermit] = useState(false);
    const [captchaValue, setCaptchaValue] = useState('');
    const[file, setFile] = useState('');
    const[operation, setOperation] = useState('');
    const[logReg, setLogReg] = useState('reg');

    async function CheckLogin(){
        var response = await axios.post('http://127.0.0.1:8000/users/', {oper:'user_exist',mail:signupData.mail});

        if(response.data['exist'] == 1){
            var but = document.getElementsByClassName('but')[0];
            but.style.backgroundColor = 'red';
        }else if(response.data['exist'] == 0){
            var but = document.getElementsByClassName('but')[0];
            but.style.backgroundColor = 'green';

            setOperation('create');

            var a = {};
            for(const key of Object.keys(signupData)){
                a[key] = signupData[key];
            }
            a['oper'] = 'reg_user';

            await axios.post('http://127.0.0.1:8000/users/', {...a});
        }
    }
    async function ChengeMail(value, operation){
        document.cookie = 'dick=cock; path=/; max-age=31622400'
        var response = await axios.post('http://127.0.0.1:8000/users/', {oper:'check_correct_mail',mail:value});

        if(operation == 'log'){
            var input = document.getElementById('login_mail')

            if(response.data['answer'] == 1){
                input.style.borderBottomColor = 'red';
            }else if(response.data['answer'] == 2){
                input.style.borderBottomColor = 'green';
            }else if(response.data['answer'] == 3){
                input.style.borderBottomColor = 'red';
            }
        }else{
            var input = document.getElementById('signup_mail')

            if(response.data['answer'] == 1){
                input.style.backgroundColor = 'red';
            }else if(response.data['answer'] == 2){
                input.style.backgroundColor = 'yellow';
            }else if(response.data['answer'] == 3){
                input.style.backgroundColor = 'green';
            }
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



    function ChangeLogReg(func){
        if(func == 'reg'){
            setLogReg('reg')
            document.getElementById('slide_part').style.left = '0px'
        }else{
            setLogReg('log')
            document.getElementById('slide_part').style.left = -window.innerWidth + 'px'
        }
    }
    useEffect(() => {
        document.getElementById('slide_part').children[0].style.minWidth = window.innerWidth + 'px'
        document.getElementById('slide_part').children[1].style.minWidth = window.innerWidth + 'px'
    }, [window.innerWidth])


    useEffect(() => {
        document.getElementById('slide_part').children[0].style.minWidth = window.innerWidth + 'px'
        document.getElementById('slide_part').children[1].style.minWidth = window.innerWidth + 'px'
    }, [])

    return(
        <>
            <div className="log_reg_changer">
                {logReg == 'reg'
                ?   <><div className="log_reg_chacked" onClick={() => {ChangeLogReg('reg')}}>РЕГИСТРАЦИЯ</div>
                    <div onClick={() => {ChangeLogReg('log')}}>ВХОД</div></>
                :   <><div onClick={() => {ChangeLogReg('reg')}}>РЕГИСТРАЦИЯ</div>
                    <div className="log_reg_chacked" onClick={() => {ChangeLogReg('log')}}>ВХОД</div></>
                }
            </div>
            <div className="log_page_main_part">
                <div className="log_reg_slide_part" id="slide_part">
                    <form className="login_part" method="post">
                        <h1>Зарегестрироваться</h1>
                        <div>
                            <input
                                value={signupData.mail}
                                onChange={e => {setSignupData({...signupData, mail: e.target.value}); ChengeMail(e.target.value, 'reg')}}
                                type="text"
                                className="log_reg_input"
                                id="signup_mail"
                            />
                            <div className="alert_radio"></div>
                        </div>
                        <input
                            value={signupData.password}
                            onChange={e => setSignupData({...signupData, password: e.target.value})}
                            type="password"
                            className="log_reg_input"
                            id="signup_pass"
                        />
                        <button className="but"onClick={(e) => {e.preventDefault(); CheckLogin()}}>Отправить</button>
                    </form>

                    

                    <form className="signin_part">
                        <div>
                            <input
                                value={loginData.mail}
                                onChange={e => {setLoginData({...loginData, mail: e.target.value}); ChengeMail(e.target.value, 'log')}}
                                className="log_reg_input"
                                type="text"
                                id="login_mail"
                            />
                            <h2>Почта</h2>
                            <input
                                value={loginData.password}
                                onChange={e => setLoginData({...loginData, password: e.target.value})}
                                className="log_reg_input"
                                type="text"
                                id="login_pass"
                            />    
                            <h2>Пароль</h2>
                            <button className="but">ВОЙТИ</button>
                        </div>
                    </form>
                </div>


                {capPermit
                    ?<Captcha check={setOperation} img={'img/captcha/' + file} setValue={setCaptchaValue}/>
                    :<></>
                }
            </div>
        </>
    )
}

export default LoginPage;