 import React from 'react'
import './Header.css'

export const Header = () => {
  return (
    <div className='header'>
      <video
        className="header-video"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/yo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="header-content">
        <h2>Order your favourite food here</h2>
        <p>
          Choose from a diverse menu featuring a delectable array of dishes
          crafted with the finest ingredients.
        </p>
        <button>View Menu</button>
      </div>
    </div>
  )
}
