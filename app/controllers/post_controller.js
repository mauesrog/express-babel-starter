import Post from '../models/post_model';

const cleanPosts = posts => {
  return posts.map(post => {
    return { id: post._id, title: post.title, tags: post.tags };
  });
};

export const createPost = (req, res) => {
  try {
    const post = new Post();

    if (!(req.body.title && req.body.tags && req.body.content) || Object.keys(req.body).length > 3) {
      res.json({
        error: 'ERR: Posts need \'title\', \'tags\', and \'content\' fields',
      });
    } else {
      Object.assign(post, req.body);

      post.save()
      .then(result => {
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
        res.json(cleanPosts(result));
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
        const data = cleanPosts([result])[0];
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
    Post.update({ _id: req.params.id }, req.body)
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
    Post.remove()
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
