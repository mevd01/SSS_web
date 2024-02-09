import React, { useEffect, useState } from 'react';

const FilterPriceRanger = ({cost_min, cost_max}) => {
    const[minVal, setMinVal] = useState(0);
    const[nowMin, setNowMin] = useState(0);
    const[textMin, setTextMin] = useState(0);
    const[maxVal, setMaxVal] = useState(1000);
    const[nowMax, setNowMax] = useState(1000);
    const[textMax, setTextMax] = useState(1000000);
    const[err, setErr] = useState('')

    const range = document.getElementById('progress')
    const priceGap = 10;


    useEffect(() => {
        if(maxVal - nowMin > priceGap){
            setMinVal(nowMin)
        }else{
            setMinVal(maxVal - priceGap)
        }
    }, [nowMin])
    useEffect(() => {
        if(nowMax - minVal > priceGap){
            setMaxVal(nowMax)
        }else{
            setMaxVal(Number(minVal) + Number(priceGap))
        }
    }, [nowMax])
    useEffect(() => {
        if(range != null){
            if (maxVal - minVal > priceGap){
                range.style.left = (minVal / document.getElementById('min_inp').max) * 100 + "%";
                range.style.right = 100 - (maxVal / document.getElementById('max_inp').max) * 100 + "%";

                cost_max(maxVal*maxVal)
                //setTextMax(maxVal)
            }
        }
    }, [maxVal])
    useEffect(() => {
        if(range != null){
            if (maxVal - minVal > priceGap){
                range.style.left = (minVal / document.getElementById('min_inp').max) * 100 + "%";
                range.style.right = 100 - (maxVal / document.getElementById('max_inp').max) * 100 + "%";
            
                cost_min(minVal*minVal)
                //setTextMin(minVal)
            }
        }
    }, [minVal])
    useEffect(() => {
        if(Number(Math.sqrt(textMax)) - minVal > priceGap){
            setMaxVal(Number(Math.sqrt(textMax)))
        }else{
            setMaxVal(Number(minVal) + Number(priceGap))
        }
    }, [textMax])
    useEffect(() => {
        if(maxVal - Number(Math.sqrt(textMin)) > priceGap){
            setMinVal(Number(Math.sqrt(textMin)))
        }else{
            setMinVal(maxVal - priceGap)
        }
    }, [textMin])





    return (
        <div className="wrapper">
            <div className="price-input">
                <div className="field">
                    <span>Min</span>
                    <input type="number" className="log_reg_input" value={minVal*minVal} onChange={(e) => setMinVal(e.target.value)}/>
                </div>
                <div className="separator">-</div>
                <div className="field">
                    <span>Max</span>
                    <input type="number" className="log_reg_input" value={maxVal*maxVal} onChange={(e) => setTextMax(e.target.value)}/>
                </div>
            </div>
            <div className="slider">
                <div className="progress" id='progress'></div>
            </div>
            <div className="range-input">
                <input
                    type="range"
                    className="range-min"
                    id='min_inp'
                    min="10"
                    max="1000"
                    step="10"
                    value={minVal}
                    onChange={(e) => setNowMin(e.target.value)}
                />
                <input
                    type="range"
                    className="range-max"
                    id='max_inp'
                    min="10"
                    max="1000"
                    step="10"
                    value={maxVal}
                    onChange={(e) => setNowMax(e.target.value)}
                />
            </div>
        </div>
    );
};

export default FilterPriceRanger;