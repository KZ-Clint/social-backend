import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import axios from 'axios'
import baseUrl from '@/components/baseUrl/baseUrl';
import { useRouter } from 'next/router';
import Avatar from '../Header/Avatar';
import { Context } from '../Context';


export default function Status ({loggeduser}) {
    const { setStatus } = useContext(Context)

  return (
    <>    
        <div className='status my-3 d-flex' > 
           <Avatar user={loggeduser.user} size={"big-avatar"} />
           <button className='statusBtn flex-fill' onClick={ () => { setStatus(true) } } >
              {loggeduser.user.username}, what are you thinking?
           </button>
        </div> 
    </>
  )
}
