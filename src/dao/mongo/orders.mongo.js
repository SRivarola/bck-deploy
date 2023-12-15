import Order from './models/orders.js';

export default class OrderMongo {
    constructor() {}
    
    async create(data) {
        let one = await Order.create(data);
        return {
            message: "Order created succesfully.",
            response: one._id
        }
    }

    async readOne(id) {
        let one = await Order.findById(id)
        return one ? {
            message: "Order found.",
            response: one
        } : null;
    }

    async readAll(page) {
        let all = await Order.paginate({}, { page: page, limit: 10 });
        return all.docs.length > 0 ? {
            message: "orders found.",
            response: all
        } : null;
    }
    
    async readByUser(purchaser) {
        let all = await Order.find({ purchaser })
        return all.length > 0 ? {
            message: "orders found.",
            response: all
        } : null;
    }

    /*async readAllTickets(id) {
        let user = new Types.ObjectId(id)
        let all = await Order.find({ user }, 
            "-createdAt -updatedAt -__v")
            .populate('user_id', 'mail');
            console.log(user)
            console.log(all)
        if (all.length > 0 ) {
            let ticket = await Order.aggregate([
                { $match: { user } },
                { $set: { subtotal: { $multiply: ['$price', '$quantity'] } } },
                { $group: { _id: '$user_id', total: { $sum: '$subtotal' } } },
                {
                    $project: {
                        _id: 0,
                        user_id: "$_id",
                        total: '$total',
                        date: new Date(),
                    },
                },
            ]);
            return {
                message: 'orders read.',
                response: all, ticket
            }
        } else {
            return null;
        }
    }*/
}