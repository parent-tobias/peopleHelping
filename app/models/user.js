const mongoose = require('mongoose'),
      bcrypt   = require('bcrypt-nodejs'),
      
      userSchema = mongoose.Schema({
        local           : {
          email         : String,
          password      : String,
          role          : String
        },
        facebook        : {
          id            : String,
          token         : String,
          name          : String,
          email         : String,
        },
        twitter         : {
          id            : String,
          token         : String,
          displayName   : String,
          username      : String,
        },
        google          : {
          id            : String,
          token         : String,
          name          : String,
          email         : String,
        },
        tokens: [
          {
            type: String,
            token: String
          }
        ]
      }, {
        timestamps      : true
      });

/* Methods */
// generating a hash
userSchema.methods = {
  generateHash: function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  },
  validPassword: function(password){
    return bcrypt.compareSync(password, this.local.password);
  } 
};

module.exports = mongoose.model('User', userSchema);

