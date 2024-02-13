import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { Context } from '../Context';
import Commentcard from './Commentcard';

export default function Commentdisplay ({ comment, post, loggeduser, setPosts, posts, token, replyCm}) {
  const [ showRep, setShowRep ] = useState([])
  const [ next, setNext ] = useState(1)

  useEffect( () => {
    setShowRep(replyCm.slice(replyCm.length - next))
  },[replyCm, next] )

  return (
    <>  
      <div className='comment_display' >
         <Commentcard comment={comment} post={post} loggeduser={loggeduser} setPosts={setPosts} posts={posts} token={token} commentId={comment._id} >
             <div className='pl-4' >
                 {
                    showRep.map( (cm, index) => (
                       cm.reply && <Commentcard key={index} comment={cm} post={post} loggeduser={loggeduser} setPosts={setPosts} posts={posts} token={token} commentId={comment._id} />
                    ) )
                 }

                 {
                    replyCm.length - next > 0
                    ? <div style={{cursor: 'pointer', color: 'crimson'}}
                      onClick={ () => { setNext(next + 10) } } >
                        See more comments...
                      </div>
                    : replyCm.length > 1 && <div  style={{cursor: 'pointer', color: 'crimson'}} 
                      onClick={ () => { setNext(1) } } >
                        Hide comments...
                      </div>  
                 }

             </div>
         </Commentcard>
      </div>
    </>
  )
}
