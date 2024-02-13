import Cardheader from './Cardheader';
import Cardbody from './Cardbody';
import Cardfooter from './Cardfooter';
import Comments from './Comments';
import Inputcomment from './Inputcomment';


export default function Postcard ({posts, loggeduser, setLoggedUser, setPosts, setEditPost, token, post}) {

  return (
    <>    
        <div className="card my-3" >
            <Cardheader post={post} loggeduser={loggeduser} setEditPost={setEditPost} setPosts={setPosts} token={token} posts={posts} />
            <Cardbody post={post} />
            <Cardfooter post={post} token={token} posts={posts} setPosts={setPosts} loggeduser={loggeduser} setLoggedUser={setLoggedUser} />

            <Comments post={post} loggeduser={loggeduser} setPosts={setPosts} posts={posts} token={token} />
            <Inputcomment post={post} loggeduser={loggeduser} token={token} setPosts={setPosts} posts={posts} />
        </div>  
    </>
  )
}
