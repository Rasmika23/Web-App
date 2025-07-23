import React, { useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'

const LoginPopup = ({setShowLogin}) => {
    const [currState, setCurrState] = useState("Signup")


  return (
    <div className='login-popup'>
        <form className='login-popup-container'>
            <div className='login-popup-title'>
                <h2>{currState}</h2>
                <img onClick={() =>setShowLogin(false)} src={assets.cross_icon} />

            </div>

            <div className='login-popup-input'>
                {currState==="Login"?<></>:
                    <input type = "text" placeholder='Your name' required></input>
                }
                
                <input type = "email" placeholder='Your email' required></input>
                <input type = "password" placeholder='Your password' required></input>


                
            </div>

            <button>{currState==="Signup"?"Create account":"Login"}</button>

            <div className='login-popup-condition'>
                <input type="checkbox" required></input>
                <p>By continuing, I aggree to the terms of use & privacy policy.</p>
            </div>
            
            {currState==='Login'?<p>Create a new account?<span onClick={()=>setCurrState("Signup")}>Click here</span></p>
                                :<p>Already have an account?<span onClick={()=>setCurrState("Login")}>Login here</span></p>
            }

            
            
        </form>
    </div>
  )
}

export default LoginPopup

