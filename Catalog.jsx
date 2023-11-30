import React from "react";
import Prod_mini from './Prod_mini';

function Catalog({prods}){
    return(
        <div className='catalog' id="catalog">
            {prods.map((prod) =>
                <Prod_mini info={prod} key={prod.id}/>
            )}
        </div>
    )
}

export default Catalog;