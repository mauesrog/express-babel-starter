import { Router } from 'express';
import * as Posts from './controllers/post_controller';


const router = Router();

router.route('/posts/')
      .get(Posts.getPosts)
      .post(Posts.createPost)
      .delete(Posts.clearPosts);

router.route('/posts/:id')
      .get(Posts.getPost)
      .put(Posts.updatePost)
      .delete(Posts.deletePost);

export default router;
