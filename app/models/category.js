const mongoose = require('mongoose'),
      bcrypt   = require('bcrypt-nodejs'),
      Schema = mongoose.Schema,
      
      categorySchema = mongoose.Schema({
        title           : String,
        description     : String,
        parent          : {
          type          : Schema.Types.ObjectId,
          ref           : 'Category'
        },
        children        : [{
          type          : Schema.Types.ObjectId,
          ref           : 'Category'
        }],
        author          : {
          type          : Schema.Types.ObjectId,
          ref           : 'User'
        }
      }, {
        timestamps      : true
      });

/* Methods */

module.exports = mongoose.model('Category', categorySchema);

