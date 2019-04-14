const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  fullName: {
    required: true,
    type: String
  },
  emailAddress: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return  regex.test(v);
      },
      message: props => `[400] ${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: {
    type: String
  },
  passwordResetToken: {
    type: String
  },
  passwordResetTokenExpiresAt: {
    type: Number
  },
  isSuperAdmin: {
    type: Boolean,
    default: false
  },
  groups: {
    type: Array,
  },
  active: {
    type: Boolean,
    default: false
  },
  permissions: {
    type: Object
  },
  createdAt: {
    type: Number
  },
  updatedAt: {
    type: Number
  }


});

UserSchema.pre('save', function (next) {

  const user = this;

  now = new Date().getTime();
  this.updatedAt = now;
  if (!this.created_at) {
    this.createdAt = now;
  }

  if (!user.isModified('password')) {
    return next();
  }

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(user.password, salt, function (err, hash) {
      user.password = hash;
      next();
    });
  });
});


UserSchema.methods.comparePassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, function (err, isMatch) {
      if(err) return reject(err);
      return resolve(isMatch);
    });
  })
};


UserSchema.set('toJSON', {
  transform: function(doc, ret, opt) {
    delete ret['password'] // Remove password from JSON responses
    delete ret['refreshToken'] // Remove refreshToken from JSON responses
    return ret
  }
});



module.exports = mongoose.model('User', UserSchema);
