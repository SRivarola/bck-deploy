import { Types } from "mongoose";
import Cart from "./models/carts.js";

export default class CartMongo {
  constructor() {}
  async create(data) {
    let cart = await Cart.create(data);
    return {
      message: "Product added.",
      response: { store_id: cart._id },
    };
  }

  async readByUser(query, data) {
    let all = await Cart.paginate(query, data);

    if (all.docs.length > 0) {
      return {
        message: "products found.",
        response: all,
      };
    } else {
      return null;
    }
  }

  async readAllByUser(id, state) {
    let all = await Cart.find({ user_id: id, state: state })
      .populate("user_id", "first_name last_name mail photo")
      .populate("product_id", "-createdAt -updatedAt -__v");
  
    if (all.length > 0) {
      return {
        message: "products found.",
        response: all,
      };
    } else {
      return null;
    }
  }

  async update(id, data) {
    let one = await Cart.findByIdAndUpdate(id, data, { new: true });

    if (one) {
      return {
        message: "product updated.",
        respone: one,
      };
    } else {
      return null;
    }
  }
  async delete(id) {
    let one = await Cart.findByIdAndDelete(id)
      .select("product_id user_id quantity state")
      .populate("user_id", "first_name last_name mail photo")
      .populate("product_id", "-createdAt -updatedAt -__v");
    if (one) {
      return {
        message: "product deleted.",
        response: one,
      };
    } else {
      return null;
    }
  }
  async deleteAll(user_id) {
    let all = await Cart.deleteMany({ user_id: user_id });
    if (all.deletedCount > 0) {
      return {
        message: "carts deleted.",
        response: all,
      };
    } else {
      return null;
    }
  }
  async getTotal(id) {
    let total = await Cart.aggregate([
      { $match: { user_id: new Types.ObjectId(id) } },
      { $match: { state: 'pending'} },
      { $set: { subtotal: { $multiply: ["$price", "$quantity"] } } },
      { $group: { _id: "$user_id", total: { $sum: "$subtotal" } } }
    ]);
    return {
      message: "Total obtanined.",
      response: total,
    };
  }
}