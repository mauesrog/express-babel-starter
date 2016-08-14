import User from '../models/user_model.js';
import jwt from 'jwt-simple';
import config from '../config';

// encodes a new token for a user object
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  const sub = user.id ? user.id : user._id;

  return jwt.encode({ sub, iat: timestamp }, config.secret);
}

export const signin = (req, res) => {
  try {
    if (typeof req.body.email === 'undefined' || typeof req.body.password === 'undefined') {
      res.json({
        error: 'ERR: Users need \'email\' and \'password\' fields',
      });
    } else {
      const token = tokenForUser(req.user);
      res.json({ token, email: req.user.email });
    }
  } catch (err) {
    res.json({ error: `${err}` });
  }
};


export const signup = (req, res) => {
  try {
    const user = new User();

    if (typeof req.body.email === 'undefined' || typeof req.body.password === 'undefined') {
      res.json({
        error: 'ERR: Users need \'email\' and \'password\' fields',
      });
    } else {
      user.email = req.body.email;
      user.password = req.body.password;

      user.save()
      .then(result => {
        const token = tokenForUser(result);
        res.json({ token, email: req.user.email });
      })
      .catch(error => {
        res.json({ error });
      });
    }
  } catch (err) {
    res.json({ error: `${err}` });
  }
};
