import {Schema,Types,model} from "mongoose";

interface IUser {
    username: string;
    email: string;
    password: string;
    boards: Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    boards: [{
        type: Schema.Types.ObjectId,
        ref: "Board", 
    }],

    }, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
})

const User = model<IUser>("User", userSchema);
export default User;
