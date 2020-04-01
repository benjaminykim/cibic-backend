import { Schema, Document } from 'mongoose';


export const UsersSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String, required: true },
    lastName: { type: String, required: true },
    maidenName: { type: String, required: true },
    phone: { type: Number, required: true },
    rut: { type: String, required: true }, /* Chilean dni */
    cabildos: [{ type: Schema.Types.ObjectId, ref: 'Cabildo' }],
    activityVotes: [{ type: String, required: true }],
    commentVotes: [{ type: String, required: true }],
    files: [{ type: String, required: true }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'Users' }],
    activityFeed: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    citizenPoints: {type: Number, default: 0},
});

export interface Users extends Document {
    username: string;
    email: string;
    password: string;
    firstName: string;
    middleName: string;
    lastName: string;
    maidenName: string;
    phone: number;
    rut: string;
    cabildos: object[];
    activityVotes: string[];
    commentVotes: string[];
    files: string[];
    followers: object[];
    following: object[];
    activityFeed: object[];
    citizenPoints: number;
}

export interface Following extends Document {
    follower: string;
    followed: string;
}
