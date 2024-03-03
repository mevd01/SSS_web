import React from "react";
import { useEffect , useState } from "react";
import classes from '../../css/LoginPage.css';
import axios from "axios";
//если exist = 0, то надо зарегестрировать пользователя
//если exist = 1, то пользотель есть
import Captcha from "../Parts/Captcha";
import BlackBut from "../UI/BlackBut/BlackBut";
import { Link, useLocation, useNavigate } from "react-router-dom";

function LoginPage({SRVRADDRESS}){
    const[signupData, setSignupData] = useState({mail: '', password: '', mass:''})
    const[loginData, setLoginData] = useState({mail: '', password: ''})
    const[logRegMiskInfo, setLogRegMiskInfo] = useState({reg:'', log:''})
    const[logRegErrInfo, setLogRegErrInfo] = useState({reg:'', log:'', cap:'', mass:''})

    const[capResponse, setCapResponse] = useState('');
    const[operation, setOperation] = useState('');
    const[savePass, setSavePass] = useState(false);
    const[logReg, setLogReg] = useState('');
    const navigate = useNavigate();

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paramValue = params.get('func');

    //kfvmm.vdl@kf.fidw    qwerty

    function getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }




    function LogIn(savePas){
        ChengeMail(loginData.mail, 'log')
        .then(mail_ans => {
            if(mail_ans.data['answer'] === '1'){
                console.log(mail_ans.data['answer'])
                setLogRegErrInfo({...logRegErrInfo, log:'Неверный формат'})
                setOperation('update')
            }else{
                axios.post(SRVRADDRESS, {oper:'check_sign_in_user',mail:loginData.mail.replace(' ', ''), password:loginData.password.replace(' ', '')})
                .then(response => {
                    if(response.data['ans'] == 1){
                        if(savePas){
                            document.cookie = 'stat=login; path=/; max-age=15768000' // Запоминаем на пол года
                            document.cookie = 'user=' + loginData.mail + '; path=/; max-age=15768000'
                            navigate("/account");
                        }else{
                            document.cookie = 'stat=login; path=/; max-age=3600'// Запоминаем на 1 час
                            document.cookie = 'user=' + loginData.mail + '; path=/; max-age=3600'
                            navigate("/account");
                        }
                    }else{
                        setLogRegErrInfo({...logRegErrInfo, log:"Неверный ящик или пароль"})
                    }
                })
                .catch(setLogRegErrInfo({...logRegErrInfo, log:"Что-то пошло не так"}))
            }
        })
    }




    useEffect(() => {
        if(capResponse == 'yes'){
            CheckSignUp()
        }else if(capResponse == 'no'){
            setLogRegErrInfo({...logRegErrInfo, reg:'Неправильно введена капча'})
        }
        setCapResponse('')
    }, [capResponse])
    useEffect(() => {
        if(logRegErrInfo.reg == 'Неправильно введена капча'){
            setSignupData({...signupData, password:''})
        }
    }, [logRegErrInfo])
    async function CheckSignUp(){
        if(signupData.mail != '' && signupData.password != ''){
            ChengeMail(signupData.mail, 'reg')
            .then(response => {
                if(response.data['answer'] === '1'){
                    setLogRegErrInfo({...logRegErrInfo, reg:'Неверный формат'})
                    setOperation('update')
                }else if(response.data['answer'] === '2'){
                    setLogRegErrInfo({...logRegErrInfo, reg:'Эта почта уже зарегистрирована'})
                    setOperation('update')
                }else if(response.data['answer'] === '3'){
                    axios.post(SRVRADDRESS, {oper:'send_apply_mail',mail:signupData.mail})
                    .then(mass_ans => {
                        if(mass_ans.data['ans'] == true){
                            document.getElementById('sgn_prt').children[0].style.display = 'none'
                            document.getElementById('sgn_prt').children[1].style.display = 'flex'
                        }else{
                            setLogRegErrInfo({...logRegErrInfo, reg:'Что-то пошло не так, попробуйте ещё раз'})
                            setOperation('update')
                        }
                    })
                }
            })
        }else{
            setLogRegErrInfo({...logRegErrInfo, reg:'Заполните все поля'})
            setOperation('update')
        }
    }
    async function ChackMail(){
        if(signupData.mass != ''){
            var mass_ans = await axios.post(SRVRADDRESS, {oper:'check_correct_mail_code',mail:signupData.mail, code:signupData.mass});

            if(mass_ans.data['ans'] == true){
                var a = {};
                for(const key of Object.keys(signupData)){
                    a[key] = signupData[key];
                }
                a['oper'] = 'reg_user';
                await axios.post(SRVRADDRESS, {...a});
        
                document.cookie = 'stat=login; path=/; max-age=3600'// Запоминаем на 1 час
                document.cookie = 'user=' + loginData.mail + '; path=/; max-age=3600'
                navigate("/account");
            }else{
                setLogRegErrInfo({...logRegErrInfo, mass:'Неверный код подтверждения'})
            }
        }else{
            setLogRegErrInfo({...logRegErrInfo, mass:'Введите код подтверждения'})
        }
    }



    async function ChengeMail(value, operation){
        if(value !== ''){
            var response = await axios.post(SRVRADDRESS, {oper:'check_correct_mail', mail:value, user_id:getCookie('user_id')});

            if(operation == 'log'){
                var input = document.getElementById('login_mail')

                if(response.data['answer'] == 1){
                    input.style.borderBottomColor = 'red';
                    setLogRegMiskInfo({...logRegMiskInfo, log:'Неверный формат почтового ящика'})
                }else if(response.data['answer'] == 2){
                    input.style.borderBottomColor = 'green';
                    setLogRegMiskInfo({...logRegMiskInfo, log:''})
                }else if(response.data['answer'] == 3){
                    input.style.borderBottomColor = 'red';
                    setLogRegMiskInfo({...logRegMiskInfo, log:'Указанный почтовый ящик не зарегистрирован'})
                }
                return response
            }else{
                var input = document.getElementById('signup_mail')

                if(response.data['answer'] == 1){
                    input.style.borderBottomColor = 'red';
                    setLogRegMiskInfo({...logRegMiskInfo, reg:'Неверный формат почтового ящика'})
                }else if(response.data['answer'] == 2){
                    input.style.borderBottomColor = 'orange';
                    setLogRegMiskInfo({...logRegMiskInfo, reg:'Указанный почтовый ящик уже зарегистрирован'})
                }else if(response.data['answer'] == 3){
                    input.style.borderBottomColor = 'green';
                    setLogRegMiskInfo({...logRegMiskInfo, reg:''})
                }
                return response
            }
        }else{
            if(operation == 'log'){
                var input = document.getElementById('login_mail')

                input.style.borderBottomColor = 'rgb(216, 216, 216)';
                setLogRegMiskInfo({...logRegMiskInfo, log:''})
            }else{
                var input = document.getElementById('signup_mail')

                input.style.borderBottomColor = 'rgb(216, 216, 216)';
                setLogRegMiskInfo({...logRegMiskInfo, reg:''})
            }
        }
    }





    function ChangeLogReg(func = ''){
        if(func == 'reg'){
            setLogReg('reg')
            document.getElementById('slide_part').style.left = '0px'
        }else if(func == 'log'){
            setLogReg('log')
            document.getElementById('slide_part').style.left = -window.innerWidth + 'px'
        }else if(func == ''){
            if(document.getElementById('slide_part').style.left != '0px'){
                document.getElementById('slide_part').style.left = -window.innerWidth + 'px'
            }
        }
    }
    function handleResize(){
        document.getElementById('slide_part').children[0].style.minWidth = window.innerWidth + 'px'
        document.getElementById('slide_part').children[1].style.minWidth = window.innerWidth + 'px'

        document.getElementById('cap_inp').style.maxWidth = window.innerWidth-167 + 'px'
        ChangeLogReg()
    }
    // useEffect(() => {
    //     if(logReg == 'reg'){
    //         document.getElementById('slide_part').style.left = '0px'
    //     }else if(logReg == 'log'){
    //         document.getElementById('slide_part').style.left = -window.innerWidth + 'px'
    //     }
    // }, [logReg])


    useEffect(() => {
        if(getCookie('user_id') == undefined){
            axios.post(SRVRADDRESS, {oper:'get_new_cookies_id'})
            .then(response => {document.cookie = 'user_id=' + response.data['id'] + '; path=/; max-age=157680000'})
        }

        document.getElementById('slide_part').children[0].style.minWidth = window.innerWidth + 'px'
        document.getElementById('slide_part').children[1].style.minWidth = window.innerWidth + 'px'
        ChangeLogReg(paramValue);
        setOperation('create');

        document.getElementById('cap_inp').style.maxWidth = window.innerWidth-167 + 'px'

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            axios.post(SRVRADDRESS, {oper:'delete_captcha', cock_id:getCookie('user_id')});
        }
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
                    <div className="signup_part" id="sgn_prt">
                        <div>
                            <input
                                value={signupData.mail}
                                onChange={e => {setSignupData({...signupData, mail: e.target.value})}}
                                type="text"
                                className="log_reg_input"
                                id="signup_mail"
                            />
                            {logRegMiskInfo.reg !== ''
                                ?<h2 className="misk_info_h2">{logRegMiskInfo.reg}</h2>
                                :<></>
                            }
                            <h2>Почта</h2>
                            <input
                                value={signupData.password}
                                onChange={e => setSignupData({...signupData, password: e.target.value})}
                                type="password"
                                className="log_reg_input"
                                id="signup_pass"
                            />
                            <h2>Пароль</h2>
                            
                            <Captcha SRVRADDRESS={SRVRADDRESS} operation={operation} setOperation={setOperation} setCapResponse={setCapResponse} capResp={setLogRegErrInfo} logRegErrInfo={logRegErrInfo}/>
                            {logRegErrInfo.cap !== ''
                                ?<h2 className="cap_err">{logRegErrInfo.cap}</h2>
                                :<></>
                            }

                            <BlackBut onClick={() => setOperation('check')}>ПРОДОЛЖИТЬ</BlackBut>
                            <div className="log_reg_err">{logRegErrInfo.reg}</div>
                        </div>
                        <div id="mss_prt">
                            <input
                                value={signupData.mass}
                                onChange={e => setSignupData({...signupData, mass:e.target.value})}
                                type="text" 
                                className="log_reg_input"
                            />
                            <h2>Введите код подтверждения, отправленный на указанный ящик</h2>
                            <BlackBut onClick={() => {ChackMail(); setLogRegErrInfo({...logRegErrInfo, mass:''})}}>ПОДТВЕРДИТЬ</BlackBut>
                            {logRegErrInfo.mass !== ''
                                ?<h2 className="log_reg_err">{logRegErrInfo.mass}</h2>
                                :<></>
                            }
                        </div>
                    </div>

                    

                    <div className="signin_part">
                        <div>
                            <input
                                value={loginData.mail}
                                onChange={e => {setLoginData({...loginData, mail:e.target.value})}}
                                className="log_reg_input"
                                type="text"
                                id="login_mail"
                            />
                            {logRegMiskInfo.log !== ''
                                ?<h2 className="misk_info_h2">{logRegMiskInfo.log}</h2>
                                :<></>
                            }
                            <h2>Почта</h2>
                            <input
                                value={loginData.password}
                                onChange={e => setLoginData({...loginData, password: e.target.value})}
                                className="log_reg_input"
                                type="text"
                                id="login_pass"
                            />    
                            <h2>Пароль</h2>
                            <div className="save_me_log_reg">
                                <label><input type="checkbox" onChange={(e) => {setSavePass(e.target.checked)}}/>Запомнить меня</label>
                            </div>
                            <BlackBut onClick={() => LogIn(savePass)}>ВОЙТИ</BlackBut>
                            {logRegErrInfo.log !== ''
                                ?<h2 className="log_reg_err">{logRegErrInfo.log}</h2>
                                :<></>
                            }
                            <div className="update_pass"><Link to='/update_pass'>Забыли пароль?</Link></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage;