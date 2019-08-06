const mongooose = require('mongoose');

const postSchema = mongooose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    imagePath: { type: String, require: true }
});

module.exports = mongooose.model('Post', postSchema);