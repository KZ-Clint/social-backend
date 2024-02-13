import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import axios from 'axios'
import baseUrl from '@/components/baseUrl/baseUrl';
import { useRouter } from 'next/router';
import { Context } from '../Context';

export default function Inputcomment ({children, post, loggeduser, token, setPosts, posts, onReply, setOnReply}) {

    const { sockett } = useContext(Context)
    const [ content, setContent ] = useState('')
   
    const handleSubmit = async(e) => {
        e.preventDefault()
        if(!content.trim()){
           if(setOnReply) return setOnReply(false)
           return;
        } 
       const newComment = { content, likes:[], user: loggeduser.user, createdAt: new Date().toISOString(), reply: onReply && onReply.commentId, tag: onReply && onReply.user, postUserId:post.user._id }
       
       try {  
        const res = await axios.post( `${baseUrl}/api/comment`, { ...newComment, postId:post._id }, {  headers: {
            'Authorization': `Bearer ${token} `
          }} )
          sockett.emit( "createComment", { ...post, comments : [...post.comments, res.data.comment] }  )
        // setPosts(posts.filter( (p) => {
        //     if(p._id === post._id) {
        //        p.comments = [...p.comments, newComment]
        //     }
        //     return p
        // } ) )
        if(setOnReply) return setOnReply(false)
        setContent('')
      } catch (error) {
         console.log(error)
      }
    }

    useEffect( () => {
      sockett.on( "createCommentToClient", (newPost) => {
         console.log("comment created", newPost)
         if(newPost) {
            setPosts(posts.filter( (p) => {
               if(p._id === newPost._id) {
                  p.comments = newPost.comments
               }
               return p
            } ) ) 
         } } )
   },[sockett, posts] )

  
  return (
    <>  
         <form className='card-footer comment_input' onSubmit={handleSubmit} >
            {children}
            <input type="text" placeholder='Add your comments...' value={content} onChange={ (e) => { setContent(e.target.value) } } />
            <button type="submit" className='postBtn' >
                Post
            </button>
         </form>
    </>
  )
}
