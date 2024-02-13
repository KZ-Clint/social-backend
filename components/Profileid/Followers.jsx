import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { Context } from '@/components/Context'
import {useRouter} from 'next/router'
import Usercard from '../Header/Usercard'
import Followbtn from './Followbtn'

export default function Followers ({ users, setShowFollowers, loggeduser, token, setUserData}) {

  const router = useRouter()

  return (
    <>
      <div className='follow' >
         <div className='follow_box' >
            <h5 className='text-center' > Followers </h5>
            <hr/>
            {  users.map( (user) => (
                <Usercard key={user._id} user={user} setShowFollowers={setShowFollowers}>
                   { loggeduser.user._id !== user._id && <Followbtn user={user} loggeduser={loggeduser} token={token} setUserData={setUserData} intruder={"intruder"}  /> }   
               </Usercard>
            ) )
            }
            <div className='close' onClick={ () => { setShowFollowers(false) } } > &times; </div>
         </div>
      </div>
    </>
  )
}