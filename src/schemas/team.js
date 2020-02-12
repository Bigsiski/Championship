import mongoose, {Schema} from 'mongoose';

const teamSchema = new Schema(
  {
    TeamId: Number,
      ChampId: Number,
      TeamName: String,
      Points: Number,
      TournamId: Number
  });

export const team = mongoose.model('team', teamSchema);
