import React, { useEffect, useState } from "react";

function SeachBar({search}){
  const[SearchValue, setSearchValue] = useState('')




  useEffect((e) => {
    function KeyPress(e){
      if (e.key === 'Enter' || e.keyCode === 13) {
        e.preventDefault();
        const input = document.getElementsByTagName('input');
        if (input[0] === document.activeElement) {
          search(SearchValue)
        }
      }
    }

    document.addEventListener('keypress', KeyPress);

    return () => {
      document.removeEventListener('keypress', KeyPress);  
    }
  }, [SearchValue])


  return(
    <div className='search_bar_place'>
      <div className='search_bar'>
        <input
          type='text'
          value={SearchValue}
          onChange={(e) => {setSearchValue(e.target.value)}}
        />
        <div className='search_icon' onClick={() => search(SearchValue)}></div>
      </div>
    </div>
  )
}

export default SeachBar;