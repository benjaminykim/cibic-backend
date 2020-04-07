import mongoose from 'mongoose';

export const VoteSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    value: { type: Number, enum: [-1, 0, 1] },
});

export interface Vote extends mongoose.Document {
    idUser: object;
    value: number;
}

export const ActivitySchema = new mongoose.Schema({
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // owner of the proposal, poll or opinion.
    idCabildo: { type: mongoose.Schema.Types.ObjectId, ref: 'Cabildo' },
    activityType: { type: String, enum: ['discussion', 'proposal', 'poll'] },
    score: { type: Number, default: 0, required: true },
    ping: { type: Number, default: 0, required: true },
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
