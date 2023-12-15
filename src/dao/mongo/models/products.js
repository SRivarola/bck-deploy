import { model, Schema, Types } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

let collection = 'products'

let schema = new Schema ({
    title: { type: String, requiered: true, index: true},
    description: { type: String, requiered: true},
    price: { type: Number, requiered: true},
    thumbnail: { type: Array, default: []},
    code: { type: String, requiered: true, unique: true},
    status: { type: Boolean, default: true},
    stock: { type: Number, requiered: true},
    owner: { type: Types.ObjectId, ref: 'users' }
})

schema.plugin(mongoosePaginate);
const Product = model(collection, schema);

export default Product;