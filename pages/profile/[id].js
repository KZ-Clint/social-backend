import Head from 'next/head'
import Image from 'next/image'
import axios from 'axios'
import baseUrl from '@/components/baseUrl/baseUrl';
import { useState, useEffect, useContext } from 'react'
import { useRouter } from 'next/router';
import Info from '@/components/Profileid/Info';
import Posts from '@/components/Profileid/Posts';
import { Context } from '@/components/Context';
import { filterSearch } from '@/components/Discover/Filtersearch';
import Saved from '@/components/Profileid/Saved';

export default function Profileid ({loggeduser2,token, CUP, CN, CA}) {
  const router = useRouter()
     const { modal, setModal } = useContext(Context)
     const [ userData, setUserData ] = useState({})
     const [ loggeduser, setLoggedUser ] = useState(loggeduser2)
     const [ onEdit, setOnEdit ] = useState(false)
     const [ load1, setLoad1 ] = useState(false)
     const [ saveTab, setSaveTab ] = useState(false)
     const [ showFollowers, setShowFollowers ] = useState(false)
     const [ showFollowing, setShowFollowing ] = useState(false)
     const [ posts, setPosts ] = useState([])
     const [ result, setResult ] = useState(9)
     const [ page, setPage ] = useState( router.query.page || 1)



     useEffect( () => {
        const getUser = async() => { 
         if (router.isReady) { 
             setLoad1(true)
                try{
                  const res = await axios.get( `${baseUrl}/user/user/${ router.query.id === loggeduser.user.username ? loggeduser.user._id : router.query.id}`, {  headers: {
                      'Authorization': `Bearer ${token} `
                    }}  )
                    document.title =  `Profile/${router.query.id}`;
                    console.log(res.data.user)
                  setUserData(res.data.user)                 
                } catch (error) {
                    console.log(error)
                    setLoad1(false)
                } } } 
        getUser()
      },[router.isReady, router.query.id] )

      useEffect( () => {
        const getPosts = async() => { 
         if (router.isReady) { 
             setLoad1(true)
                try{
                  const res = await axios.get( `${baseUrl}/api/post/user_posts/${ router.query.id === loggeduser.user.username ? loggeduser.user._id : router.query.id}?limit=${page * 3}`, {  headers: {
                      'Authorization': `Bearer ${token} `
                    }}  )
                    console.log(res.data.posts)
                    setPosts(res.data.posts) 
                    setResult(res.data.result) 
                    setLoad1(false)
                } catch (error) {
                    console.log(error)
                    setLoad1(false)
                } } } 
        getPosts()
      },[router.isReady, router.query.id] )
    
      useEffect( () => {
         if(showFollowers || showFollowing || onEdit){
            setModal(true)
         }else {
            setModal(false)
         }
      },[showFollowers, showFollowing, onEdit] )

      const handleLoadMore = async() => {
        setLoad1(true)
        setPage(page + 1)
        filterSearch({router, page: page + 1 })
        try{
          const res = await axios.get( `${baseUrl}/api/post/user_posts/${ router.query.id === loggeduser.user.username ? loggeduser.user._id : router.query.id}?limit=${(page * 3)+1}`, {  headers: {
              'Authorization': `Bearer ${token} `
            }}  )
            setPosts(res.data.posts) 
            setResult(res.data.result) 
            setLoad1(false)
        } catch (error) {
            console.log(error)
            setLoad1(false)
        } 
    }


  return (
    <>
     
     <div className="profile" >
        <Info userData={userData} onEdit={onEdit} setOnEdit={setOnEdit} loggeduser={loggeduser} setUserData={setUserData} CUP={CUP} CN={CN} CA={CA} token={token}
         showFollowers={showFollowers} setShowFollowers={setShowFollowers} showFollowing={showFollowing} setShowFollowing={setShowFollowing} setLoggedUser={setLoggedUser} />
         { router.query.id && ( loggeduser.user._id === router.query.id || loggeduser.user.username === router.query.id) &&
            <div className='profile_tab' >
                <button className={saveTab ? '' : 'active' } onClick={ () => setSaveTab(false) } > Posts </button>
                <button className={saveTab ? 'active' : '' } onClick={ () => setSaveTab(true) }  > Saved </button>
            </div>  
         }
        { load1 ? <img className="d-block mx-auto my-4" src="/assets/loading.gif" alt="loading" /> :
            <>
              {
                 saveTab 
                 ?  <Saved token={token} loggeduser={loggeduser} page={page} setLoad1={setLoad1} load1={load1} setPage={setPage} />
                 : <Posts posts={posts} result={result} handleLoadMore={handleLoadMore} page={page} />
              }
            </>
          }
     </div>

    </>
  )
}

export async function getServerSideProps ({req,res}) {
  let tokenReq= {}
  let userData ={}
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
        loggeduser2: userData,
        CUP : CLOUD_UPDATE_PRESET,
        CN :  CLOUD_NAME,
        CA : CLOUD_API 
      }
  }
}
