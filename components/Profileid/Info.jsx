import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { Context } from '@/components/Context'
import {useRouter} from 'next/router'
import axios from 'axios'
import baseUrl from '@/components/baseUrl/baseUrl'
import Avatar from '@/components/Header/Avatar'
import Editprofile from './Editprofile'
import Followbtn from './Followbtn'
import Followers from './Followers'
import Following from './Following'

export default function Info ({userData, onEdit, setOnEdit, loggeduser, setUserData, CUP,CN,CA, token , showFollowers,setLoggedUser, setShowFollowers, showFollowing, setShowFollowing }) {
  const { modal, setModal } = useContext(Context)

  return (
    <>
     { Object.keys(userData).length > 0 && 
        <div className='info' >         
                <div className='info_container' key={userData._id} >
                   <Avatar user={userData} size={"super-avatar"} />
                   <div className='info_content' >
                       <div className='info_content_title' >
                           <h2> {userData.username} </h2>
                         { loggeduser.user._id === userData._id ? <button className='btn btn-outline-info' onClick={ () => { setOnEdit(true) } } > Edit Profile </button>
                         :  <Followbtn user={userData} loggeduser={loggeduser} token={token} setUserData={setUserData} setLoggedUser={setLoggedUser}  /> }
                       </div>
                       <div className='follow_btn' >
                           <span className='mr-4' onClick={ () => {  setShowFollowers(true) }} >
                               {userData.followers.length} Followers
                           </span>
                           <span className='mr-4' onClick={ () => {  setShowFollowing(true) }} >
                               {userData.following.length} Following
                           </span>
                       </div>
                       <h6> {userData.fullname} <span className="text-danger" > {userData.mobile} </span> </h6>
                       <p className='m-0' > {userData.address} </p>
                       <h6 className='m-0' > {userData.email} </h6>
                       <Link href={userData.website} target="_blank" style={{color:"blue"}} >
                           {userData.website} 
                       </Link>
                       <p> {userData.story} </p>
                   </div>
                   { onEdit && <Editprofile user={userData} setOnEdit={setOnEdit} setUserData={setUserData} CUP={CUP} CN={CN} CA={CA} token={token} />  }
                   { showFollowers && <Followers users={userData.followers} setShowFollowers={setShowFollowers} loggeduser={loggeduser} token={token} setUserData={setUserData} /> }
                   { showFollowing && <Following users={userData.following} setShowFollowing={setShowFollowing} loggeduser={loggeduser} token={token} setUserData={setUserData} /> }
                </div>  
        </div> }
    </>
  )
}