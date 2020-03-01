import mongoose, {Schema} from 'mongoose';

const playerSchema = new Schema(
  {
    //_id: mongoose.Schema.Types.ObjectId,

    Parents: [{
        _id: {type: mongoose.Schema.Types.ObjectId, ref: "teams"},
        ParentName: {type: String, default: "teams"}
      }],

    PlayerName: {type: String, unique : true},
    Goals:  {type: Number, default: 0, min: 0}
  });

export const players = mongoose.model('players', playerSchema);
