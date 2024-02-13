import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { Context } from '@/components/Context'
import {useRouter} from 'next/router'
import Postthumb from './Postthumb'
import baseUrl from '../baseUrl/baseUrl'
import Loadmorebtn from '../Loadmorebtn'

export default function Posts ( {posts, result, handleLoadMore, page} ) {


  return (
    <>
        <div> 
           <Postthumb posts={posts} result={result} />       
        </div>
        <Loadmorebtn handleLoadMore={handleLoadMore} result={result} page={page} />
    </>
  )
}