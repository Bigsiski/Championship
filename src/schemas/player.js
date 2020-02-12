import mongoose, {Schema} from 'mongoose';

const playerSchema = new Schema(
  {
    PlayerId: Number,
    TeamId: Number,
    BombId: Number,
    PlayerName: String,
    Goals: Number,
  });

export const player = mongoose.model('player', playerSchema);
