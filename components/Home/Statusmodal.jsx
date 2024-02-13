import Head from 'next/head'
import { useState, useEffect, useContext, useRef } from 'react'
import Link from 'next/link'
import axios from 'axios'
import baseUrl from '@/components/baseUrl/baseUrl';
import { useRouter } from 'next/router';
import { Context } from '../Context';
import { avatarUpload } from '../imageUpload';
import { createNotify } from '../Actions';


export default function Statusmodal ({CUP, CN, CA, token, loggeduser, editPost, setPosts, posts}) {
    const { status, setStatus, setSuccess, setError, setTheme, theme, setGenLoading, onEdit, setOnEdit, sockett } = useContext(Context)
    const [ content, setContent ] = useState("")
    const [ images, setImages ] = useState([])
    const [stream, setStream] = useState(false)
    const [tracks, setTracks] = useState("")
    const videoRef = useRef()
    const refCanvas = useRef()

   const handleChangeImages = (e) => {
           const files = [ ...e.target.files ]
           let err = ""
           let newImages = []

           files.forEach( (file) => {
              if(!file) return err = "File does not exist."
              if(file.type !== "image/jpeg" && file.type !== "image/png" ) { 
                 return err = "Image format is incorrect."
              }
              return newImages.push(file)
           } )
           if(err) {
            setError(err)
           } 
           setImages([...images, ...newImages])
           console.log([...images, ...newImages])
   }
       const deleteImages = (index) => { 
        const newArr = [...images]
        newArr.splice(index, 1)
        setImages(newArr)
     }

     const handleStream = async() => {
         setStream(true)
         if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia ){
            console.log(navigator.mediaDevices)
            console.log(refCanvas)
            try{ 
           const mediaStream = await navigator.mediaDevices.getUserMedia({video:true})
                videoRef.current.srcObject = mediaStream
                videoRef.current.play()
                const track = mediaStream.getTracks()
                setTracks(track[0])
            } catch (err)  {
                console.log(err)
            } 
         }
     }
     const handleCapture = () => {
        const width = videoRef.current.clientWidth;
        const height = videoRef.current.clientHeight;
        refCanvas.current.setAttribute("width", width)
        refCanvas.current.setAttribute("height", height)
        const ctx = refCanvas.current.getContext("2d")
        ctx.drawImage(videoRef.current, 0, 0, width, height)
        let URL = refCanvas.current.toDataURL()
        setImages([...images, {camera: URL}])
     }
     const handleStopStream = () => {
        tracks.stop()
        setStream(false)
     }
     const handleSubmit = async(e) => {
        e.preventDefault()

        if(images.length === 0){
            return setError("Please add your photo")
        }
        setGenLoading(true)
        if(onEdit) {
          let media;
          const imgNewUrl = images.filter( (img) => !img.url )
          const imgOldUrl = images.filter( (img) => img.url )
         
          if(editPost.content === content && imgNewUrl.length === 0 && imgOldUrl.length === editPost.images.length ) {
             return setGenLoading(false);
          }
          if(imgNewUrl.length > 0) {
           media = await avatarUpload(imgNewUrl, CUP, CN, CA )
          }
        
          try{
            const res = await axios.patch( `${baseUrl}/api/post/${editPost._id}`, { content, images: media ? [...imgOldUrl, ...media ] : imgOldUrl }, {  headers: {
               'Authorization': `Bearer ${token} `
             }} )
            console.log(res.data)
            setSuccess(res.data.msg)
            setPosts(posts.filter( (p) => {
               if(p._id === editPost._id) {
                  p.content = res.data.post.content;
                  p.images = res.data.post.images
               }
               return p
            } ) )
            if(tracks) tracks.stop()
            setGenLoading(false)    
          } catch (err) {
             console.log(err)
             setGenLoading(false)
          }
          setGenLoading(false)    
        }  
           else { 
        let media;
         if(images.length > 0) {
            media = await avatarUpload(images, CUP, CN, CA)
         }
        try{
         const res = await axios.post( `${baseUrl}/api/post`, { content, images: media }, {  headers: {
            'Authorization': `Bearer ${token} `
          }} )
         // posts.push({...res.data.post, user:loggeduser.user})
         setSuccess(res.data.msg)
         setContent("")
         setImages([])
         setPosts([{...res.data.post, user:loggeduser.user}, ...posts])
         if(tracks) tracks.stop()
         setGenLoading(false)    

         const msg = { id:res.data.post._id, text: "added a new post", recipients:res.data.post.user.followers, url:`/post/${res.data.post._id}`, content, image:media[0].url }
         await createNotify(msg,baseUrl,token,sockett)

       } catch (err) {
          console.log(err)
         //  setError(err.response.data.error)
          setGenLoading(false)
       } } 
     }

    useEffect( () => {
      if(onEdit){
         setContent(editPost.content)
         setImages(editPost.images)
      } 
    },[onEdit] )

  return (
    <>  { status && Object.keys(loggeduser).length > 0 && 
       <div className='status_modal' > 
           <form onSubmit={handleSubmit} >
              <div className='status_header' >
                 <h5 className='m-0' > Create Post </h5>
                 <span onClick={ () => { setStatus(false); setOnEdit(false) } } > &times;</span>
              </div>
              <div className='status_body' >
                <textarea name="content" value={content} placeholder={`${loggeduser.user.username}, what are you thinking?`}
                onChange={ (e) => { setContent(e.target.value) } } />
                <div className='show_images' >
                   {
                      images.map( (img, index) => (
                          <div key={index} id="file_img" >
                              <img className='img-thumbnail' src={ img.url ? img.url : URL.createObjectURL(img) } alt="images" style={{ filter: `${ theme ? 'invert(1)' : 'invert(0)' }` }} />
                              <span onClick={ () => { deleteImages(index)} } > &times; </span>
                          </div>  
                      ) )  
                   }
                </div>

                {    
                   stream && 
                    <div className='stream position-relative' > 
                       <video  autoPlay muted ref={videoRef} width="100%" height="100%"  style={{ filter: `${ theme ? 'invert(1)' : 'invert(0)' }` }}  />
                       <span onClick={handleStopStream} > &times; </span>
                       <canvas ref={refCanvas} />
                    </div>
                }

                <div className='input_images' >
                     { stream 
                     ? <i className='fas fa-camera' onClick={handleCapture} />
                     : <>
                        <i className='fas fa-camera' onClick={handleStream} />
                        <div className='file_upload' >
                           <i className='fas fa-image' />
                           <input type="file" name="file" id="file" multiple accept='image/*' onChange={handleChangeImages} />
                        </div>
                     </>
                      }
                </div>
              </div>
              <div className='status_footer my-2' >
                  <button className='btn btn-secondary w-100' type="submit" > Post </button>
              </div>
           </form>
        </div> 
        }
    </>
  )
}
