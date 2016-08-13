import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt-nodejs';

// create a schema for posts with a field
const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  password: String,
}, {
  timestamp: true,
},
);

UserSchema.set('toJSON', {
  virtuals: true,
});

UserSchema.pre('save', function encryptPassword(next) {
  try {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, (err, salt) => {
      try {
        if (err) { return next(err); }

        // hash (encrypt) our password using the salt
        bcrypt.hash(user.password, salt, null, (err, hash) => {
          if (err) { return next(err); }

          // overwrite plain text password with encrypted password
          user.password = hash;
          return next();
        });
      } catch (err) {
        return next(err);
      }
    });
  } catch (err) {
    return next(err);
  }
});

// note use of named function rather than arrow notation
//  this arrow notation is lexically scoped and prevents binding scope, which mongoose relies on
UserSchema.methods.comparePassword = function comparePassword(candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) { return callback(err); }

    callback(null, isMatch);
  });
};

// create model class
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
