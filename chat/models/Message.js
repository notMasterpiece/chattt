import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    message: {
      type: String,
      required: true
    },
    user: {
        type: String,
        required: true
    },
    channelID: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

export default mongoose.model('message', MessageSchema);
