import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import axios from 'axios'
import { Context } from '@/components/Context'
import {useRouter} from 'next/router'
import Postthumb from './Postthumb'
import baseUrl from '../baseUrl/baseUrl'
import Loadmorebtn from '../Loadmorebtn'
import { filterSearch } from '../Discover/Filtersearch'

export default function Saved ( { token, loggeduser, page, setLoad1, load1, setPage} ) {

   const router = useRouter() 
   const [ savedPosts, setSavedPosts ] = useState([])
   const [ result, setResult ] = useState(9)

   useEffect( () => {
    const getSavedPosts = async() => {  
            try{
              const res = await axios.get( `${baseUrl}/api/post/saved_posts?limit=${page * 3}`, {  headers: {
                  'Authorization': `Bearer ${token} `
                }}  )
                console.log(res.data)
                setSavedPosts(res.data.savedPosts) 
                setResult(res.data.result) 
                setLoad1(false)
            } catch (error) {
                console.log(error)
                setLoad1(false)
            } } 
    getSavedPosts()
  },[] )

  const handleLoadMore = async() => {
    setLoad1(true)
    setPage(page + 1)
    filterSearch({router, page: page + 1 })
    try{
      const res = await axios.get( `${baseUrl}/api/post/saved_posts?limit=${(page * 3)+1}`, {  headers: {
          'Authorization': `Bearer ${token} `
        }}  )
        setSavedPosts(res.data.posts) 
        setResult(res.data.result) 
        setLoad1(false)
    } catch (error) {
        console.log(error)
        setLoad1(false)
    } 
}



  return (
    <>
        <div> 
           <Postthumb posts={savedPosts} result={result} />       
        </div>
        <Loadmorebtn handleLoadMore={handleLoadMore} result={result} page={page} />
    </>
  )
}