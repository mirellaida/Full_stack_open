import { useState } from 'react'

const Button=(props)=> {
   return <button onClick={props.handleClick}>{props.text}</button>
}

const StatisticLine = (props) => {
return (
  <p>
    {props.text} {props.value}
  </p>
)
}

const Statistics = (props)=>{
  if (!props.good ||!props.neutral || !props.bad) {
    return <p>No feedback given</p>
  }

  return (
     <div>
    <StatisticLine text="good" value={props.good}/>
    <StatisticLine text="neutral" value={props.neutral}/>
    <StatisticLine text="bad" value={props.bad}/>
    <StatisticLine text="all" value={props.good + props.neutral + props.bad}/>
    <StatisticLine text="average" value={(props.good - props.bad) / (props.good + props.neutral + props.bad)}/>
    <StatisticLine text="positive" value={(props.good * 100) / (props.good + props.neutral + props.bad) + " %"}/>
 </div>
 )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

const goodClicks= () => {
  return (
    setGood(good + 1)
  )
}

const neutralClicks= () => {
  return (
    setNeutral(neutral+ 1)
  )
}

const badClicks= () => {
  return (
    setBad(bad + 1)
  )
}


  return (
    <div>
    <h2>give feedback</h2>
    <h2>statistics</h2>
    <Button handleClick={goodClicks} text="good"/>
    <Button handleClick={neutralClicks} text="neutral"/>
    <Button handleClick={badClicks} text="bad"/>
    <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
 
}

export default App