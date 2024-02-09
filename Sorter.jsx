import React, { useEffect, useState } from "react";
import classes from '../../css/Sorter.css'

function Sorter({sorted, ...props}){
    const[availSort, setAvailSort] = useState(0);
    const[sortText, SetSortText] = useState('По популярности')
    const[sorterStat, setSorterStat] = useState(0)  // 1 - открыт     0 - закрыт

    function ChangeSort(sort_type){
        if(sort_type !== availSort){
            document.getElementById('sort_' + availSort).style.backgroundColor = 'white'
            setAvailSort(sort_type);
        }else{
            setSorterStat(0)
        }
    }
    useEffect(() => {
        if(availSort === 0){
            SetSortText('По популярности')
            document.getElementById('sort_' + availSort).style.backgroundColor = 'rgb(216, 216, 216)'
            setSorterStat(0)
            sorted(0)
        }else if(availSort === -1){
            SetSortText('По убыванию')
            document.getElementById('sort_' + availSort).style.backgroundColor = 'rgb(216, 216, 216)'
            setSorterStat(0)
            sorted(-1)
        }else if(availSort === 1){
            SetSortText('По возрастанию')
            document.getElementById('sort_' + availSort).style.backgroundColor = 'rgb(216, 216, 216)'
            setSorterStat(0)
            sorted(1)
        }
    }, [availSort])


    function ChangeStat(){
        if(sorterStat === 1){
            setSorterStat(0)
        }else{
            setSorterStat(1)
        }
    }
    useEffect(() => {
        if(sorterStat === 1){
            document.getElementById('srt_vrs').style.display = 'block'
            document.getElementById('srt_vrs').style.opacity = 1
            document.getElementById('srt_icn').style.transform = 'rotate(90deg)'
        }else{
            document.getElementById('srt_vrs').style.opacity = 0
            document.getElementById('srt_vrs').style.display = 'none'
            document.getElementById('srt_icn').style.transform = 'rotate(-90deg)'
        }
    }, [sorterStat])


    return(
            <div className="sorter_item">
                <div className="avail_sort" onClick={() => ChangeStat()}>
                    <span>{sortText}</span>
                    <div className="sort_icon" id="srt_icn"></div>
                </div>
                <div className="sort_vars" id="srt_vrs">
                    <div id="sort_0" onClick={() => ChangeSort(0)}>По популярности</div>
                    <div id="sort_1" onClick={() => ChangeSort(1)}>По возрастанию цены</div>
                    <div id="sort_-1" onClick={() => ChangeSort(-1)}>По убыванию цены</div>
                </div>
            </div>
    )
}

export default Sorter