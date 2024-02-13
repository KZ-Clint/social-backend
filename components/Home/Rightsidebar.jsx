import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { Context } from '../Context';
import axios from 'axios'
import baseUrl from '../baseUrl/baseUrl';
import Usercard from '../Header/Usercard';
import Followbtn from '../Profileid/Followbtn';

export default function Rightsidebar ({ loggeduser, loading, users, getSuggUser, token, setLoggedUser }) {

    

  return (
    <>  
      <div className="mt-3" >
         <Usercard user={loggeduser.user}  />  
         <div className='d-flex justify-content-between align-items-center my-2' >
            <h5 className='text-danger' > Suggestions for you </h5>
            { !loading && <i className='fas fa-redo' style={{cursor:'pointer'}} onClick={getSuggUser} />  }
      
         </div>
         { loading ? <img className="d-block mx-auto my-4" src="/assets/loading.gif" alt="loading" />
            : <div className="suggestions" >
                  {
                     users.map( (user) => (
                        <Usercard key={user._id} user={user} >
                            <Followbtn user={user} intruder={"intruder"} token={token} setUserData={setLoggedUser} /> 
                        </Usercard>
                     ) )
                  }
              </div> 
         } 
      
      </div>
    </>
  )
}
