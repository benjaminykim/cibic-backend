import { Schema, Document } from 'mongoose';

export const CommentSchema = Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    idUser: { type: Schema.Types.ObjectId, ref: 'Users' },
    publishDate: { type: Date, default: Date.now },
    content: { type: String, required: true},
    score: { type: Number, required: true, default: 0 },
	reply: [{ type: Schema.Types.ObjectId, ref: 'Reply'}],
});

export interface Comment extends Document {
	idUser: object;
	publishDate: number;
	content: string;
	score: number;
	reply: object[];
}
