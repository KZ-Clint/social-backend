import { Context } from '@/components/Context'
import Head from 'next/head'
import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import baseUrl from '@/components/baseUrl/baseUrl'
import Loadmorebtn from '@/components/Loadmorebtn'
import { filterSearch } from '@/components/Discover/Filtersearch'
import { useRouter } from 'next/router'
import Postthumb from '@/components/Profileid/Postthumb'


export default function Discover ({loggeduser, postss, token, resultss}) {
  const { theme } = useContext(Context)
  const [ posts, setPosts ] = useState(postss)
  const [ result, setResult ] = useState(resultss)
  const [ page, setPage ] = useState(1)
  const [ load, setLoad ] = useState(false)
  const router = useRouter()

  useEffect( () => { 
    setPosts(postss)
 },[postss] )

 const handleLoadMore = async() => {
      setLoad(true)
      setPage(page + 1)
      filterSearch({router, page: page + 1 })
      setLoad(false)
     
 }

  return (
    <>
      <Head>
        <title> Discover </title>
      </Head>

     <div>
         <Postthumb posts={posts} result={result} />    
         { load &&  <img className="d-block mx-auto my-4" src="/assets/loading.gif" alt="loading" />  }
         <Loadmorebtn result={result} page={page} handleLoadMore={handleLoadMore} />
     </div>

    </>
  )
}

export async function getServerSideProps ({req,res, query}) {
  const page = query.page || 1
  let tokenReq= {}
  let userData ={}
  let resp =[]
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
   if (Object.keys(tokenReq).length > 0 ) {
    resp =  await axios.get( `${baseUrl}/api/post/post_discover?limit=${page * 3}`, {  headers: {
      'Authorization': `Bearer ${tokenReq} `
    }}  )}  

  return {
      props: {
        token: tokenReq,
        loggeduser: userData,
        postss: resp.data.posts,
        resultss: resp.data.result
      }
  }
}
