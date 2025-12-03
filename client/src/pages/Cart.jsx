import React, { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function Cart(){
  const { items, updateQty, remove, applyCoupon, coupon, clear } = useCart()
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState(null)

  function subtotal(){ return items.reduce((s,i)=> s + i.product.price * i.qty, 0); }
  function discountAmount(){
    if(!coupon) return 0;
    const sub = subtotal();
    if(coupon.discountType === 'percent') return sub * (coupon.value / 100);
    return coupon.value;
  }
  async function onApply(e){ e.preventDefault(); setMsg(''); const r = await applyCoupon(code); setMsg(r.ok? 'Coupon applied': (r.message || 'Failed')); }

  return (
    <div className="container">
      <h2>Your Cart</h2>
      {items.length === 0 && <div>Cart is empty</div>}
      <ul>
        {items.map(i=>(<li key={i.product._id} className="flex gap-2 items-center">
          <img src={i.product.images[0]||'/uploads/placeholder.png'} className="w-12 h-12 object-cover"/>
          <div className="flex-1">{i.product.name}</div>
          <div>
            <input type="number" value={i.qty} min={1} onChange={(e)=>{
                const val = parseInt(e.target.value) || 1
                const res = updateQty(i.product._id, val)
                if(res && !res.ok){ setMsg(res.message) }
            }} />
          </div>
          <div>{i.product.price} x {i.qty}</div>
<button
  onClick={() => remove(i.product._id)}
  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
>
  Remove
</button>
        </li>))}
      </ul>
      <div>Subtotal: ${subtotal().toFixed(2)}</div>
      {coupon && <div>Coupon: {coupon.code} - {coupon.discountType} {coupon.value} - Discount: ${discountAmount().toFixed(2)}</div>}
      <div>Total: ${(subtotal() - discountAmount()).toFixed(2)}</div>
      <form onSubmit={onApply} className="flex gap-2">
        <input placeholder="Coupon code" value={code} onChange={e=>setCode(e.target.value)} />
<button
  type="submit"
  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
>
  Apply
</button>
      </form>
      {msg && <div>{msg}</div>}
<button
  onClick={() => clear()}
  className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
>
  Clear Cart
</button>
    </div>
  )
}
