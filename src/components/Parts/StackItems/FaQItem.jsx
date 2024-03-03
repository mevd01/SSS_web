import React, { useEffect, useState } from "react";

function FaQItem({children, img1, img2, ...props}){
    const[stat, setStat] = useState('close');

    function open(){
        if(stat == 'close'){
            setStat('open')
        }else{
            setStat('close')
        }
    }
    useEffect(() => {
        if(stat == 'close'){
            document.getElementById(props.id).style.transform = 'rotate(-90deg)'
            document.getElementById(props.id + '_disc').style.display = 'none'
        }else{
            document.getElementById(props.id).style.transform = 'rotate(90deg)'
            document.getElementById(props.id + '_disc').style.display = 'block'
        }
    }, [stat])

    useEffect(() => {

    }, [])

    return(
        <div className="faq_var">
            <div className="faq_name" onClick={() => open()}>
                <h1>{props.name}</h1>
                <div className="faq_open_icon" id={props.id}></div>
            </div>
            <div className="faq_disc" id={props.id + '_disc'}>
                <div className="two_photo_grid">
                    <img src={"./img/faq_photos/" + img1}/>
                    <img src={"./img/faq_photos/" + img2}/>
                </div>
                {children}
            </div>
        </div>
    )
}

export default FaQItem;