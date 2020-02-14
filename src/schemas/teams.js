import mongoose, {Schema} from 'mongoose';

const teamSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
      Parent: {
          _id: {type: mongoose.Schema.Types.ObjectId, ref: "championships"},
          ParentName: {type: String, default: "championships"}
      },
    ChampId: {type: Number},
    TeamName: String,
    Points: Number,
  });

export const teams = mongoose.model('teams', teamSchema);
