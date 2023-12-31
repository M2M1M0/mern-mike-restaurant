import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import fetchAPI from '../../utils/fetchData/fetchAPI'
import SideBar from './component/SideBar'
import NavBar from './component/NavBar'
import { toast } from 'react-toastify'
import axios from 'axios'
import { FaAngleDoubleRight } from 'react-icons/fa'
import LoadingSpinner from '../../components/LoadingSpinner'
import { BASE_URL } from "../../baseurl"
import { useSelector } from 'react-redux'

const OrderDetails = () => {
  const id = useParams()
  const { currentUser } = useSelector((state) => state.auth)

  const [order, setOrder] = useState([])
  const [selected, setSelected] = useState("")
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)

  const handleChange = (e) => {
    setSelected(e.target.value)
  }

  const handleStatus = async () => {
    const _id = JSON.stringify(id)
    const data = {
      assignedDelivery: currentUser.username,
      status: selected
    }
    if (selected) {
      try {
        setProcessing(true)
        await axios.put(`${BASE_URL}/orders/edit/${_id}`, data)
        toast.success("Status updated", { autoClose: 1200 })
      } catch (error) {
        toast.error(error)
      } finally {
        setProcessing(false)
      }
    } else {
      toast.error("No status selected")
    }
  }

  useEffect(() => {
    const stringID = JSON.stringify(id)
    setLoading(true)
    const handleDetails = async () => {
      const result = await fetchAPI(`${BASE_URL}/orders/${stringID}`)
      setOrder(result)
      setLoading(false)
    }
    handleDetails()
  }, [id])

  


  return (
    <div id="dashboard" className='flex w-full h-full '>
      <div id="sidebar">
        <SideBar />
      </div>
      <div id="order" className='flex flex-col p-5 w-full gap-4 bg-blue-gray-50'>
        <NavBar />

        <div className='flex flex-col w-full bg-white p-5'>
          <h2 className='text-md text-gray-700 flex items-center gap-3'>
            <Link to={"/delivery/orders"}>
              Orders
            </Link>
            <FaAngleDoubleRight/>
            <span className='text-sm text-gray-500'>
              order details
            </span>           
          </h2>

        </div>

        <div className='w-full h-full flex gap-4'>
          <div className='flex flex-col bg-white flex-1 p-2 text-gray-600'>
            <h3 className='text-xs '>Ordered lists</h3>
            <div className='flex flex-wrap gap-3 p-3'>
              {loading
              ? <LoadingSpinner size={100} color={'#4299e1'} />
              : order ? (order?.items?.map((order, index) => (
                <div className='flex gap-1 min-w-[14rem] bg-blue-gray-50 min-h-[4rem]' key={index}>
                  <div className='flex flex-col gap-1 m-2 '>
                    <img src={order.productImage} alt="" className='w-[5rem] h-[3.5rem]' />
                  </div>
                  <div className='flex flex-col justify-center'>
                    <h4 className='text-xs text-black truncate'>{order.productName}</h4>
                    <h3 className='text-xs'>{order.categories}</h3>
                    <h3 className='text-xs text-teal-600'>${order.price}</h3>
                  </div>
                </div>
              ))
              ) : ""}
            </div>
            <h1 className='text-md  flex gap-3 justify-start p-5 pb-0'>
              Total:
              <span className='text-teal-500'>
                ${order && order.totalAmount}
              </span>
            </h1>
            <h2 className='text-md p-5 '>Location: <span className='text-gray-500'>{order && order?.location || "Not available"}</span></h2>
          </div>

          {/* ----------- Assign delivery------------ */}
          <div className='flex flex-col gap-12 bg-white w-[300px] p-5'>
            <div className='flex flex-col gap-3'>
              <h2 className='text-md'>Update status</h2>
              <div className='border-b-2 border-gray-300' />
              <div className='flex flex-col gap-8'>
                <select name="delivery" onChange={handleChange} value={selected} className='hover:bg-blue-gray-50'>
                  <option value="" className='p-2 hover:bg-red-400'></option>
                  <option value="out of delivery">Out of Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="rejected">rejected</option>
                </select>
                <div className='flex justify-end'>
                  <button
                    onClick={handleStatus}
                    className='flex  items-center justify-center w-full text-xs uppercase bg-teal-500 rounded-lg p-2 px-5 text-white'>
                    {processing ? <LoadingSpinner size={20} color={"#fff"}/> : "Update status"}
                  </button>
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-3'>
              <h1 className='flex gap-3 items-center text-md'>
                Status:
                {order ? (
                  <span
                    className={`whitespace-nowrap 
                    ${order.status == "placed"
                        ? "text-orange-500"
                        : order.status === "ready for pickup"
                          ? "text-purple-500"
                          : order.status === "out of delivery"
                            ? "text-blue-500"
                            : order.status === "delivered"
                              ? "text-teal-500"
                              : order.status === "rejected"
                                ? "text-red-500"
                                : "text-black"
                      }`}
                  >
                    {order.status}
                  </span>
                ) : ""}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetails
