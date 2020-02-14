import mongoose, {Schema} from 'mongoose';

const champSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    ChampName: String,
    Country: String,
    Popularity: {type: Number, default: 0, min: 0, max: 5},
  });

export const championships = mongoose.model('championships', champSchema);
