import mongoose, {Schema} from 'mongoose';

const tourSchema = new Schema(
    {
        TournamId: Number,
        ChampId:  Number
    });

export const tournament = mongoose.model('tournament', tourSchema);
