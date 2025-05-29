import {Schema, Types, model} from 'mongoose';

interface IList {
    name: string;
    tasks: Types.ObjectId[]; 
    boardId?: Types.ObjectId; 
}


const listSchema = new Schema<IList>({
    name: {
        type: String,
        required: true,
    },
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: 'Task', 
    }],
    boardId: {
        type: Schema.Types.ObjectId,
        ref: 'Board', 
        required: false, 
    },
}, {
    timestamps: true, 
});

const List = model<IList>('List', listSchema);
export default List;