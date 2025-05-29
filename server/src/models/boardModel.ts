import {Schema, Types, model} from 'mongoose';


interface Board {
    name: string;
    lists: Types.ObjectId[];
    userId: Types.ObjectId;
}

const boardSchema = new Schema<Board>({
    name: {
        type: String,
        required: true,
    },
    lists: [{
        type: Schema.Types.ObjectId,
        ref: 'List', 
    }],
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true, 
});

const Board = model<Board>('Board', boardSchema);
export default Board;