import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import axios from 'axios'
import baseUrl from '@/components/baseUrl/baseUrl';
import { useRouter } from 'next/router';
import Avatar from '../Header/Avatar';
import moment from 'moment/moment';
import { Context } from '../Context';
import { BASE_URL } from '../config';

export default function Cardheader ({post, loggeduser, setEditPost, setPosts, token, posts}) {

   const { setOnEdit, setStatus } = useContext(Context)
   const router = useRouter()
   const handleEditPost = () => {
      setEditPost(post)
      setStatus(true)
      setOnEdit(true)
   }

   const handleDeletePost = async() => {
      try{
         if(window.confirm("Are you sure you want to delete this post?")){
            const res = await axios.delete( `${baseUrl}/api/post/delete_post/${post._id}`, {  headers: {
               'Authorization': `Bearer ${token} `
             }}  )
             setPosts(posts.filter( (p) => {
               return p._id !== post._id
           } ) )
           return router.push("/home")
         }      
       } catch (error) {
           console.log(error)
           
       } 
   }

   const handleCopyLink = () => {
       navigator.clipboard.writeText(`${BASE_URL}/post/${post._id}`)
   }
   
  return (
    <>    
       <div className="card_header" > 
          <div className='d-flex' >
            <Avatar user={post.user} size={"big-avatar"} />
            <div className='card_name' >
                <h6 className='m-0' >
                   <Link href={`/profile/${post.user._id}`} className="text-dark" >
                      {post.user.username}
                   </Link>
                </h6>
                <small className='text-muted' >
                    {moment(post.createdAt).fromNow()}
                </small>
            </div>
          </div>
          <div className='nav-item dropdown' >
              <span className="material-icons" id="moreLink" data-toggle="dropdown" >
                  more_horiz
              </span>
              <div className='dropdown-menu' >
                  { loggeduser.user._id === post.user._id &&
                  <>
                    <div className='dropdown-item' onClick={handleEditPost} >
                       <span className='material-icons' > create </span> Edit Post
                    </div>
                    <div className='dropdown-item' onClick={handleDeletePost} >
                       <span className='material-icons' > delete_outline </span> Remove Post
                    </div>
                  </> }
                  <div className='dropdown-item' onClick={handleCopyLink} >
                     <span className='material-icons' > content_copy </span> Copy link
                  </div>
              </div>
          </div>
       </div> 
    </>
  )
}
