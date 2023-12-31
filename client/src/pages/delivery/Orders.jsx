import React, { useEffect, useState } from 'react'
import SideBar from './component/SideBar'

import fetchAPI from '../../utils/fetchData/fetchAPI'
import { useNavigate } from 'react-router-dom'
import NavBar from './component/NavBar'
import LoadingSpinner from '../../components/LoadingSpinner'
import { BASE_URL } from "../../baseurl"
import { useSelector } from 'react-redux'

const Orders = () => {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const { currentUser } = useSelector((state) => state.auth)

  const navigate = useNavigate()

  const handleNavigate = (id) => {
    navigate(`/delivery/order/${id}`)
  }

  useEffect(() => {
    setLoading(true)
    const orders = async () => {
      const result = await fetchAPI(`${BASE_URL}/orders?assignedDelivery=${currentUser.username}`)
      setOrders(result)
      console.log(result)
      setLoading(false)
    }
    orders()
  }, [])

  return (
    <div id="dashboard" className='flex w-full h-full '>
      <div id="sidebar">
        <SideBar />
      </div>
      <div id="order" className='flex flex-col p-5 w-full gap-4 bg-blue-gray-50'>
        <NavBar />

        <div className='flex flex-col w-full bg-white p-5'>
          <h2 className='text-md text-gray-700'>Orders</h2>
        </div>
        <div className='flex flex-col gap-5 felx-1 w-full h-full bg-white p-5'>
          <div className='flex flex-col gap-3'>
            <ul className='grid grid-cols-7 w-full'>
              <li className='text-sm text-gray-900 font-semibold'>Order ID</li>
              <li className='text-sm text-gray-900 font-semibold'>Customer ID</li>
              <li className='text-sm text-gray-900 font-semibold'>Total Amount</li>
              <li className='text-sm text-gray-900 font-semibold'>Order Date</li>
              <li className='text-sm text-gray-900 font-semibold'>Status</li>
              <li></li>
            </ul>
            <div className='border-b-2 w-full border-black' />
            {loading
              ? <LoadingSpinner size={100} color={'#4299e1'} />
              : orders.length > 0 ? (orders.map((orders) => (
                <ul
                  key={orders._id}
                  className='grid grid-cols-7 w-full mt-3 '>
                  <div className='flex gap-3 items-start'>
                    <li className='truncate text-xs'>{(orders._id).slice(0, 8)}</li>
                    <img className='w-[4rem]'
                      src={orders.items.productImage} alt={""} />
                  </div>
                  <li className='truncate text-xs'>{(orders.customer).slice(0, 8)}</li>
                  <li className='text-xs whitespace-nowrap'>{orders.totalAmount}</li>
                  <li className='text-xs whitespace-nowrap truncate '>{new Date(orders.orderDate).toLocaleDateString()}</li>
                  <li className={`whitespace-nowrap text-xs
                                    ${orders.status == "placed"
                      ? "text-orange-500"
                      : orders.status === "ready for pickup"
                        ? "text-purple-500"
                        : orders.status === "out of delivery"
                          ? "text-blue-500"
                          : orders.status === "delivered"
                            ? "text-teal-500"
                            : orders.status === "rejected"
                              ? "text-red-500"
                              : "text-black"
                    }`}
                  >{orders.status}</li>
                  <div className='flex items-center'>
                    <button
                      onClick={() => handleNavigate(orders._id)}
                      disabled={orders.status === "delivered"}
                      className={ `${orders.status === "delivered" ? "" : "hover:text-white hover:bg-teal-400"} flex justify-center items-center w-[60%] whitespace-nowrap rounded-md cursor-pointer text-xs p-[.1rem] px-2 text-green-500   border-green-500 border-[.1rem] `}>
                      {orders.status === "delivered" ? "Done" : "update status"}
                    </button>
                  </div>
                </ul>
              ))) : ""}

          </div>
        </div>
      </div>
    </div>
  )
}

export default Orders
