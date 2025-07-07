import { useState } from 'react'
import './App.css'
import DraggableImage from './components/DraggableImage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DraggableImage />
    </>
  )
}

export default App
