import axios from 'axios'

export const createNotify = async (msg,baseUrl,token, sockett) => {
    try{
        const res = await axios.post( `${baseUrl}/api/notify`, msg , {  headers: {
           'Authorization': `Bearer ${token} `
         }} )
        console.log(res)


        } catch (err) {
          console.log(err)
        }
 }

 export const deleteNotify = async (msg,baseUrl,token, sockett) => {
    try{
        const res = await axios.delete( `${baseUrl}/api/notify/${msg.id}?url=${msg.url}`, {  headers: {
           'Authorization': `Bearer ${token} `
         }} )
        console.log(res)


        } catch (err) {
          console.log(err)
        }
 
 }