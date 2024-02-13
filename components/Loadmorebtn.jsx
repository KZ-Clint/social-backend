import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import axios from 'axios'
import baseUrl from '@/components/baseUrl/baseUrl';
import { useRouter } from 'next/router';


export default function Loadmorebtn ({result, page, handleLoadMore}) {

  return (
    <>    
    { result < 3 * page  ? '' :
        <button className='btn btn-dark mx-auto d-block' onClick={handleLoadMore} > Load more </button>  
    }
    </>
  )
}