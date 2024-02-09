import React from "react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from '../../css/UpdatePassPart.css'

import BlackBut from "../UI/BlackBut/BlackBut";

function UpdatePassPage({SRVRADDRESS, ...props}){
    const[updateData, setUpdateData] = useState({mail:'', code:'', pass1:'', pass2:''})
    const[miskInfo, setMiskInfo] = useState('')
    const[addCode, setAddCode] = useState(false)
    const[updPass, setUpdPass] = useState(false)
    const[err, setErr] = useState('')

    const navigate = useNavigate();


    async function ChengeMail(value){
        if(value !== ''){
            const response = await axios.post(SRVRADDRESS, {oper:'check_correct_mail',mail:updateData.mail});

            const input = document.getElementById('login_mail')

            if(response.data['answer'] == 1){
                input.style.borderBottomColor = 'red';
                setMiskInfo('Неверный формат почтового ящика')
            }else if(response.data['answer'] == 2){
                input.style.borderBottomColor = 'green';
                setMiskInfo('')
            }else if(response.data['answer'] == 3){
                input.style.borderBottomColor = 'red';
                setMiskInfo('Указанный почтовый ящик не зарегистрирован')
            }
        }else{
            const input = document.getElementById('login_mail')

            input.style.borderBottomColor = 'rgb(216, 216, 216)';
            setMiskInfo('')
        }
    }

    function SendMail(){
        ChengeMail()
        console.log(updateData.mail)
        if(updateData.mail === '' || miskInfo !== ''){
            return
        }

        axios.post(SRVRADDRESS, {oper:'send_apply_update_password_mail', mail:updateData.mail})
        .then(response => {
            if(response.data['ans'] === true){
                setAddCode(true)
                setErr('')
            }else{
                setErr('Что-то пошло не так')
            }
        })
        .catch(
            setErr('Что-то пошло не так')
        )
    }

    function CheckMail(){
        axios.post(SRVRADDRESS, {oper:'check_correct_mail_code', mail:updateData.mail, code:updateData.code})
        .then(response => {
            if(response.data['ans'] == true){
                setUpdPass(true)
                setAddCode(false)
                setErr('')
            }else{
                setErr('Неверный код подтверждения')
            }
        })
        .catch(
            setErr('Что-то пошло не так')
        )
    }

    function UpdatePass(){
        axios.post(SRVRADDRESS, {oper:'update_password', mail:updateData.mail, new_pswrd:updateData.pass1})
        .then(response => {
            if(response.data['ok'] == 1){
                navigate("/registr?func=log")
            }else{
                setErr('Что-то пошло не так')
            }
        })
        .catch(
            setErr('Что-то пошло не так')
        )
    }

    return(
        <div className="update_pass_part">
            {updPass == true
                ?<>
                    <input
                        value={updateData.pass1}
                        onChange={e => setUpdateData({...updateData, pass1: e.target.value})}
                        className="log_reg_input"
                        type="text"
                        id="login_pass"
                    />    
                    <h2>Введите новый пароль</h2>
                    <BlackBut onClick={() => {UpdatePass()}}>ПОДТВЕРДИТЬ</BlackBut>
                    {err != ''
                        ?<h2 className="err_h2">{err}</h2>
                        :<></>
                    }
                </>
                :addCode == false
                    ?<>
                        <input
                            value={updateData.mail}
                            onChange={e => {setUpdateData({...updateData, mail:e.target.value}); ChengeMail(e.target.value)}}
                            className="log_reg_input"
                            type="text"
                            id="login_mail"
                        />
                        {miskInfo !== ''
                            ?<h2 className="misk_info_h2">{miskInfo}</h2>
                            :<h2>Почта</h2>
                        }
                        <BlackBut onClick={() => {SendMail()}}>ВОСТАНОВИТЬ ПАРОЛЬ</BlackBut>
                        {err != ''
                            ?<h2 className="err_h2">{err}</h2>
                            :<></>
                        }
                    </>
                    :<>
                        <div className="up_title">Вам на почту был отправлен код подтверждения</div>
                        <input
                            value={updateData.code}
                            onChange={e => {setUpdateData({...updateData, code:e.target.value})}}
                            className="log_reg_input"
                            type="text"
                            id="login_mail"
                        />
                        <h2>Введите код подтверждения</h2>
                        <BlackBut onClick={() => {CheckMail()}}>ПОДТВЕРДИТЬ</BlackBut>
                        {err != ''
                            ?<h2 className="err_h2">{err}</h2>
                            :<></>
                        }
                    </>
                                
                }
        </div>
    )
}

export default UpdatePassPage;