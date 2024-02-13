import Head from 'next/head'
import Image from 'next/image'
import axios from 'axios'
import baseUrl from '@/components/baseUrl/baseUrl';
import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router';
import Info from '@/components/Profileid/Info';
import Posts from '@/components/Profileid/Posts';
import { Context } from '@/components/Context';
import Postcard from '@/components/Home/Postcard';
import Loading from '@/components/Loading';
import Statusmodal from '@/components/Home/Statusmodal';

export default function Postid ({loggeduser,token, CUP, CN, CA }) {
     const { modal, setModal,status } = useContext(Context)
     const [ posts, setPosts ] = useState([])
     const [ editPost, setEditPost] = useState({})

     const router = useRouter()

      useEffect( () => {
        const getPost = async() => { 
         if (router.isReady) { 
                try{
                  const res = await axios.get( `${baseUrl}/api/post/get_post/${router.query.id}`, {  headers: {
                      'Authorization': `Bearer ${token} `
                    }}  )  
                    console.log(res.data.post)  
                    if(res.data.post) { 
                    const arr = []
                    arr.push(res.data.post)
                    setPosts(arr)
                    }
                } catch (error) {
                    console.log(error)
                } } } 
        getPost()
      },[router.isReady, router.query.id] )
    

  return (
    <>
     
     <div className='posts' >  
     { status && <Statusmodal CUP={CUP} CN={CN} CA={CA} token={token} loggeduser={loggeduser} editPost={editPost} setPosts={setPosts} posts={posts} /> }

     {
       posts.length === 0 &&  <img className="d-block mx-auto my-4" src="/assets/loading.gif" alt="loading" />
     }
           {  posts.length > 0 && posts ?
              posts.map( (post) => (  
                <Postcard key={post._id} post={post} loggeduser={loggeduser} token={token} setEditPost={setEditPost} setPosts={setPosts} posts={posts} />
          )) : <p></p>
        }
    </div>

    </>
  )
}

export async function getServerSideProps ({req,res}) {
  let tokenReq= {}
  let userData = {}
  let CLOUD_UPDATE_PRESET = process.env.CLOUD_UPDATE_PRESET
  let CLOUD_NAME  = process.env.CLOUD_NAME
  let CLOUD_API = process.env.CLOUD_API

  if(req.cookies.token){
      tokenReq=JSON.parse(req.cookies.token)     
  } else {
    return {
      redirect:{
        permanent:false,
        destination:"/"
      }
    }
  }
  if (Object.keys(tokenReq).length > 0 ) {
    const response = await fetch( `${baseUrl}/user/loggeduser`, {  headers: {
      'Authorization': `Bearer ${tokenReq} `
    }})
     userData = await response.json()
   }  

  return {
      props: {
        token: tokenReq,
        loggeduser: userData,
        CUP : CLOUD_UPDATE_PRESET,
        CN :  CLOUD_NAME,
        CA : CLOUD_API 
      }
  }
}
