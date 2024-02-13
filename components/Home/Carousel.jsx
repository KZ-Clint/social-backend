import Head from 'next/head'
import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import axios from 'axios'
import baseUrl from '@/components/baseUrl/baseUrl';
import { useRouter } from 'next/router';
import { Context } from '../Context';


export default function Carousel ({images, id}) {
    const { theme } = useContext(Context)
    const isActive = (index) => {
        if(index === 0 ) return "active";

    }

  return (
    <>    
        <div id={`image${id}`} className="carousel slide" data-ride="carousel">
            <ol className="carousel-indicators">
                { images.map( (img, index) => (
                    <li key={index} data-target={`#image${id}`} data-slide-to={index} className={isActive(index)} />
                ) ) }
            </ol>
            <div className="carousel-inner">
                { images.map( (img, index) => (
                    <div className={`carousel-item ${isActive(index)}`} key={index} >
                       <img src={img.url} className="d-block w-100" alt={img.url} style={{ filter: `${ theme ? 'invert(1)' : 'invert(0)' }` }} />
                    </div>
                ) ) } 
              
            </div>
            <a className="carousel-control-prev" href={`#image${id}`} role="button" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
            </a>
            <a className="carousel-control-next" href={`#image${id}`} role="button" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
            </a>
        </div>
    </>
  )
}
