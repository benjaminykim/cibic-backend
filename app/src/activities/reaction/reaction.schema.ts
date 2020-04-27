import mongoose from 'mongoose';

export const ReactionSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    idUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    value: { type: Number, enum: [-2, -1, 0, 1, 2] },
});

export interface Reaction extends mongoose.Document {
    idUser: object;
    value: number;
}
