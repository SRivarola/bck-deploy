import { model, Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = 'carts';

const schema = new Schema(
    {
        product_id: { type: Types.ObjectId, ref: 'products', required: true },
        user_id: { type: Types.ObjectId, ref: 'users', required: true, index: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        state: { type: String, enum: ['pending', 'paid', 'delivered'], default: 'pending' }
    }, 
    { timestamps: true }
);

schema.plugin(mongoosePaginate);
const Cart = model(collection, schema);

export default Cart;