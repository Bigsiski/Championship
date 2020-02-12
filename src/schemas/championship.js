import mongoose, {Schema} from 'mongoose';

const champSchema = new Schema(
    {
        ChampId: Number,
        ChampName:  String,
        Country:  String,
        Popularity:  Number,
    });

export const championship = mongoose.model('championship', champSchema);
