import User from "./models/user.js";

export default class AuthMongo {
    constructor() {}
    async register(data) {
        let one = await User.create(data);
        return {
            message: 'User created successfully',
            response: one._id
        }
    }
    login() {
        return {
            message: 'User logged in successfully',
            response: true
        }
    }
    signout() {
        return {
            message: 'User signed out successfully',
            response: true
        }
    }
    async readOne(mail) {
        let one = await User.findOne({ mail: mail });
        if(one) {
            return one
        } else {
            return null
        }
    }
    async readById(id) {
        let one = await User.findById(id);
        if(one) {
            return one
        } else {
            return null
        }
    }
    async update(id, data) {
        let one = await User.findByIdAndUpdate(id, data, { new: true });
        if(one){
            return {
                message: "User updated!",
                response: one
            };
        } else {
            return null;
        };
    }

    async delete(id) {
        let one = await User.findByIdAndDelete(id);
        if(one) {
            return {
                message: "User removed",
                response: one
            };
        } else {
            return null;
        }
    }

    async saveResetToken(userId, token, expiresAt) {
        const user = await User.findByIdAndUpdate(
          userId,
          { $set: { resetToken: token, resetTokenExpiresAt: expiresAt } },
          { new: true }
        );
    
        if (user) {
          return {
            message: 'Reset token saved successfully',
            response: user.resetToken,
          };
        } else {
          return {
            message: 'User not found',
            response: null,
          };
        }
      }

    async findOne(query){
        let one = await User.findOne(query);
        return one;
    }
}