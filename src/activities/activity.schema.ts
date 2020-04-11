import mongoose from 'mongoose';

export const ActivitySchema = new mongoose.Schema({
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // owner of the proposal, poll or opinion.
    idCabildo: { type: mongoose.Schema.Types.ObjectId, ref: 'Cabildo' },
    activityType: { type: String, enum: ['discussion', 'proposal', 'poll'] },
    score: { type: Number, default: 0, required: true, index: true },
    ping: { type: Number, default: 0, required: true, index: true },
    commentNumber: { type: Number, default: 0, required: true },
    publishDate: { type: Date, default: Date.now },
    title: { type: String, required: true },
    text: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
    reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reaction'}],
    votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vote'}],
});

export interface Activity extends mongoose.Document {
    idUser: object;
    idCabildo: object;
    activityType: string;
    score: number;
    ping: number;
    commentNumber: number;
    publishDate: string;
    title: string;
    text: string;
    comments: object[];
    reactions: object[];
    votes: object[];
}
