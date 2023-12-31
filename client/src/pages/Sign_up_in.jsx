import { Card } from '@material-tailwind/react'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import Oauth from '../components/Oauth'
import { useDispatch, useSelector } from 'react-redux'
import { reload, signInStart, signInSuccess, signInFailure, signUpSuccess, signUpFailure, exit } from '../redux/authSlice'
import { toast } from 'react-toastify'
import LoadingSpinner from '../components/LoadingSpinner'
import { BASE_URL } from "../baseurl"

const initialValue = {
  username: "",
  email: "",
  password: ""
}

function Sign_up_in() {
  const [login, setLogin] = useState(true)
  const [user, setUser] = useState(initialValue)

  const { error, loading } = useSelector((state) => state.auth)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = async (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const { username, email, password } = user

  const handleSubmit = async (e) => {
    e.preventDefault()
    dispatch(signInStart())
    if (login) {
      if (email === "" || password === "") {
        toast.error("Fields are required!", { autoClose: 1500 })
        dispatch(reload())
      } else {
        try {
          dispatch(signInStart())
          const result = await axios.post(`${BASE_URL}/auth/login`, user)
          if (result.status === 200) {
            toast.success("Login success", { autoClose: 1500 })
            dispatch(signInSuccess(result.data))
            setUser(() => initialValue)
            if (result.data.role === "admin") navigate("/dashboard")
            else if (result.data.role === "delivery") navigate("/delivery/dashboard")
            else if (result.data.role === "customer") navigate("/")
          } else {
            dispatch(signInFailure(result.data))
          }
        } catch (error) {
          console.log(error)
          if (error.response) {
            // Handle specific error codes
            if (error.response.status === 409) {
              dispatch(signInFailure(error.response.data))
            } else if (error.response.status === 400) {
              dispatch(signInFailure(error.response.data.errors[0].message))
            } else {
              dispatch(signInFailure(error.response.data.message))
            }
          } else {
            console.error('Network error:', error);
          }
        } 
      }
    } else {
      if (username === "" || email === "" || password === "") {
        toast.error("Fields are required!", { autoClose: 1500 })
        dispatch(reload())
      } else {
        try {
          dispatch(signInStart())
          const result = await axios.post(`${BASE_URL}/auth/register`, user)
          if (result.status === 201) {
            toast.success("Register and login success")
            dispatch(signUpSuccess(result.data))
            setUser(() => initialValue)
            if (result.data.role === "customer") return navigate("/")
          }
        } catch (error) {
          if (error.response) {
            // Handle specific error codes
            if (error.response.status === 400) {
              dispatch(signUpFailure(error.response.data.errors[0].message))
            } else {
              dispatch(signUpFailure(error.response.data))
            }
          } else {
            console.error('Network error:', error);
          }
        } finally {
        }
      }
    }
  }

  useEffect(() => {
    dispatch(reload())
    setUser(initialValue)
  }, [login])


  useEffect(() => {
    dispatch(exit())
  }, [])

  return (
    <section className='flex flex-col justify-center gap-5 max-w-[400px]'>
      <div className='flex flex-col justify-between px-2 shadow-none'>
        <div className='flex flex-col gap-3'>

          <h1 className='uppercase text-2xl text-center font-medium'>
            {login ? "Login" : "Sign up"}
          </h1>
          <h5 className='text-sm'>{login ? "Don't Have an account?" : "Have an account!"}
            <span onClick={() => setLogin(!login)} className='text-blue-500 cursor-pointer'>
              {login ? " Sign Up" : " Login"}
            </span>
          </h5>
        </div>

        <form className='flex flex-col w-full h-full gap-2 my-3' onSubmit={handleSubmit}>
          {!login && <div className='flex flex-col'>
            <label className='text-xs'>Username</label>
            <input
              type="text"
              name='username'
              value={username}
              className='hover:outline-none  focus:outline-none p-[2px] px-[6px] border-[0.7px] border-gray-400'
              onChange={handleChange} />
          </div>}


          <div className='flex flex-col'>
            <label className='text-xs'>Email</label>
            <input
              type="text"
              name='email'
              value={email}
              className='hover:outline-none  focus:outline-none p-[2px] px-[6px]  border-[0.7px] border-gray-400'
              onChange={handleChange} />
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex flex-col'>
              <label className='text-xs'>Password</label>
              <input
                type="password"
                name='password'
                value={password}
                minLength={6}
                className='hover:outline-none  focus:outline-none p-[2px] px-[6px] border-[0.7px] border-gray-400'
                onChange={handleChange} />
            </div>
            {login && <Link to={"forget"} className='text-sm text-blue-500'>Forgot password? </Link>}

          </div>
          {error
            ? <h2 className='p-3 text-xs bg-red-50 text-red-400'>{error}</h2>
            : ""}
          <div className='flex flex-col gap-3 my-4'>
            <button
              type='submit'
              className='w-full uppercase p-[5px] bg-blue-gray-400 text-white hover:opacity-90'>
              {loading
                ? (<LoadingSpinner size={25} color={"#fff"} />)
                : (login ? "Login" : "Register")}
            </button>

            {/* =========== Signup with google ================ */}
            {/* <Oauth loading={loading} /> */}
          </div>
        </form>
      </div>
    </section>
  )
}

export default Sign_up_in