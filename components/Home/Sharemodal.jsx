import { useState, useEffect, useContext, use } from 'react'
import Link from 'next/link'
import axios from 'axios'
import baseUrl from '@/components/baseUrl/baseUrl';
import { useRouter } from 'next/router';
import { FacebookShareButton, FacebookIcon,
         EmailShareButton, EmailIcon,
         LinkedinShareButton, LinkedinIcon,
         WhatsappShareButton, WhatsappIcon,
         TwitterShareButton, TwitterIcon,
         TelegramShareButton, TelegramIcon
         } from 'react-share';
import { Context } from '../Context';


export default function Sharemodal ({url}) {
  const { theme } = useContext(Context)

  return (
    <>    
       <div className='d-flex justify-content-between px-4 py-2' style={{ filter: theme? 'invert(1)' : 'invert(0)' }} >
          <FacebookShareButton url={url} >
              <FacebookIcon round={true} size={32} />
          </FacebookShareButton>

          <TwitterShareButton url={url} >
              <TwitterIcon round={true} size={32} />
          </TwitterShareButton>

          <EmailShareButton url={url} >
              <EmailIcon round={true} size={32} />
          </EmailShareButton>

          <TelegramShareButton url={url} >
              <TelegramIcon round={true} size={32} />
          </TelegramShareButton>

          <LinkedinShareButton url={url} >
              <LinkedinIcon round={true} size={32} />
          </LinkedinShareButton>

          <WhatsappShareButton url={url} >
              <WhatsappIcon round={true} size={32} />
          </WhatsappShareButton>
       </div> 
    </>
  )
}
