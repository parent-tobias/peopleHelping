const mongoose = require('mongoose'),
      
      postSchema = mongoose.Schema({
        title           : String,
        description     : String,
        author          : {
          type: Schema.types.ObjectId,
          ref: 'User'
        },
        category        : [{
          type          : Schema.types.ObjectId,
          ref           : 'Category'
        }],
        startDate       : {
          type          : Date,
          default       : Date.now()
        },
        endDate         : Date
      }, {
        timestamps      : true
      });

/* Methods */

module.exports = mongoose.model('Post', postSchema);

