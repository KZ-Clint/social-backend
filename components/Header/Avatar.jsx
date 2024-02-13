import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { Context } from '@/components/Context'
import {useRouter} from 'next/router'

export default function Avatar ({user, size}) {

    const { theme, setTheme } = useContext(Context)
   
  return (
    <>
        <img src={user.avatar} alt="avatar" className={size} style={{ filter: `${ theme ? 'invert(1)' : 'invert(0)' }` }} />
    </>
  )
}

