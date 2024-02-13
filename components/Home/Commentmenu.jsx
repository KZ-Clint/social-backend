import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import axios from 'axios'
import baseUrl from '../baseUrl/baseUrl';
import { Context } from '../Context';
import { deleteNotify } from '../Actions';

export default function Commentmenu ({comment, post, loggeduser, setOnEdit2, setPosts, posts, token}) {

  const { sockett } = useContext(Context)
 
   const handleRemove = async() => {
    if( post.user._id === loggeduser.user._id || comment.user._id === loggeduser.user._id ) { 
    try{

      const deleteArr = [comment, ...post.comments.filter( (cm) => cm.reply === comment._id )]
      const newPost = { ...post, comments: post.comments.filter( (cm) => !deleteArr.find( (da) => cm._id === da._id ) ) }
      sockett.emit( "deleteComment", newPost )

        const makeReq = async(cm) => {
          const res = await axios.delete( `${baseUrl}/api/comment/delete/${cm._id}`, {  headers: {
          'Authorization': `Bearer ${token} `
         }}  ) 

         const msg = { id:res.data.post._id, text: "added a new post", recipients:res.data.post.user.followers, url:`/post/${res.data.post._id}` }
         await deleteNotify(msg,baseUrl,token,sockett)

         }
        deleteArr.forEach( (cm) => {
             makeReq(cm)   
        } )  
        
    //    setPosts(posts.filter( (p) => {
    //     if(p._id === post._id) {
    //     p.comments = p.comments.filter( (c) => {
    //           return !deleteArr.find( (da) => c._id === da._id )
    //      } ) }
    //     return p
    //  } ) )

    } catch(error){
      console.log(error)
    } }
   }

   useEffect( () => {
    sockett.on( "deleteCommentToClient", (newPost) => {
       console.log("delete", newPost)
       if(newPost) {
          setPosts(posts.filter( (p) => {
             if(p._id === post._id) {
                p.comments = newPost.comments
             }
             return p
          } ) ) 
       } } )
 },[sockett, posts] )

    const menuItem = () => {
        return(
            <>
              <div className='dropdown-item' onClick={ () => { setOnEdit2(true)} } >
                  <span className='material-icons' >create</span> Edit
              </div>
              <div className='dropdown-item' onClick={handleRemove} >
                  <span className='material-icons' >delete_outline</span> Remove
              </div>
            </>
        )
    }

  return (
    <>  
      <div className='menu' >
         {
            (post.user._id === loggeduser.user._id || comment.user._id === loggeduser.user._id) && 
            <div className='nav-item dropdown' >
                <span className='material-icons' id="moreLink" data-toggle="dropdown" style={{cursor: "pointer"}} >
                   more_vert
                </span>
                <div className='dropdown-menu' aria-labelledby='moreLink' >
                    {
                       post.user._id === loggeduser.user._id ? comment.user._id === loggeduser.user._id ? menuItem() 
                       : <div className='dropdown-item'  onClick={handleRemove} >
                             <span className='material-icons' >delete_outline</span> Remove
                         </div> : comment.user._id === loggeduser.user._id && menuItem()
                    }
                </div>    
            </div>    
         }
      </div>
    </>
  )
}
