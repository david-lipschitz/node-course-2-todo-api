var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number, // a regular old Unix Timestamp
        default: null
    },
    _creator: { //_ tells the user that this is an object id
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});

module.exports = {Todo};