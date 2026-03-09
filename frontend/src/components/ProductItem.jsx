import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import {Link} from 'react-router-dom'

const ProductItem = ({id,image,name,price}) => {
    
    const {currency} = useContext(ShopContext);

  return (
    <Link onClick={()=>scrollTo(0,0)} className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
      <div className='overflow-hidden h-64 w-full bg-gray-200 flex items-center justify-center'>
        <img
          className='hover:scale-110 transition ease-in-out h-full w-full object-cover'
          src={image[0]}
          alt=""
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </div>
      <p className='pt-3 pb-1 text-sm line-clamp-2'>{name}</p>
      <p className=' text-sm font-medium'>{currency}{price}</p>
    </Link>
  )
}

export default ProductItem
