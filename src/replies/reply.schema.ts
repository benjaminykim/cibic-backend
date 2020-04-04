import { Schema, Document } from 'mongoose';

export const ReplySchema = Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    idUser: { type: Schema.Types.ObjectId, ref: 'User' },
    publishDate: { type: Date, default: Date.now },
    content: { type: String, required: true},
    score: { type: Number, required: true, default: 0 },
});

export interface Reply extends Document {
	idUser: object;
	publishDate: object;
	content: string;
	score: number;
}
