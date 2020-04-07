import mongoose from 'mongoose';

export const ReplySchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    publishDate: { type: Date, default: Date.now },
    content: { type: String, required: true},
    score: { type: Number, required: true, default: 0 },
});

export interface Reply extends mongoose.Document {
	idUser: object;
	publishDate: object;
	content: string;
	score: number;
}
