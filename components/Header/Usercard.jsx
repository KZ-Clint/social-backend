import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { Context } from '@/components/Context'
import {useRouter} from 'next/router'
import Avatar from './Avatar'

export default function Usercard ({ children, user, border, handleClose, setShowFollowers, setShowFollowing}) {

    const handleCloseAll = () => {
        if(handleClose) handleClose()
        if(setShowFollowers) setShowFollowers(false)
        if(setShowFollowing) setShowFollowing(false)
    }
   
  return (
    <>
        <div className={`d-flex p-2 align-item-center justify-content-between ${border}`} key={user._id} > 
            <div>
                <Link href={`/profile/${user._id}`} onClick={ handleCloseAll} className="d-flex align-item-center" >
                    <Avatar user={user} size={"big-avatar"} />
                    <div className="ml-1" style={{transform: 'translateY(-2px)'}} >
                        <span className='d-block'> {user.username} </span>
                        <small style={{opacity:0.7}} > {user.fullname} </small>
                    </div>
                </Link>
            </div>
            { children }
        </div>
    </>
  )
}
