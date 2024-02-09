import React, { useEffect } from "react";
import Prod_mini from './StackItems/Prod_mini';

function Catalog({prods, err, all, SRVRADDRESS}){
    return(
        <>
            <div className='catalog' id="catalog">
                {prods.lenght != 0
                    ?prods.map((prod) =>
                        <Prod_mini info={prod} key={prod.id} err={err} SRVRADDRESS={SRVRADDRESS}/>
                    )
                    :<h2>Подгружаем каталог</h2>
                }
            </div>
            {all != ''
                ?<div className="after_cat">{all}</div>
                :<div className="after_cat">Подгружаем интересные товары...</div>
            }
        </>
    )
}

export default Catalog;