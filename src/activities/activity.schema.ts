import { Schema, Document } from 'mongoose';

export const ReactionSchema = Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    idUser: { type: Schema.Types.ObjectId, ref: 'User' },
    value: { type: Number, enum: [-2, -1, 0, 1, 2] },
});

export interface Reaction extends Document {
    idUser: object;
    value: number;
}

export const VoteSchema = Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    idUser: { type: Schema.Types.ObjectId, ref: 'User' },
    value: { type: Number, enum: [-1, 0, 1] },
});

export interface Vote extends Document {
    idUser: object;
    value: number;
}

export const ActivitySchema = new Schema({
    idUser: { type: Schema.Types.ObjectId, ref: 'User' }, // owner of the proposal, poll or opinion.
    idCabildo: { type: Schema.Types.ObjectId, ref: 'Cabildo' },
    activityType: { type: String, enum: ['discussion', 'proposal', 'poll'] },
    score: { type: Number, default: 0, required: true },
    pingNumber: { type: Number, default: 0, required: true },
    commentNumber: { type: Number, default: 0, required: true },
    publishDate: { type: Date, default: Date.now },
    title: { type: String, required: true },
    text: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment'}],
    reactions: [{ type: Schema.Types.ObjectId, ref: 'Reaction'}],
    votes: [{ type: Schema.Types.ObjectId, ref: 'Vote'}],
});

export interface Activity extends Document {
    idUser: object;
    idCabildo: object;
    activityType: string;
    score: number;
    pingNumber: number;
    commentNumber: number;
    publishDate: string;
    title: string;
    text: string;
    comments: object[];
    reactions: object[];
    votes: object[];
}
