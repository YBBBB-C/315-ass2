import { useState, useEffect, ChangeEvent } from 'react'
import { ProductList } from './Components/ProductList'
import itemList from './Assets/random_products_175.json'
import './e-commerce-stylesheet.css'
//import React from 'react'

type Product = {
  id: number
  name: string
  price: number
  category: string
  quantity: number
  rating: number
  image_link: string
}

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [searchedProducts, setSearchedProducts] = useState<Product[]>(itemList)
  const [resultsMessage, setResultsMessage] = useState('')
  // ===== Hooks =====
  useEffect(() => updateSearchedProducts(), [searchTerm])

  // ===== Basket management =====
  function showBasket() {
    let areaObject = document.getElementById('shopping-area')
    if (areaObject !== null) {
      areaObject.style.display = 'block'
    }
  }

  function hideBasket() {
    let areaObject = document.getElementById('shopping-area')
    if (areaObject !== null) {
      areaObject.style.display = 'none'
    }
  }

  // ===== Search =====
  function updateSearchedProducts() {
    const filteredProducts = itemList.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    let message = ''
    setResultsMessage(`${filteredProducts.length} Products`)
    if (searchTerm === '') {
      message = `${itemList.length} Products`
    } else {
      message =
        filteredProducts.length === 0
          ? 'No search results found'
          : filteredProducts.length === 1
          ? '1 Result'
          : `${filteredProducts.length} Results`
    }
    setResultsMessage(message) // Update the state instead of manipulating the DOM
    setSearchedProducts(filteredProducts)
  }
  function handleSortChange(event: ChangeEvent<HTMLSelectElement>) {
    const sortType = event.target.value
    const sortedProducts = [...searchedProducts].sort((a, b) => {
      switch (sortType) {
        case 'AtoZ':
          return a.name.localeCompare(b.name)
        case 'ZtoA':
          return b.name.localeCompare(a.name)
        case '£LtoH':
          return a.price - b.price
        case '£HtoL':
          return b.price - a.price
        case '*LtoH':
          return a.rating - b.rating
        case '*HtoL':
          return b.rating - a.rating
        default:
          return 0
      }
    })
    setSearchedProducts(sortedProducts)
  }

  function handleStockChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.checked) {
      const inStockProducts = itemList.filter((item) => item.quantity > 0)
      setSearchedProducts(inStockProducts)
    } else {
      updateSearchedProducts()
    }
  }

  return (
    <div id="container">
      <div id="logo-bar">
        <div id="logo-area">
          <img src="./src/assets/logo.png"></img>
        </div>
        <div id="shopping-icon-area">
          <img
            id="shopping-icon"
            onClick={showBasket}
            src="./src/assets/shopping-basket.png"></img>
        </div>
        <div id="shopping-area">
          <div id="exit-area">
            <p id="exit-icon" onClick={hideBasket}>
              x
            </p>
          </div>
          <p>Your basket is empty</p>
        </div>
      </div>
      <div id="search-bar">
        <input
          type="text"
          placeholder="Search..."
          onChange={(changeEventObject) =>
            setSearchTerm(changeEventObject.target.value)
          }></input>

        <div id="control-area">
          <select onChange={handleSortChange}>
            <option value="AtoZ">By name (A - Z)</option>
            <option value="ZtoA">By name (Z - A)</option>
            <option value="£LtoH">By price (low - high)</option>
            <option value="£HtoL">By price (high - low)</option>
            <option value="*LtoH">By rating (low - high)</option>
            <option value="*HtoL">By rating (high - low)</option>
          </select>
          <input
            id="inStock"
            type="checkbox"
            onChange={handleStockChange}></input>
          <label htmlFor="inStock">In stock</label>
        </div>
      </div>
      <p id="results-indicator">{resultsMessage}</p>
      {/* Other JSX */}
      //
      <ProductList itemList={searchedProducts} />
    </div>
  )
}

export default App
