import { BsFillCartCheckFill } from "react-icons/bs"
import { useDispatch, useSelector } from "react-redux"
import { addToCart } from "../redux/cartSlice"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"


function Meal({ meals }) {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { currentUser } = useSelector((state) => state.auth)

    const addCart = (product) => {
        if (currentUser) {
            dispatch(addToCart(product))
            toast("Added to your cart")
        } else {
            toast.error("Please login first!")
        }
    }

    const handleOrder = (id) => {
        if (currentUser) {
            navigate(`/order/${id}`)
        } else {
            toast.error("Please Login First!")
        }
    }

    return (
        <section className='mt-8 p-3'>
            <div className='flex justify-start py-2'>
                <h1 className='font-semibold text-xl text-red-400 px-3 sm:pl-8'>Meals</h1>
            </div>
            <div className='flex flex-wrap gap-2 max-w-full mx-auto'>
                {meals.map((meal) => (
                    <div
                        key={meal._id}
                        className='flex flex-col gap-2 max-w-[48%] sm:max-w-[32%] md:max-w-[24%] lg:max-w-[19%] p-1 h-60 border-[1px] rounded-t-2xl shadow-lg bg-white'>
                        <div className='overflow-hidden flex flex-1 rounded-2xl'>
                            <img
                                src={meal.productImage}
                                alt=""
                                className='hover:scale-110  w-full h-full object-cover' />
                        </div>
                        <div className='flex flex-col p-1'>
                            <p className='text-md font-semibold text-gray-900 capitalize truncate'>{meal.productName}</p>
                            <span className='text-xs text-gray-500'>{meal.star}******</span>
                            <div className='flex justify-between items-center'>
                                <span className='text-md text-green-600'>${meal.price}</span>
                                <div className='flex gap-2 justify-center items-center'>
                                    <div onClick={() => addCart(meal)}>
                                        <BsFillCartCheckFill />
                                    </div>
                                    <button
                                        onClick={() => handleOrder(meal._id)}
                                        className='p-1 px-3 bg-teal-500 rounded-md text-xs text-white hover:opacity-90'>
                                        order
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Meal