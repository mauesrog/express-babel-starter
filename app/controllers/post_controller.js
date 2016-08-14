import Post from '../models/post_model';

const cleanPosts = (posts, user) => {
  return posts.map(post => {
    const cleanPost = {
      id: post._id,
      title: post.title,
      tags: post.tags,
      content: post.content,
      author: post.author,
    };

    if (user.email === post.author) {
      cleanPost.locked = false;
    } else {
      cleanPost.locked = true;
    }

    return cleanPost;
  });
};

export const createPost = (req, res) => {
  try {
    const post = new Post();

    if (typeof req.body.title === 'undefined' || typeof req.body.tags === 'undefined' || typeof req.body.content === 'undefined') {
      res.json({
        error: 'ERR: Posts need \'title\', \'tags\', and \'content\' fields',
      });
    } else {
      post.title = req.body.title;
      post.tags = req.body.tags.length ? req.body.tags.split(' ') : [];
      post.content = req.body.content;
      post.author = req.user.email;

      post.save()
      .then(result => {
        console.log(result);
        res.json({ message: `Post created with \'id\' ${result._id}!` });
      })
      .catch(error => {
        res.json({ error });
      });
    }
  } catch (err) {
    res.json({ error: `${err}` });
  }
};
export const getPosts = (req, res) => {
  try {
    Post.find()
    .then(result => {
      try {
        res.json({ posts: cleanPosts(result, req.user), user: req.user.email });
      } catch (err) {
        res.json({ error: `${err}` });
      }
    })
    .catch(error => {
      res.json({ error });
    });
  } catch (err) {
    res.json({ error: `${err}` });
  }
};
export const getPost = (req, res) => {
  try {
    Post.findById(req.params.id)
    .then(result => {
      try {
        const data = cleanPosts([result], req.user)[0];
        data.content = result.content;

        res.json(data);
      } catch (err) {
        res.json({ error: `${err}` });
      }
    })
    .catch(error => {
      res.json({ error });
    });
  } catch (err) {
    res.json({ error: `${err}` });
  }
};
export const deletePost = (req, res) => {
  try {
    Post.remove({ _id: req.params.id })
    .then(result => {
      try {
        const status = {};

        if (result.result.n > 0) {
          status.message = `Post with \'id\' ${req.params.id} deleted`;
        } else {
          status.error = `ERR: Post with \'id\' ${req.params.id} doesn't exist`;
        }

        res.json(status);
      } catch (err) {
        res.json({ error: `${err}` });
      }
    })
    .catch(error => {
      res.json({ error });
    });
  } catch (err) {
    res.json({ error: `${err}` });
  }
};
export const updatePost = (req, res) => {
  try {
    const body = req.body;

    if (typeof body.tags !== 'undefined') {
      body.tags = body.tags.length ? body.tags.split(' ') : [];
    }

    Post.update({ _id: req.params.id }, body)
    .then(result => {
      try {
        const status = {};

        if (result.n > 0) {
          status.message = `Post with \'id\' ${req.params.id} identified`;

          if (result.nModified > 0) {
            status.message += ' and updated';
          } else {
            status.message += ' but nothing to update';
          }
        } else {
          status.error = `ERR: Post with \'id\' ${req.params.id} doesn't exist`;
        }

        res.json(status);
      } catch (err) {
        res.json({ error: `${err}` });
      }
    })
    .catch(error => {
      res.json({ error });
    });
  } catch (err) {
    res.json({ error: `${err}` });
  }
};

export const clearPosts = (req, res) => {
  try {
    Post.remove({ author: req.params.email.replace(/\[/g, '.').replace(/\]/g, '@') })
    .then(result => {
      try {
        const status = {};

        if (result.result.n > 0) {
          status.message = `${result.result.n} posts deleted`;
        } else {
          status.error = 'ERR: No posts to delete';
        }

        res.json(status);
      } catch (err) {
        res.json({ error: `${err}` });
      }
    })
    .catch(error => {
      res.json({ error });
    });
  } catch (err) {
    res.json({ error: `${err}` });
  }
};
