
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import fetchAPI from '../utils/fetchData/fetchAPI';

import { deleteAllCart, decreaseCart, increaseCart, cartTotal } from '../redux/cartSlice';
// addToCart, 
import { BASE_URL } from "../baseurl"


const Cart = () => {

    const id = useParams()
    const [loading, setLoading] = useState(false);
    const [processing, setrPocessing] = useState(false);

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { cartItems, cartTotalAmount } = useSelector(state => state.cart);

    const [product, setProduct] = useState({})

    const { currentUser } = useSelector((state) => state.auth)

    const handleDecrease = (item) => {
        dispatch(decreaseCart(item))
    }
    const handleIncrease = (item) => {
        dispatch(increaseCart(item))
    }
    // let total = dispatch(cartTotal())
    // console.log(total)

    const deleteCart = () => {
        dispatch(deleteAllCart())
    }

    // const subtotal = carCtItems.reduce((total, item) => total + item?.price * item?.quantity, 0)

    const [location, setLocation] = useState("")


    const handleSubmit = async () => {
        const productId = []
        if (Object.keys(id).length !== 0) {
            const _id = (id.id).toString()
            productId.push(_id)
        } else {
            cartItems.forEach(element => {
                productId.push(element._id)
            })
        }
        // console.log(productId, "id")
        const order = {
            customer: currentUser?._id,
            location,
            items: productId,
            totalAmount: product?.price + 15 || cartTotalAmount + 15
        }

        if (cartItems.length < 1 && Object.keys(id).length === 0) {
            toast.error("Invalid Request!")
        } else if (location === "") {
            toast("Please provide delivery location!")
        } else {
            try {
                setrPocessing(true)
                const res = await axios.post(`${BASE_URL}/orders/create-order`, order)
                if (typeof id !== 'object' || Object.keys(id).length === 0) {
                    dispatch(deleteAllCart())
                }
                toast.success("Order has been added! thank you for choosing us.")
                navigate("/")
                setrPocessing(false)
                console.log(res)
            } catch (error) {
                toast.error(error)
            } finally {
                setrPocessing(false)
            }

        }
    }

    useEffect(() => {
        const fetchSingleProduct = async () => {
            const stringID = JSON.stringify(id)
            try {
                setLoading(true)
                if (typeof id === 'object' && Object.keys(id).length !== 0) {
                    const result = await fetchAPI(`${BASE_URL}/products/${stringID}`)
                    setProduct(result)
                    setLoading(false)
                } else {
                    setProduct(null)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        fetchSingleProduct()

    }, [])


    dispatch(cartTotal())


    return (
        <section id="cart" className="flex flex-col p-2 ">
            <div className='flex flex-col mt-4 mx-5  max-h-[75vh] overflow-y-scroll'>
                <h1 className='text-red-400 font-bold text-2xl whitespace-nowrap'>
                    Your Cart is Here
                </h1>
                <div className="w-full border-b-2 border-gray-500 my-3" />
                {cartItems && <h2
                    className="w-full p-2 uppercase text-xs hover:cursor-pointer my-2 text-red-400 rounded-md whitespace-nowrap px-2 hover:opacity-90"
                    onClick={() => deleteCart()}>
                    Clear cart
                </h2>}
                <div className='flex flex-col md:flex-row gap-8'>
                    <div className='flex flex-1'>
                        {
                            loading
                                ? <LoadingSpinner size={50} />
                                : Object.keys(id).length === 0 ? (
                                    cartItems && (
                                        <div className='flex flex-wrap gap-4'>
                                            {cartItems.filter(item => item).map((item, index) => (
                                                item && <div key={index}>
                                                    <div
                                                        className='flex flex-col gap-2 min-w-[260px] h-24 p-2 border-[1px] bg-gray-50 rounded-r-lg'>
                                                        <div className='flex flex-wrap'>
                                                            <div>
                                                                <img src={item.productImage} alt={item.productName} className='w-24 h-20 rounded-md' />
                                                            </div>
                                                            <div className='flex flex-col justify-between px-2 p-1 flex-1'>
                                                                <div className='flex justify-between min-w-full'>
                                                                    <div className='flex flex-col gap-2'>
                                                                        <h5 className='text-md truncate font-bold  capitalize'>{item.productName}</h5>
                                                                        <div className='flex items-center justify-between px-1'>
                                                                            <span className='text-xs '>${item.price}</span>
                                                                        </div>

                                                                        <div className='flex gap-2 items-center'>
                                                                            <span onClick={() => handleDecrease(item)}
                                                                                className='cursor-default text-red-600 text-2xl font-extrabold'>-</span>
                                                                            <span className=''>{item.cartQuantity}</span>
                                                                            <span onClick={() => handleIncrease(item)}
                                                                                className=' cursor-default text-teal-600 text-2xl font-extrabold'>+</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                            }

                                        </div>
                                    )
                                ) : (
                                    <div>
                                        {product && (
                                            <div className="flex gap-2 max-w-[300px] h-24 p-2 border-[1px] bg-blue-50 rounded-r-lg">
                                                <div>
                                                    <img src={product.productImage} alt={product.productName} className='w-24 h-20 rounded-md' />
                                                </div>
                                                <div className='flex flex-col justify-between px-2 p-1 flex-1'>
                                                    <div className='flex flex-col justify-around min-w-full'>
                                                        <h5 className='text-md truncate font-bold  capitalize'>{product.productName}</h5>
                                                        <div className='flex items-center justify-between px-1'>
                                                            <span className='text-xs '>${product?.price}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>)}
                                    </div>
                                )
                        }
                    </div>

                    <div className='flex justify-start flex-col flex-1 gap-4'>
                        <div className='flex flex-col gap-2  max-w-[350px]'>
                            <h2 className='text-md font-light'>Your specific Location</h2>
                            <input type="text" name='location' onChange={(e) => setLocation(e.target.value)} className='bg-gray-200 p-2 border-[1px]  border-red-100' />
                        </div>
                        {/* Order summary */}
                        <div className="flex flex-col justify-end max-w-[350px] md:w-full h-fit p-3 mt-3 bg-white shadow-2xl rounded-xl">
                            <div className="flex flex-col gap-3">
                                <h2 className="flex justify-center text-red-400 text-xl">Order Summary</h2>
                                <div className="flex flex-col p-3">
                                    <div className="flex justify-between">
                                        <h2 className="text-sm">Subtotal</h2>
                                        <span>${Object.keys(id).length === 0 ? cartTotalAmount : product?.price} </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <h2 className="text-sm">Shipping cost</h2>
                                        <span>$15</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <h2 className="text-sm">Total </h2>
                                        <span> ${Object.keys(id).length === 0 ? cartTotalAmount + 15 : product?.price + 15}  </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-3 p-3 w-[100%]">
                                <button
                                    onClick={() => handleSubmit()}
                                    disabled={processing}
                                    className="p-2 flex justify-center w-full rounded-md text-white text-sm bg-teal-500">
                                    {processing ? <LoadingSpinner size={20} color={"#fff"} /> : "Proceed to checkout"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )

}

export default Cart