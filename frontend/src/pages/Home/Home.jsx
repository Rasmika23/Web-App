import React, { useState } from 'react'
import './Home.css'
import { Header } from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import { FoodDisplay } from '../../components/FoodDisplay/FoodDisplay'
import AppDownload from '../../components/AppDownload/AppDownload'

const Home = () => {
  const [category, setCategory] = useState("All")
  const [darkMode, setDarkMode] = useState(false)

  const toggleTheme = () => {
    setDarkMode(prev => !prev)
    document.body.classList.toggle("dark-mode", !darkMode)
  }

  return (
    <div className={`home-container ${darkMode ? 'dark' : 'light'}`}>
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {darkMode ? ' Light Mode' : ' Dark Mode'}
      </button>

      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownload />
    </div>
  )
}

export default Home
const toggleTheme = () => {
  setDarkMode(prev => {
    document.body.classList.toggle("dark-mode", !prev);
    return !prev;
  });
};

