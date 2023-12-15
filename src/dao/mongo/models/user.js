import {model, Schema, Types } from 'mongoose';

let collection = 'users';
let schema = new Schema({
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},
    mail:{ type: String, unique: true, index: true, requied: true},
    photo: { type: String, default: "avatar.png"},
    age: {type: Number},
    password: {type: String, requied: true},
    cart: { type: Types.ObjectId, ref: 'carts' },
    role: {type: String, enum: ['USER', 'ADMIN', 'PREMIUM'], default: 'USER'},
    resetToken: { type: String},
    resetTokenExpiresAt: { type: Date}
});

let User = model(collection, schema);
export default User;