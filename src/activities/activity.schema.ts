import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ReplySchema = Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Users' },
    createdAt: { type: Date, default: Date.now() },
    content: { type: String, required: true},
    score: { type: Number, required: true, default: 0 },
});

const CommentSchema = Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Users' },
    createdAt: { type: Date, default: Date.now() },
    content: { type: String, required: true},
    score: { type: Number, required: true, default: 0 },
    reply: [{ type: Schema.Types.ObjectId, ref: 'ReplySchema' }],
});

const reactionSchema = Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Users' },
    value: { type: Number, enum: [-2, -1, 0, 1, 2] },
});

const voteSchema = Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Users' },
    value: { type: Number, enum: [-1, 0, 1] },
});

export const ActivitySchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: 'Users' }, // owner of the proposal, poll or opinion.
    cabildo: { type: Schema.Types.ObjectId, ref: 'Cabildo' },
    activityType: { type: String, enum: ['discussion', 'proposal', 'poll'] },
    score: { type: Number, default: 0, required: true },
    pingNumber: { type: Number, default: 0, required: true },
    commentNumber: { type: Number, default: 0, required: true },
    createdAt: { type: Date, default: Date.now() },
    title: { type: String, required: true },
    text: { type: String, required: true },
    comments: [{ type: Schema.Types.ObjectId, ref: 'CommentSchema'}],
    reaction: [{ type: Schema.Types.ObjectId, ref: 'reactionSchema'}],
    votes: [{ type: Schema.Types.ObjectId, ref: 'voteSchema'}],
});

export interface Activity extends mongoose.Document {
    createdBy: string;
    cabildo: string;
    activityType: string;
    score: number;
    pingNumber: number;
    commentNumber: number;
    createdAt: string;
    title: string;
    text: string;
    comments: object[];
    reaction: object[];
    votes: object[];
}
