import axios from 'axios'

export const checkImage = async (file) => {

    let err = ""
    if(!file) return err = "File does not exist"
    if( file.size > 1024 * 1024 ) return err = 'The largest image size is 1mb'
    if( file.type !== 'image/jpeg' && file.type !== 'image/png' ) return err = 'Image format is incorrect'
 
 }

export const avatarUpload = async ( images, CUP, CN, CA) => {

    let imgArr = []
    for ( const item of images ) { 
   
     const formData = new FormData()
     if(item.camera) {
      formData.append( "file", item.camera )
     } else {
      formData.append( "file", item )
     }
      formData.append( "upload_preset",  CUP)
      formData.append( "cloud_name", CN )
 
      const res = await axios.post( CA , formData  )
      const data = await res.data
      imgArr.push({ public_id: data.public_id, url: data.secure_url })
       
    }
    return imgArr;
 }

