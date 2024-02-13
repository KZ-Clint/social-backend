import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Context } from '@/components/Context'
import baseUrl from '@/components/baseUrl/baseUrl'
import {useRouter} from 'next/router'


export default function Socketclient () {

    const {  isloggedin, sockett } = useContext(Context)

    useEffect( () => {
      const getUser = async() => {
        const toke =  await axios.get("/api/getuser") 
        if ( Object.keys(toke.data).length > 0 ) {
            try{ 
            const res = await axios.get( `${baseUrl}/user/loggeduser`, {  headers: {
              'Authorization': `Bearer ${toke.data} `
            }})
             sockett.emit('joinUser', res.data.user._id)
            }catch (err) {
              console.log(err)
            }
        }
      }   
      getUser()
    }, [sockett] )
  
  return (
    <>
       { isloggedin && <div></div> }
    </>
  )
}
