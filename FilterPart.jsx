import React, { useEffect, useState } from "react";
import classes from '../../css/FilterPart.css'

import Sorter from "./Sorter";
import FilterPriceRanger from "./FilterPriceRanger";
import BlackBut from "../UI/BlackBut/BlackBut";

function FilterPart({sorted, gen, cost_min, cost_max, apply, ...props}){
    const[stat, setStat] = useState(0);
    const[permition, setPermition] = useState('1')

    function ChangeStat(){
        if(stat == 1){
            setStat(0)
        }else{
            setStat(1)
        }
    }
    useEffect(() => {
        if(stat == 1){
            document.getElementById('open_filter').style.display = 'flex'
        }else if(stat == 0)(
            document.getElementById('open_filter').style.display = 'none'
        )
    }, [stat])

    return(
        <div className="filter_part">
            <div className="filter_item">
                <div className="filter_icon" onClick={() => ChangeStat()}><span>Фильтр</span></div>
                <div className="open_filter_part" id="open_filter">
                    <div className="filter_gender">
                        <div>ПОЛ</div>
                        <label><input type="checkbox" name="gender"/><span>Мужской</span></label>
                        <label><input type="checkbox" name="gender"/><span>Женский</span></label>
                        <label><input type="checkbox" name="gender"/><span>Унисекс</span></label>
                    </div>
                    <div className="filter_but_n_price">
                        <FilterPriceRanger cost_min={cost_min} cost_max={cost_max}/>
                        <BlackBut id='filter_but' onClick={() => {ChangeStat(); apply()}}>ПРИМЕНИТЬ</BlackBut>
                    </div>
                </div>
            </div>
            <Sorter sorted={sorted}/>
        </div>
    )
}

export default FilterPart;