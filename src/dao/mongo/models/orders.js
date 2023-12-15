import { model, Schema } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

let collection = "orders";
let schema = new Schema({
    code: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    purchaser: { type: String, required: true },
},
{
    timestamps: true
})

schema.plugin(paginate);
let Order = model(collection, schema);
export default Order;