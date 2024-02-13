import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { Context } from '@/components/Context'
import {useRouter} from 'next/router'
import axios from 'axios'
import baseUrl from '@/components/baseUrl/baseUrl'
import { checkImage, avatarUpload } from '../imageUpload'


export default function Editprofile ({user, setOnEdit, setUserData, CUP, CN, CA, token}) {
    const { setGenLoading, setError, setSuccess, theme } = useContext(Context)
    const initialState = {  fullname: '', mobile: '', address:'', website:'', story:'', gender:'' }
    const [ userData, setUserData2 ] = useState(initialState)
    const { fullname, mobile, address, website, story, gender } = userData

    const [ avatar, setAvatar ] = useState('')
    const [ isAvatar, setIsAvatar ] = useState(false)
    const router = useRouter()

    useEffect( () => {
      setUserData2(user)
    },[user] )

    const changeAvatar = async (e) => {
       const file = e.target.files[0]
       const err = await checkImage(file)
       if(err) return setError(err)
       setAvatar(file)
       setIsAvatar(true)
    }
    const handleInput = (e) => {
      const {name, value} = e.target
      setUserData2({...userData, [name] : value })  
    }
    const handleSubmit = async (e) => {
       e.preventDefault()
       if(!userData.fullname) return setError("Please add your full name")
       if(userData.fullname.length > 25) return setError("Your full name is too long")
       if(userData.story.length > 200) return setError("Your story is too long")
       setGenLoading(true)
       let media;
       if(isAvatar) {
          media = await avatarUpload([avatar], CUP, CN, CA)
        }
        try {
       const res = await axios.patch( `${baseUrl}/user/update/${router.query.id}`, { ...userData, avatar: media ? media[0].url : user.avatar  }, {  headers: {
         'Authorization': `Bearer ${token} `
       }}  )
       setSuccess("Profile updated successfully")
       setUserData(res.data.user)
       setGenLoading(false)
       } catch (error) {
         console.log(error)
         setGenLoading(false)
       }
    }



  return (
    <>
        <div className="edit_profile" > 
           <button className="btn btn-danger btn_close" onClick={ () => { setOnEdit(false) } } > Close </button>
           <form onSubmit={handleSubmit} >
               <div className="info_avatar" >
                  <img style={{ filter: `${ theme ? 'invert(1)' : 'invert(0)' }` }}
                  src={ avatar ? URL.createObjectURL(avatar) : user.avatar  } alt="avatar"  />
                  <span>
                     <i className="fas fa-camera" />
                     <p> Change </p>
                     <input type="file" name="file" id="file_up" accept='image/*' onChange={changeAvatar} />
                  </span>
               </div>
               <div className='form-group' >
                  <label htmlFor='fullname'> Full Name </label>
                  <div className='position-relative' >
                     <input type="text" className='form-control' id="fullname" name="fullname" value={fullname} onChange={handleInput} />
                     <small className="text-danger position-absolute" style={{top:'50%', right: '5px', transform: 'translateY(-50%)' }} >
                        {fullname.length}/25
                     </small>
                  </div>
               </div>
               <div className='form-group' >
                  <label htmlFor='mobile'> Mobile </label>
                  <input type="number" className='form-control' id="mobile" name="mobile" value={mobile} onChange={handleInput} />
               </div>
               <div className='form-group' >
                  <label htmlFor='address'> Address </label>
                  <input type="text" className='form-control' id="address" name="address" value={address} onChange={handleInput} />
               </div>
               <div className='form-group' >
                  <label htmlFor='website'> Website </label>
                  <input type="text" className='form-control' id="website" name="website" value={website} onChange={handleInput} />
               </div>
               <div className='form-group' >
                  <label htmlFor='story'> Story </label>
                  <textarea type="text" className='form-control' cols="30" rows="4" id="story" name="story" value={story} onChange={handleInput} />
                  <small className="text-danger d-block text-right">
                      {story.length}/200
                  </small>
               </div>
               <label htmlFor="gender"> Gender </label>
               <div className='input-group-prepend px-0 mb-4' >
                  <select name="gender" id="gender" className='custom-select text-capitalize' value={gender} onChange={handleInput} >
                     <option value="male" > Male </option>
                     <option value="female" > Female </option>
                  </select>
               </div>
               <button className='btn btn-info w-100' type="submit" > Save </button>
           </form>
        </div>
    </>
  )
}