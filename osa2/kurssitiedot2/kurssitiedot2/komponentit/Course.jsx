const Header = (props) => <h1>{props.course}</h1>

const Content = ({parts}) => {
 return (
 <div>
  {
    parts.map((part)=>(
      <Part key={part.id} part={part}/>
    ))}
  </div>
)
}

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = ({parts}) => {
  return (
    <h4>
      total of  {parts.reduce((sum, parts) => sum + parts.exercises, 0)} exercises
    </h4>
  )
}

const Course = ({course}) => {
return (
<div>
  <Header course={course.name}/>
  <Content parts={course.parts}/>
  <Total parts={course.parts}/>
</div>
)
}

export default Course