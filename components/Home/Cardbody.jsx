import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import axios from 'axios'
import baseUrl from '@/components/baseUrl/baseUrl';
import { useRouter } from 'next/router';
import Carousel from './Carousel';


export default function Cardbody ({post}) {

  const [ readMore, setReadMore ] = useState(false)

  return (
    <>    
       <div className="card_body" > 
          <div className="card_body-content" >
            <span>
               { post.content.length < 60 ? post.content : readMore ? post.content + " " : post.content.slice(0, 60) + "..."  } 
            </span>
            { post.content.length > 60 &&
              <span className='readMore' onClick={ () => { setReadMore(!readMore) } } >
                  { readMore ? "Hide Content" : "Read more" }
              </span>
            } 
          </div>
          {
            post.images.length > 0 && <Carousel images={post.images} id={post._id} />
          }
       </div> 
    </>
  )
}
