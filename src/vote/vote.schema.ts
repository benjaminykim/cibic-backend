import mongoose from 'mongoose';

export const VoteSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    value: { type: Number, enum: [-1, 0, 1] },
});

export interface Vote extends mongoose.Document {
    idUser: object;
    value: number;
}
