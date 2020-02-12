import mongoose, {Schema} from 'mongoose';

const bombSchema = new Schema(
    {
        BombId: Number,
        ChampId: String
    });

export const bombardiers = mongoose.model('bombardiers', bombSchema);
