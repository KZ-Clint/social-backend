import { useState, useEffect, createContext } from 'react'
import axios from 'axios'
import {useRouter} from 'next/router'
import io from 'socket.io-client'
import baseUrl from './baseUrl/baseUrl'

const socket = io.connect(baseUrl)

export const Context = createContext()

export const ContextProvider = ({children}) => {

    const router = useRouter()

    const [ genloading, setGenLoading ] = useState(false)
    const [ error, setError ] = useState(null)
    const [ success, setSuccess ] = useState(null)
    const [ isloggedin, setIsLoggedIn ] = useState(false)
    const [ theme, setTheme ] = useState(false)
    const [ modal, setModal ] = useState(false)
    const [ status, setStatus ] = useState(false)
    const [ onEdit, setOnEdit ] = useState(false)
    const [ sockett, setSockett ] = useState(socket)

    useEffect(() => {
        const handleGet = async () => {
          const toke =  await axios.get("/api/getuser") 
          if ( Object.keys(toke.data).length > 0 ) {
            setIsLoggedIn(true)
          }
         } 
         handleGet()
      }, []);
  
      const removeCookie = () => {
        fetch( '/api/logout', {
            method: "post",
            headers: {
               "content-type": "application/json"
            },
            body: JSON.stringify( {} )
        } )
        router.push("/")
        setIsLoggedIn(false)
        localStorage.removeItem('firstLogin')
        router.push("/")
     }


    return (
        <Context.Provider value={ {  genloading, setGenLoading, isloggedin, setIsLoggedIn, removeCookie, setError, error, success, setSuccess, theme, setTheme, status, setStatus, onEdit, setOnEdit,
        modal,setModal, sockett, setSockett }} >
            {children}
        </Context.Provider>
 )
}