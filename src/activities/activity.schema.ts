import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ReplySchema = Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    idUser: { type: Schema.Types.ObjectId, ref: 'Users' },
    publishDate: { type: Date, default: Date.now() },
    content: { type: String, required: true},
    score: { type: Number, required: true, default: 0 },
});

const CommentSchema = Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    //idUser: { type: Schema.Types.ObjectId, ref: 'Users' },
    idUser: { type: String },
    publishDate: { type: Date, default: Date.now() },
    content: { type: String, required: true},
    score: { type: Number, required: true, default: 0 },
    reply: [{ type: Schema.Types.ObjectId, ref: 'ReplySchema' }],
});

const ReactionSchema = Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    idUser: { type: Schema.Types.ObjectId, ref: 'Users' },
    value: { type: Number, enum: [-2, -1, 0, 1, 2] },
});

const VoteSchema = Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    idUser: { type: Schema.Types.ObjectId, ref: 'Users' },
    value: { type: Number, enum: [-1, 0, 1] },
});

export const ActivitySchema = new Schema({
    idUser: { type: Schema.Types.ObjectId, ref: 'Users' }, // owner of the proposal, poll or opinion.
    idCabildo: { type: Schema.Types.ObjectId, ref: 'Cabildo' },
    //idUser: { type: String, required: true }, // owner of the proposal, poll or opinion.
    //idCabildo: { type: String, required: true },
    activityType: { type: String, enum: ['discussion', 'proposal', 'poll'] },
    score: { type: Number, default: 0, required: true },
    pingNumber: { type: Number, default: 0, required: true },
    commentNumber: { type: Number, default: 0, required: true },
    publishDate: { type: Date, default: Date.now() },
    title: { type: String, required: true },
    text: { type: String, required: true },
    comments: [CommentSchema],
	reactions: [ReactionSchema],
	votes: [VoteSchema],
});

export interface Activity extends mongoose.Document {
    idUser: string;
    idCabildo: string;
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
