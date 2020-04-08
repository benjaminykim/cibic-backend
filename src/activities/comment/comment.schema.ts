import mongoose from 'mongoose';

export const CommentSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    publishDate: { type: Date, default: Date.now },
    content: { type: String, required: true},
    score: { type: Number, required: true, default: 0 },
    reply: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reply'}],
});

export interface Comment extends mongoose.Document {
	idUser: object;
	publishDate: number;
	content: string;
	score: number;
	reply: object[];
}
