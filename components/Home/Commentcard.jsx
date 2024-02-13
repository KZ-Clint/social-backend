import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { Context } from '../Context';
import Avatar from '../Header/Avatar';
import moment from 'moment/moment';
import Likebutton from './Likebutton';
import Commentmenu from './Commentmenu';
import baseUrl from '../baseUrl/baseUrl';
import axios from 'axios'
import Inputcomment from './Inputcomment';

export default function Commentcard ({children, comment, post, loggeduser, setPosts, posts,token, commentId}) {
    const { theme } = useContext(Context)
    const [ content, setContent ] = useState('')
    const [ readMore, setReadMore ] = useState(false)
    const [ isLike, setIsLike ] = useState(false)
    const [ loadLike, setLoadLike ] = useState(false)
    const [ onEdit2, setOnEdit2 ] = useState(false)
    const [ onReply, setOnReply ] = useState(false)

    useEffect( () => {
        setContent(comment.content)
        setOnReply(false)
        if(comment.likes.some( (l) =>  l._id === loggeduser.user._id )){
           setIsLike(true)
        } else {
         console.log("jjjj")
         setIsLike(false)
        } 
    },[comment] )

    const handleUpdate = async() => {
       if(comment.content !== content ){
        try {
          const res = await axios.patch( `${baseUrl}/api/comment/${comment._id}`, { content }, {  headers: {
            'Authorization': `Bearer ${token} `
          }} )
          setPosts(posts.filter( (p) => {
            if(p._id === post._id) {
               p.comments.filter( (c) => {
                  if(c._id === comment._id) {
                     c.content = content
                  }
                  return c
               } )}
            return p 
          } ) )
          setOnEdit2(false)
        } catch (err) {
          console.log(err)
        }
       }else {
          setOnEdit2(false)
       }
    }
    const handleLike = async() => {
      if(loadLike) return;
      setIsLike(true)
      setLoadLike(true)
      try{
         const res = await axios.put( `${baseUrl}/api/comment/like/${comment._id}`, null, {  headers: {
            'Authorization': `Bearer ${token} `
          }} )
         console.log(res.data)
         setPosts(posts.filter( (p) => {
            if(p._id === post._id) {
              p.comments.filter( (c) => {
                if(c._id === comment._id) {
                   c.likes = [...c.likes, { _id:loggeduser.user._id, avatar:loggeduser.user.avatar, username:loggeduser.user.username, fullname:loggeduser.user.fullname} ]
                }
                return c
             } ) }
            return p
         } ) )
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
      try{
         const res = await axios.put( `${baseUrl}/api/comment/unlike/${comment._id}`, null, {  headers: {
            'Authorization': `Bearer ${token} `
          }} )
         console.log(res.data)
         setPosts(posts.filter( (p) => {
            if(p._id === post._id) {
              p.comments.filter( (c) => {
                if(c._id === comment._id) {
                   c.likes = c.likes.filter( (l) => l._id !== loggeduser.user._id )
                }
                return c
             } ) }
            return p
         } ) )
         setLoadLike(false)
       } catch (err) {
          console.log(err)
          setLoadLike(false)
       }
    }
    const handleReply = () => {
       if(onReply) return setOnReply(false)
       setOnReply({...comment, commentId})
    }

    const styleCard = {
        opacity: comment._id ? 1 : 0.5,
        pointerEvents: comment._id ? "inherit" : "none"
    }

  return (
    <>  
      <div className='comment_card mt-2' style={styleCard} >
        <Link href={`/profile/${comment.user._id}`} className="d-flex text-dark" >
          <Avatar user={comment.user} size={"small-avatar"} /> 
          <h6 className='mx-1' > {comment.user.username} </h6>
        </Link>
        <div className='comment_content' >
            <div className='flex-fill' >
                {
                   onEdit2 
                   ? <textarea rows="5" value={content} onChange={ (e) => {setContent(e.target.value)}} />
                :<div >
                  {
                     comment.tag && comment.tag._id !== comment.user._id &&
                     <Link href={`/profile/${comment.tag._id}`} className="mr-1" >
                       @{comment.tag.username}
                     </Link>
                  }
                    <span >
                        {
                            content.length < 100 ? content : 
                            readMore ? content + ' ' : content.slice(0, 100) + '....'
                        }
                    </span>
                        {
                            content.length > 100 &&
                            <span className='readMore' onClick={ () => { setReadMore(!readMore) } } >
                            { readMore ? 'Hide content' : 'Read more' }
                            </span>
                        }
                </div> } 
                <div style={{cursor:'pointer'}} >
                    <small className='text-muted mr-3' >
                       {moment(comment.createdAt).fromNow()}
                    </small>
                    <small className='font-weight-bold mr-3' >
                       {comment.likes.length} likes
                    </small>
                    {
                       onEdit2 
                       ? <>
                           <small className='font-weight-bold mr-3' onClick={handleUpdate} >
                             update
                           </small>
                           <small className='font-weight-bold mr-3' onClick={ (e) => { setOnEdit2(false) } } >
                             cancel
                           </small>
                       </>
                       : <small className='font-weight-bold mr-3' onClick={handleReply} >
                            {onReply ? 'cancel' : 'reply' }
                         </small>
                    }
                  
                </div>
               
            </div>
            <div className="d-flex align-items-center mx-2" >
                <Likebutton isLike={isLike} handleLike={handleLike} handleUnLike={handleUnLike} />
                <Commentmenu post={post} comment={comment} loggeduser={loggeduser} setOnEdit2={setOnEdit2} setPosts={setPosts} posts={posts} token={token} />
            </div>
        </div>
        {
          onReply &&  
          <Inputcomment post={post} onReply={onReply} setOnReply={setOnReply} loggeduser={loggeduser} token={token} setPosts={setPosts} posts={posts} >
             <Link href={`/profile/${onReply.user._id}`} >
               @{onReply.user.username}:
             </Link>
          </Inputcomment>
        }
        {children}
      </div>
    </>
  )
}
