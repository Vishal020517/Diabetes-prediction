import React from 'react'
// import { GoClock } from "react-icons/go";
import { GoClock } from "react-icons/go";
import { FaHeartbeat } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { FaShieldAlt } from "react-icons/fa";
import Image from '../src/assets/medical.png'
import { Link, useNavigate } from 'react-router-dom'
import './App.css'
function App() {
  const navigate = useNavigate();
  const handleStartAssessmentClick = () => {
    console.log("Navigating to /Form");
    navigate('/Form'); 
  };
  return (
    <>
      <div className='main-pg'>
        <div className='top-nav'>
          <div className='Logo'>
            <p><FaHeartbeat/></p>
            <h3>Diabetes Check</h3>
          </div>
          <div className='features'>
            <p>Features</p>
            <p>About</p>
            <button onClick={handleStartAssessmentClick}>Start Assessment</button>
          </div>
        </div>
        <div className='content'>
          <div className='top'>
            <div className='left'>
              <h2>Take Control of Your</h2>
              <h2 className='color-text'> Health Today</h2>
              <p>Our advanced diabetes risk assessment tool helps understand your health better. Get  <br/>  personalized insights based on your  health metrics in just a few minutes.</p>
              <div className='left-btns'>
                <button onClick={handleStartAssessmentClick}>Start Free Assessment</button>
                <button>Learn More</button>
              </div>
            </div>
            <div className='right'>
              <img src={Image}/>
            </div>
          </div>
          <div className='bottom'>
            <div className='des'>
              <h2>Why Choose Our Assessment Tool?</h2>
              <p>Comprehensive health evaluation backed by medical research</p>
            </div>
            <div className='features'>

              <div className='box'>
                <div><p><GoClock/></p></div>
                <h3>Quick Assessment</h3>
                <p>Complete your risk assessment in less than 5 minutes</p>
              </div>
              <div className='box'>
                <div><p><FaShieldAlt/></p></div>
                <h3>Privacy First</h3>
                <p>Your health data is secure and never shared</p>
              </div>
              <div className='box'>
                <div><p><GoGraph/></p></div>
                <h3>Accurate Results</h3>
                <p>Based on established medical guidelines</p>
              </div>
            </div>
          </div>
        </div>
          
      </div>
    </>
  )
}

export default App