import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContex'

export const FoodItem = ({id,name,price,description,image}) => {

    const contextValue = useContext(StoreContext)
    console.log("FoodItem context value:", contextValue);
    
    const {cartItems, addToCart,removeFromCart,url} = contextValue || {};

    // Safety check to ensure cartItems is defined
    const safeCartItems = cartItems || {};
    
    console.log("FoodItem cartItems:", cartItems, "safeCartItems:", safeCartItems);

    // If context is not available, return early
    if (!contextValue) {
        console.log("Context not available in FoodItem");
        return <div>Loading...</div>;
    }

  return (
    <div className='food-item'>
        <div className="food-item-img-container">
            <img className='food-item-image' src={url+"/images/"+image} alt='' />
            {
                    !safeCartItems[id]? <img className='add' onClick={()=>addToCart(id)} src={assets.add_icon_white} alt=''/>
                            : <div className="food-item-counter">
                                <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt='' />
                                <p>{safeCartItems[id]}</p>
                                <img onClick={()=>addToCart(id)} src={assets.add_icon_green} alt='' />
                            </div>
            }
        </div>
        <div className="food-item-info">
            <div className="food-item-name-rating">
                <p>{name}</p>
                <img src={assets.rating_starts} alt='' />
                
            </div>
            <p className="food-item-description">
                {description}
            </p>
            <p className="food-item-price">LKR {price}</p>
        </div>
    </div>
  )
}
