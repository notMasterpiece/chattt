import mongoose from 'mongoose';

const ChannelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true
    },
    channelDescription: {
        type: String,
        required: true
    },
    channelDate: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false });

export default mongoose.model('channel', ChannelSchema);
