import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import axios from 'axios'
import baseUrl from '@/components/baseUrl/baseUrl';
import { useRouter } from 'next/router';
import Likebutton from './Likebutton';
import Sharemodal from './Sharemodal';
import { BASE_URL } from '../config';
import { Context } from '../Context';


export default function Cardfooter ({post, token, posts, setPosts, loggeduser, setLoggedUser}) {
   
   const { sockett } = useContext(Context)
   const [ isLike, setIsLike ] = useState(false)
   const [ loadLike, setLoadLike ] = useState(false)
   const [ loadSave, setLoadSave ] = useState(false)
   const [isShare, setIsShare] = useState(false)
   const [ saved, setSaved ] = useState(false)
   const router = useRouter()

   useEffect( () => {
     if(post.likes.some( (l) =>  l._id === loggeduser.user._id )){
      console.log("hereee")
        setIsLike(true)
     } else {
      console.log("nothereee")
      setIsLike(false)
     } 
   },[])

   useEffect( () => {
      if(loggeduser.user.saved.some( (id) =>  id === post._id )){
         setSaved(true)
      } else {
         setSaved(false)
      } 
    },[loggeduser.user.saved, post._id ])

   const handleLike = async() => {
      if(loadLike) return;
      setIsLike(true)
      setLoadLike(true)
      sockett.emit( "likePost", { ...post, likes:[...post.likes, loggeduser.user] }  )
      
      try{
         const res = await axios.put( `${baseUrl}/api/post/like/${post._id}`, null, {  headers: {
            'Authorization': `Bearer ${token} `
          }} )
         console.log(res.data)
         // setPosts(posts.filter( (p) => {
         //    if(p._id === post._id) {
         //       p.likes = [...p.likes, { _id:loggeduser.user._id, avatar:loggeduser.user.avatar, username:loggeduser.user.username, fullname:loggeduser.user.fullname} ]
         //    }
         //    return p
         // } ) ) 
         setLoadLike(false)
       } catch (err) {
          console.log(err)
          setLoadLike(false)
       }
   }


      const handleUnLike = async() => {
      if(loadLike) return;
      setIsLike(false)
      setLoadLike(true)
      sockett.emit( "unLikePost", { ...post, likes:post.likes.filter( (l) => l._id !== loggeduser.user._id ) }  )
      try{
         const res = await axios.put( `${baseUrl}/api/post/unlike/${post._id}`, null, {  headers: {
            'Authorization': `Bearer ${token} `
          }} )
         console.log(res.data)
         // setPosts(posts.filter( (p) => {
         //    if(p._id === post._id) {
         //       p.likes = p.likes.filter( (l) => l._id !== loggeduser.user._id )
         //    }
         //    return p
         // } ) )
         setLoadLike(false)
       } catch (err) {
          console.log(err)
          setLoadLike(false)
       }
   }

   const handleSave = async() => {
      if(loadSave) return;
      setSaved(true)
      setLoadSave(true)
      try{
         const res = await axios.put( `${baseUrl}/api/post/save_post/${post._id}`, null, {  headers: {
            'Authorization': `Bearer ${token} `
          }} )
        const newUser = { ...loggeduser.user, saved:[...loggeduser.user.saved, post._id] }
        setLoggedUser({user:newUser})
        setLoadSave(false)
       } catch (err) {
          console.log(err)
          setLoadSave(false)
       }
   }

   const handleUnSave = async() => {
      if(loadSave) return;
      setSaved(false)
      setLoadSave(true)
      try{
         const res = await axios.put( `${baseUrl}/api/post/unsave_post/${post._id}`, null, {  headers: {
            'Authorization': `Bearer ${token} `
          }} )
        const newUser = { ...loggeduser.user, saved: loggeduser.user.saved.filter( (id) => id !== post._id ) }
        setLoggedUser({user:newUser})
        setLoadSave(false)
       } catch (err) {
          console.log(err)
          setLoadSave(false)
       }
   }

   useEffect( () => {
      sockett.on( "likeToClient", (newPost) => {
         console.log("like", newPost)
         if(newPost) {
            setPosts(posts.filter( (p) => {
               if(p._id === newPost._id) {
                  p.likes = newPost.likes
                  console.log("p is here",p)
               }
               return p
            } ) ) 
         } } )
   },[sockett, posts] )

   useEffect( () => {
      sockett.on( "unLikeToClient", (newPost) => {
         console.log("unlike", newPost)
         if(newPost) {
            setPosts(posts.filter( (p) => {
               if(p._id === newPost._id) {
                  p.likes = newPost.likes
                  console.log("p is here",p)
                  // p.likes = p.likes.filter( (l) => l._id !== loggeduser.user._id )
               }
               return p
            } ) ) 
         } } )
   },[sockett, posts] )


  return (
    <>    
       <div className="card_footer" > 
          <div className='card_icon_menu' >
               <div>
                  <Likebutton 
                  isLike={isLike} 
                  handleLike={handleLike}
                  handleUnLike={handleUnLike} />
                  <Link href={`/post/${post._id}`} >
                     <i aria-hidden className='far fa-comment' />
                  </Link>
                  <img src="/assets/send.svg" alt="send" onClick={ () => { setIsShare(!isShare) } } />
               </div> 
               {
                  saved ? <i aria-hidden className='fas fa-bookmark text-info' onClick={handleUnSave} /> : <i aria-hidden className='far fa-bookmark' onClick={handleSave} />
               }
          </div>
          <div className="d-flex justify-content-between" >
              <h6 style={{padding: "0 25px", cursor: "pointer"}} > {post.likes.length} likes </h6> 
              <h6 style={{padding: "0 25px", cursor: "pointer"}}> {post.comments.length} comments </h6> 
          </div>
          {
             isShare && <Sharemodal url={`${BASE_URL}/post/${post._id}`} />
          }
       </div> 
    </>
  )
}
