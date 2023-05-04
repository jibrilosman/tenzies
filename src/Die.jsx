import React from 'react'
import './index.css'

const Die = (props) => {
  const styles = {
    backgroundColor: props.isHeld ? '#59E391' : '#fff',
    
  }
  return (
    <div 
    className='dice__face'
    style={styles}
    onClick={props.HoldDice}
    >
      <img src={props.value}  alt='dice' width={40}/>
    </div>
  )
}

export default Die