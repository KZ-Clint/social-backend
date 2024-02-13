import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import axios from 'axios'
import baseUrl from '@/components/baseUrl/baseUrl';
import { useRouter } from 'next/router';
import Status from '@/components/Home/Status';
import Posts from '@/components/Home/Posts';
import Statusmodal from '@/components/Home/Statusmodal';
import { Context } from '@/components/Context';
import { filterSearch } from '@/components/Discover/Filtersearch';
import Rightsidebar from '@/components/Home/Rightsidebar';


export default function Home ({ token, loggeduser2, CUP, CN, CA, postss, result}) {
  const { status, setStatus, setError, setGenLoading } = useContext(Context)
  const [ page, setPage ] = useState(1)
  const [ posts, setPosts ] = useState(postss)
  const [ loggeduser, setLoggedUser ] = useState(loggeduser2)
  const [ editPost, setEditPost] = useState({})
  const [ results, setResults ] = useState(result)
  const [ loading, setLoading ] = useState(false)
  const [ users, setUsers ] = useState([])

 
  const router = useRouter()

  useEffect( () => { 
    setPosts(postss)
    setLoggedUser(loggeduser2)

  },[postss, loggeduser2] )

  const handleLoadMore = async() => {
    setPage(page + 1)
    filterSearch({router, page: page + 1 })
}
  useEffect( () => {
      const getSuggUser = async() => { 
        setLoading(true)
          try{
            const res = await axios.get( `${baseUrl}/user/suggestion`, {  headers: {
                'Authorization': `Bearer ${token} `
            }}  )   
              setUsers(res.data.users)
              setLoading(false)
          } catch (error) {
              console.log(error)
              setLoading(false)
          } } 
      getSuggUser()
  },[] )

      const getSuggUser = async() => { 
        setLoading(true)
          try{
            const res = await axios.get( `${baseUrl}/user/suggestion`, {  headers: {
                'Authorization': `Bearer ${token} `
            }}  )  
              console.log(res.data)  
              setUsers(res.data.users)
              setLoading(false)
          } catch (error) {
              console.log(error)
              setLoading(false)
          } } 

  return (
    <>
      <Head>
        <title> Home </title>  
      </Head>
     { status && <Statusmodal CUP={CUP} CN={CN} CA={CA} token={token} loggeduser={loggeduser} editPost={editPost} setPosts={setPosts} posts={posts} /> }
       
       <div className="home row mx-0" > 
          <div className="col-md-8" >
            <Status loggeduser={loggeduser} />
            { posts.length === 0 
            ? <h2 className='text-center' > No Post </h2> 
            : <Posts posts={posts} loggeduser={loggeduser} setLoggedUser={setLoggedUser} setPosts={setPosts} setEditPost={setEditPost} token={token} handleLoadMore={handleLoadMore} page={page} result={result} /> }
          </div>
          <div className='col-md-4' >
             <Rightsidebar loggeduser={loggeduser} loading={loading} users={users} getSuggUser={getSuggUser} token={token} setLoggedUser={setLoggedUser} />
          </div>
        </div> 
    </>
  )
}


export async function getServerSideProps ({req,res,query}) {
  let tokenReq= {}
  let userData ={}
  let CLOUD_UPDATE_PRESET = process.env.CLOUD_UPDATE_PRESET
  let CLOUD_NAME  = process.env.CLOUD_NAME
  let CLOUD_API = process.env.CLOUD_API
  let resp=[]
  const page = query.page || 1

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
  resp =  await axios.get( `${baseUrl}/api/post?limit=${page * 3}`, {  headers: {
    'Authorization': `Bearer ${tokenReq} `
  }}  )}  
  return {
      props: {
        token: tokenReq, 
        loggeduser2: userData,
        CUP : CLOUD_UPDATE_PRESET,
        CN :  CLOUD_NAME,
        CA : CLOUD_API,
        postss:resp.data.posts, 
        result:resp.data.result
      }
  }
}
