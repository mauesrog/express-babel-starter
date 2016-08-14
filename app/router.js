import { Router } from 'express';
import { requireAuth, requireSignin } from './services/passport';
import * as Posts from './controllers/post_controller';
import * as Users from './controllers/user_controller';


const router = Router();

router.route('/posts/')
      .get(requireAuth, Posts.getPosts)
      .post(requireAuth, Posts.createPost);

router.route('/posts/clear/:email')
      .delete(requireAuth, Posts.clearPosts);

router.route('/posts/:id')
      .get(requireAuth, Posts.getPost)
      .put(requireAuth, Posts.updatePost)
      .delete(requireAuth, Posts.deletePost);

router.post('/signin', requireSignin, Users.signin);

router.post('/signup', Users.signup);

export default router;
