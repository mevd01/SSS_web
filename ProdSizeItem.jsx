import React, { useEffect, useState } from "react";

function ProdSizeItem({setPrice, setSize, ...props}){
    const[disabled, setDisabled] = useState(false)

    function set(){
        setPrice(props.price)
        setSize(props.size)
    }

    useEffect(() => {
        if(props.price == '-'){
            setDisabled(true)
        }
    }, [])
    useEffect(() => {
        if(props.price == '-'){
            setDisabled(true)
        }else{
            setDisabled(false)
        }
    }, [props.price])

    if(props.size != ''){
        return(
            <label className="size_var" onClick={() => {props.price != '-' ?set() :<></>}}>
                {disabled
                    ?<>
                        <input type="radio" name="size_checker" disabled/>
                        <div>
                            <div className="var_size">{/[0-9]/.test(props.size[1]) ?'EU '+props.size :props.size}</div>
                            <div className="var_price inactive"></div>
                        </div>
                    </>
                    :<>
                        <input type="radio" name="size_checker"/>
                        <div>
                            <div className="var_size">{/[0-9]/.test(props.size[1]) ?'EU '+props.size :props.size}</div>
                            <div className="var_price">{props.price + '₽'}</div>
                        </div>
                    </>
                }
            </label>
        )
    }
}

export default ProdSizeItem;