import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { Context } from '@/components/Context'
import {useRouter} from 'next/router'
import Usercard from '../Header/Usercard'
import Followbtn from './Followbtn'


export default function Following ({ users, setShowFollowing, loggeduser, token, setUserData }) {

  const router = useRouter()

  return (
    <>
      <div className='follow' >
         <div className='follow_box' >
            <h5 className='text-center' > Following </h5>
            <hr/>
            {  users.map( (user) => (
                <Usercard key={user._id} user={user} setShowFollowing={setShowFollowing}>
                   { loggeduser.user._id !== user._id && <Followbtn user={user} loggeduser={loggeduser} token={token} setUserData={setUserData} intruder={"intruder"}  /> }   
               </Usercard>
            ) )
            }
            <div className='close' onClick={ () => { setShowFollowing(false) } } > &times; </div>
         </div>
      </div>
    </>
  )
}