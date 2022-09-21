import React from 'react'
import MintPage from './MintPage'
import './styles/mint.css'

function App() {
  return (
    <div className="background">
      <div className="container">
        <img className="headerImage" src="/config/images/logo-win.png" />
        <div id="mintContainer">
          <MintPage />
        </div>
      </div>
    </div>
  )
}

export default App
