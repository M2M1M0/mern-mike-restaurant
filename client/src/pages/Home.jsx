import Featured from "../UI/Featured"
import Main from "../UI/Main"
import Meal from "../UI/Meal"
import Drinks from "../UI/Drinks"
import Header from "../components/Header"
import Footer from "../components/Footer"
import FastFood from "../UI/FastFood"
import { useEffect, useState } from "react"
import axios from "axios"
import LoadingSpinner from "../components/LoadingSpinner"

import { BASE_URL } from "../baseurl"
import Contact from "./Contact"
import About from "./About"

function Home() {
    const [fastFood, setFastFood] = useState([])
    const [meals, setMeals] = useState([])
    const [drinks, setDrinks] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        setLoading(true)
        const fetchFastFood = async () => {
            const result = await axios.get(`${BASE_URL}/products?categories=fast-food`)
            setFastFood(result.data)
            setLoading(false)
            fetchDrinks()
        }
        fetchFastFood()
        const fetchDrinks = async () => {
            const result = await axios.get(`${BASE_URL}/products?categories=drinks`)
            setDrinks(result.data)
            setLoading(false)
            fetchMeals()
        }

        const fetchMeals = async () => {
            const result = await axios.get(`${BASE_URL}/products?categories=meals`)
            setMeals(result.data)
            setLoading(false)
        }
    }, [])

    return (
        <div className="">
            <Header />
            <div id="home">
                <Main />
            </div>
            <div className="flex flex-col gap-1 lg:mt-5">
                <div className="flex flex-col flex-1">
                    {loading
                        ? <LoadingSpinner size={70} color={"#EF436F"} />
                        : (
                            <>
                                <FastFood fastFood={fastFood} />
                                <Drinks drinks={drinks} />
                                <Meal meals={meals} />
                            </>
                        )}
                </div>
            </div>
            <div id="about">
                <About />
            </div>
            <Featured />
            <div id="contact">
                <Contact />
            </div>
            <Footer />
        </div>
    )
}

export default Home