import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import axios from 'axios'
import baseUrl from '@/components/baseUrl/baseUrl';
import { useRouter } from 'next/router';
import { Context } from '../Context';

export default function Likebutton ({isLike, handleLike, handleUnLike}) {
    const { theme } = useContext(Context)

  return (
    <>    
       {
          isLike 
          ?  <i aria-hidden className='fas fa-heart text-danger' style={{ filter: `${ theme ? 'invert(1)' : 'invert(0)' }` }} onClick={handleUnLike} />
          :  <i aria-hidden className='far fa-heart' onClick={handleLike} />
       }
    </>
  )
}
