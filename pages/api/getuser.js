import cookie from 'cookie'

export default ( req, res) => {
    let token = {}
    if(req.cookies.token){
        token =JSON.parse(req.cookies.token)
    }
    if (!token) {
        return res.json({})
    }
    return res.json(token)
}