import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import {useRouter} from 'next/router'
import baseUrl from '../baseUrl/baseUrl'
import axios from 'axios'
import { Context } from '../Context'

export default function Followbtn ({user,loggeduser, token, setUserData, intruder, setLoggedUser }) {

  const { sockett } = useContext(Context)
  const [ followed, setFollowed ] = useState(false)
  const [ load, setLoad ] = useState(false)
  const router = useRouter()

  
  useEffect( () => {

    if (Object.keys(user).length > 0 ) {
      if( user.followers.length > 0 && user.followers[0]._id) {
        if( user.followers.some( (f) => f._id === loggeduser.user._id ) ){
          setFollowed(true)
          } 
      } 
      if( user.followers.length > 0 && !user.followers[0]._id ) {
          if(user.followers.includes(loggeduser.user._id)){
              setFollowed(true)
          }
      }
    }
 },[user] )
  
  const handleFollow = async() => {
     if(load) return;
     setLoad(true)
  
    try{
      const res = await axios.put( `${baseUrl}/user/follow/${ !intruder ? router.query.id : user._id }`, null, {  headers: {
        'Authorization': `Bearer ${token} `
      }}  )
    
      sockett.emit( "followUser", res.data.newUser )
      if(intruder) {
        setFollowed(true)
      } else {
        // user.followers.push(res.data.usermain)
        // const udata = user
        // setUserData({...user, udata})
        setFollowed(true)
      }
      setLoad(false)
    } catch(error){
      console.log(error)
      setLoad(false)
    }
  }
  const handleUnfollow = async() => {
    if(load) return;
    setLoad(true)
    // let newUser;

    //  if(intruder) {
    //     newUser = { ...user, followers:  user.followers.filter( (f) => f._id !== loggeduser.user._id ) }
    //  } else {
    //     newUser ={ ...user, followers:  user.followers.filter( (f) => f._id !== loggeduser.user._id )  }
    //  }
  
    try{
      const res = await axios.put( `${baseUrl}/user/unfollow/${ !intruder ? router.query.id : user._id}`, null, {  headers: {
        'Authorization': `Bearer ${token} `
      }}  )

      sockett.emit( "unFollowUser", res.data.newUser )
      if( intruder ) {    
        // user.followers = user.followers.filter( (f) => f !== loggeduser.user._id   )
        setFollowed(false)
      } else {
        // user.followers = user.followers.filter( (f) => f._id !== loggeduser.user._id   )
        // const udata2 = user
        // setUserData({...user, udata2})
        setFollowed(false)
    }
    setLoad(false)
    } catch(error){
      console.log(error)
      setLoad(false)
    }
  }

  useEffect( () => {
 
    sockett.on( "followUserToClient", (newUser) => {
       if(newUser) {
          setLoggedUser({user:newUser})     
       } } )
  },[sockett] )

  useEffect( () => {
    
    sockett.on( "unFollowUserToClient", (newUser) => {
      if(newUser) {
          setLoggedUser({user:newUser})
       } } )
  },[sockett] )

  return (
    <>
      { followed 
       ? <button className='btn btn-outline-danger' onClick={handleUnfollow} > UnFollow </button>
       : <button className='btn btn-outline-info' onClick={handleFollow} > Follow </button> 
      }
    </>
  )
}