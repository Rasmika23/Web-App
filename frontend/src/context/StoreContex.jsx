import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    // const url = "http://localhost:4000";
    // const url = "https://web-app-production-7ad5.up.railway.app";
    const url = "https://tastio-backend-0nbh.onrender.com";
    const [token, setToken] = useState("")
    const [food_list, setFoodList] = useState([])

    // Add debugging
    console.log("Context cartItems:", cartItems);

    const addToCart = async (itemId) => {
        // Safety check to ensure cartItems is defined
        const safeCartItems = cartItems || {};
        
        if (!safeCartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if (token) {
            await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
        }
    }


    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))

        if (token) {
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        // Safety check to ensure cartItems is defined
        const safeCartItems = cartItems || {};
        
        for (const item in safeCartItems) {
            if (safeCartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if(itemInfo){
                    totalAmount += itemInfo.price * safeCartItems[item];
                }
            }
        }

        return totalAmount;
    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list");
        setFoodList(response.data.data)
    }

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url+"/api/cart/get",{},{headers:{token}});
            setCartItems(response.data.cartData || {});
        } catch (error) {
            console.log("Error loading cart data:", error);
            setCartItems({});
        }
    }

    useEffect(() => {

        async function loadData() {
            await fetchFoodList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"));
                await loadCartData(localStorage.getItem("token"));
            }
        }
        loadData();
    }, [])

    const contextValue = {
        food_list: food_list || [],
        cartItems: cartItems || {},
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token: token || "",
        setToken
    }

    console.log("Providing context value:", contextValue);

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}


export default StoreContextProvider
