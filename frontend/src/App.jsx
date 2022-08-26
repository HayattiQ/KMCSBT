import React from 'react'
import MintPage from './MintPage'
import './styles/mint.css'

function App() {
  return (
    <div className="background">
      <div className="container">
        <img className="headerImage" src="/config/images/logo-win.jpg" />
        <div id="mintContainer">
          <MintPage />
        </div>
        <img className="footerImage" src="/config/images/mago-logo.jpg" />
      </div>
    </div>
  )
}

export default App
