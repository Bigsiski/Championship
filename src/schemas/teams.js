import mongoose, {Schema} from 'mongoose';

const teamSchema = new Schema(
  {
    //_id: mongoose.Schema.Types.ObjectId,

    Parents: [{
      _id: {type: mongoose.Schema.Types.ObjectId, ref: "championships"},
      ParentName: {type: String, default: "championships"}
    }],
    TeamName: {type: String},
    Points: {type: Number, default: 0, max: 90, min: 0},
    players: {type: Array, default: void 0} //[{_id: {type: mongoose.Schema.Types.ObjectId}}]
  });

export const teams = mongoose.model('teams', teamSchema);
