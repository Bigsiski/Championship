import mongoose, {Schema} from 'mongoose';

const playerSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    Parent: {
      _id: {type: mongoose.Schema.Types.ObjectId, ref: "teams"},
      ParentName: {type: String, default: "teams"}
    },
    PlayerName: String,
    Goals: Number,
  });

export const players = mongoose.model('players', playerSchema);
