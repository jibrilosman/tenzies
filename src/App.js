import React, { useEffect, useState } from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "react-confetti"
import Dice1 from "./images/Dice1.png"
import Dice2 from "./images/Dice2.png"
import Dice3 from "./images/Dice3.png"
import Dice4 from "./images/Dice4.png"
import Dice5 from "./images/Dice5.png"
import Dice6 from "./images/Dice6.png"


function App() {
  const diceImages = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6]

  const [dice, setDice] = useState(AllNewDice())
  const [tenzies, setTenzies] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [startTime, setStartTime] = useState(null);
  const [timeTaken, setTimeTaken] = useState(null);
  const [bestTime, setBestTime] = useState(null);

  useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if (allHeld && allSameValue) {
      setTenzies(true)
    } 
  }, [dice])

  

  useEffect(() => {
    if (clickCount > 0) {
      const endTime = Date.now();
      const timeTaken = endTime - startTime;
      localStorage.setItem('timeTaken', timeTaken);
      setTimeTaken(timeTaken);

      const bestTimeFromStorage = localStorage.getItem('bestTime');
      if (bestTimeFromStorage || timeTaken < bestTimeFromStorage) {
        localStorage.setItem('bestTime', timeTaken);
        setBestTime(timeTaken);
      }

    }
  }, [clickCount, startTime]);


  useEffect(() => {
    const timeTakenFromStorage = localStorage.getItem('timeTaken');
    if (timeTakenFromStorage) {
      setTimeTaken(timeTakenFromStorage);
    }

    const bestTimeFromStorage = localStorage.getItem('bestTime');
    if (bestTimeFromStorage) {
      setBestTime(bestTimeFromStorage);
    }

  }, []);



  // function to generate a random dice image from the array of images above 
  // and return an object with the value of the image
  function GenerateDice() {
    return {
      value: diceImages[Math.floor(Math.random() * diceImages.length)],
      isHeld: false,
      id: nanoid()
    }
  }
  // function to generate an array of 10 dice objects using the GenerateDice function above  
  // and return the array of dice objects  
  function AllNewDice() {
    const newDice = []
    for (let i = 0; i < 10; i++) {
      newDice.push(GenerateDice())
    }
      return newDice
    }
  // function to set the state of the dice array to the array of dice objects returned from the AllNewDice function above
  // and return the array of dice objects  
  //the function is called when the Roll Dice button is clicked
  function RollDice() {
    if(!tenzies) {
      setDice(oldDice => oldDice.map(die => {
        return die.isHeld ? die : GenerateDice()
      }))
    } else {
      setTenzies(false)
      setDice(AllNewDice())
      setClickCount(-1)
     
    }
  }

  function HoldDice(id) {
    setDice(oldDice => oldDice.map(die => {
      return die.id === id ? 
      {...die, isHeld: !die.isHeld} 
      : die
    }))
  }

  function ClickTracker() {
    setClickCount(clickCount => clickCount + 1);
    if(clickCount === 0) {
      setStartTime(Date.now());
    }
  }

  // function to map over the array of dice objects and return a Die component for each object in the array  
  // and return the array of Die components  
  // the key prop is set to the index of the array of dice objects 
  const diceElements = dice.map(die => (
    <Die 
      key={die.id} 
      value={die.value} 
      isHeld={die.isHeld}
      HoldDice={() => HoldDice(die.id)} />
  ))
     

  return (
    <main>
      {tenzies && <Confetti />}
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. 
      Click each die to freeze it at its current value between rolls.</p>
     
      <div className="dice__container">
        { diceElements}
        
      </div>
       <button 
          className="roll__dice" 
          onClick={() => {
            RollDice();
            ClickTracker();
          }}>
          {tenzies ? "New Game": "Roll Dice"}
        </button>
        <p>You have rolled the dice {clickCount} times.</p>
      {tenzies && timeTaken && <p>It took you {Math.floor(timeTaken / 1000)} seconds to win.</p>}
      {tenzies && bestTime && <p>Your best time is {Math.floor(bestTime / 1000)} seconds.</p>}
    </main>
  );
}
export default App;

