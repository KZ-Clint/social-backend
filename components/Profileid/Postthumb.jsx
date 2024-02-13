import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { Context } from '@/components/Context'
import {useRouter} from 'next/router'
import axios from 'axios'

export default function Postthumb ( {posts, result} ) {
    const { theme } = useContext(Context)
    if(result === 0 ) return <h2 className='text-center text-danger' > No Post </h2>

  return (
    <>
        <div className='post_thumb' > 
           {
              posts.map( (post) => (
                 <Link key={post._id} href={`/post/${post._id}`} >
                    <div className='post_thumb_display' >
                       <img src={post.images[0].url} alt={post.images[0].url} style={{filter: theme? 'invert(1)' : 'invert(0)' }} />

                       <div className='post_thumb_menu' >
                          <i className='far fa-heart'> {post.likes.length} </i>
                          <i className='far fa-comment'> {post.comments.length} </i>
                       </div>
                    </div> 
                 </Link>
              ) )
           }
        </div>
    </>
  )
}