import { Router } from 'express';
import { requireAuth, requireSignin } from './services/passport';
import * as Posts from './controllers/post_controller';
import * as Users from './controllers/user_controller';


const router = Router();

function what(p1, p2) {
  console.log(p1);
}

router.route('/posts/')
      .get(Posts.getPosts)
      .post(requireAuth, Posts.createPost)
      .delete(requireAuth, Posts.clearPosts);

router.route('/posts/:id')
      .get(Posts.getPost)
      .put(requireAuth, Posts.updatePost)
      .delete(requireAuth, Posts.deletePost);

router.post('/signin', requireSignin, Users.signin);

router.post('/signup', Users.signup);

export default router;
