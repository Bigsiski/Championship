import mongoose, {Schema} from 'mongoose';

const champSchema = new Schema(
  {
    ChampName: {type: String},
    Country: String,
    Popularity: {type: Number, default: 0, min: 0, max: 5},
    teams: { type: Array, default: void 0 } //[{_id: {type: mongoose.Schema.Types.ObjectId}}]
  });

export const championships = mongoose.model('championships', champSchema);
