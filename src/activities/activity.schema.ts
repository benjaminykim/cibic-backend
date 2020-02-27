import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const ActivitySchema = new Schema({
    _id: { type: Schema.Types.ObjectId, auto: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Users' }, // owner of the proposal, poll or opinion.
    cabild: { type: Schema.Types.ObjectId, ref: 'Cabildo' },

});
