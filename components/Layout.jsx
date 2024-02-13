import { useState, useEffect, useContext } from 'react'
import { Context } from '@/components/Context'
import {useRouter} from 'next/router'
import io from 'socket.io-client'
import baseUrl from './baseUrl/baseUrl'

const socket = io.connect(baseUrl)
 
export default function Layout ({children}) {

    const { modal, status, sockett, setSockett } = useContext(Context)

    // useEffect( () => { 
    //    setSockett(socket)
    // },[socket] )
   
  return (
    <>
        <input type="checkbox" style={{display:"none"}} id="theme" />
        <div className={`app ${(status || modal) && 'mode' }`} >
          <div className="main">
            <div className='wrap-page' > 
              {children}
            </div>
          </div>
        </div>
    </>
  )
}

