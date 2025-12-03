import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const CartContext = createContext();

export function useCart(){ return useContext(CartContext); }

export function CartProvider({ children }){
  const [items, setItems] = useState(()=> JSON.parse(localStorage.getItem('cart')||'[]'))
  const [coupon, setCoupon] = useState(null)
  const [lowStockProducts, setLowStockProducts] = useState(()=> items.filter(item => item.product?.inventory?.stock < 5))

  useEffect(()=>{ localStorage.setItem('cart', JSON.stringify(items)) }, [items])

  function add(item){
    const addQty = item.qty || 1
    const existing = items.find(i=> i.product._id === item.product._id)
    const existingQty = existing?.qty || 0
    const newQty = existingQty + addQty
    const stock = item.product?.inventory?.stock
    if(typeof stock === 'number' && newQty > stock){
      return { ok: false, message: 'Not enough stock available' }
    }
    setItems(prev=>{
      const found = prev.find(i=> i.product._id === item.product._id)
      if(found) return prev.map(i=> i.product._id === item.product._id ? ({...i, qty: i.qty + addQty}) : i)
      return [...prev, { product: item.product, qty: addQty }]
    })
    return { ok: true }
  }
  function remove(productId){ setItems(prev => prev.filter(i=>i.product._id !== productId)) }
  function updateQty(productId, qty){
    if(qty < 1) qty = 1
    const item = items.find(i => i.product._id === productId)
    if(!item) return { ok: false, message: 'Item not found in cart' }
    const stock = item.product?.inventory?.stock
    if(typeof stock === 'number' && qty > stock) return { ok: false, message: 'Not enough stock available' }
    setItems(prev => prev.map(i=> i.product._id === productId ? { ...i, qty } : i))
    return { ok: true }
  }
  async function applyCoupon(code){
    try{
      const res = await axios.post('/api/public/coupons/validate', { code });
      if(res.data && res.data.valid){
        setCoupon(res.data.coupon);
        return { ok: true, coupon: res.data.coupon };
      }
      setCoupon(null);
      return { ok: false, message: res.data.message || 'Invalid coupon' };
    } catch(err){
      setCoupon(null);
      return { ok: false, message: err.response?.data?.message || 'Invalid coupon' };
    }
  }

  function clear(){ setItems([]); setCoupon(null) }

  const totalProducts = items.reduce((acc, item) => acc + item.qty, 0);
  const totalCategories = new Set(items.map(item => item.product.category)).size;
  const totalCoupons = coupon ? 1 : 0; 

  return (
    <CartContext.Provider value={{ 
      items, 
      add, 
      remove, 
      updateQty, 
      applyCoupon, 
      coupon, 
      clear,
      totalProducts,
      totalCategories,
      totalCoupons,
      lowStockProducts,
      setLowStockProducts
    }}>
      {children}
    </CartContext.Provider>
  )
}

export default CartContext;
