import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { Context } from '@/components/Context'
import {useRouter} from 'next/router'
import axios from 'axios'
import baseUrl from '@/components/baseUrl/baseUrl'
import Usercard from '@/components/Header/Usercard'

export default function Search ({token}) {
  
    const { setError } = useContext(Context)
    const [ search, setSearch ] = useState("")
    const [ users, setUsers ] = useState([])
    const [ load, setLoad ] = useState(false)

       const handleSearch = async (e) => {
         e.preventDefault()
         if(!search) return;
         try{
            setLoad(true)
            const res = await axios.get( `${baseUrl}/user/search?username=${search}`, {  headers: {
               'Authorization': `Bearer ${token} `
             }}  )
             setUsers(res.data.users)   
             setLoad(false) 
         } catch(error) {
             setError(error.response.data.error)
         }
      }
       const handleClose = () => {
          setSearch('')
          setUsers([])
       }
   
  return (
    <>
       <form className="search_form" onSubmit={handleSearch} >
           <input type="text" name="search" value={search} id="search" title="Enter to search"
            onChange={ (e) => { setSearch(e.target.value.toLowerCase().replace(/ /g, '')) } } />

           <div className="search_icon" style={{opacity: search ? 0 : 0.3}} >
              <span className="material-icons" > search </span>
              <span> Enter to Search </span>
           </div> 

           <button type="submit" style={{ display: 'none' }} > Search </button>

           { load &&  <img className='loading' src="/assets/loading.gif" alt="" />  }

           <div className="close_search"style={{opacity: users.length === 0 ? 0 : 1}} onClick={handleClose} >
            &times;
           </div>
          { users.length > 0 && <div className="users" >
               {
                  users.map( (user) => (
                        <Usercard user={user} border={'border'} key={user._id} handleClose={handleClose} />  
                  ) )
               } 
           </div> }
       </form>
    </>
  )
}

