import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { toast } from 'react-toastify'

export default function ProductDetail(){
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  useEffect(()=>{ fetchProduct() }, [slug])

  async function fetchProduct(){
    try{
      const res = await axios.get('/api/public/products/' + slug)
      setProduct(res.data)
    }catch(err){
      console.error('Failed to load product', err)
      setProduct(null)
      alert('Failed to load product: ' + (err.response?.data?.message || err.message))
    }
  }

  const { add } = useCart()
  if(!product) return <div>Loading...</div>
  return (
    <div className="container">
      <h2>{product.name}</h2>
      <div className="product">
        <div className="images">
          {(!product.images || !Array.isArray(product.images) || product.images.length === 0)
            ? <div>No images</div>
            : product.images.map((u,i)=>(<img key={i} src={u} alt={product.name} />))
          }
        </div>
          <div className="info">
          <p>{product.description}</p>
          <p><strong>SKU:</strong> {product.sku || '—'}</p>
          <p><strong>Category:</strong> {product.category?.name || product.category || 'Uncategorized'}</p>
          <p>Price: ${product.price}</p>
          <p>Stock: {product.inventory?.stock}</p>
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <button disabled={typeof product.inventory?.stock === 'number' && product.inventory.stock <= 0} onClick={async ()=>{
                const res = add({ product, qty: 1 })
                if(res && !res.ok){
                  toast.error(res.message || 'Unable to add to cart')
                  return
                }
                toast.success('Added to cart')
              }} style={{padding:'8px 12px', background:'#111827', color:'#fff', borderRadius:6, opacity: (typeof product.inventory?.stock === 'number' && product.inventory.stock <= 0) ? 0.5 : 1}}>Add to cart</button>
            { (typeof product.inventory?.stock === 'number' && product.inventory.stock <= 0) && (
              <div style={{padding:'4px 8px', background:'#ef4444', color:'#fff', borderRadius:6}}>Out of stock</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
