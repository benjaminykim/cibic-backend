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
