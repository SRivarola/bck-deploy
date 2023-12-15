import bcrypt from 'bcryptjs';

export default class {
    constructor(obj) {
        this.first_name = obj.first_name;
        this.last_name = obj.last_name;
        this.mail = obj.mail;
        this.password = bcrypt.hashSync(obj.password, bcrypt.genSaltSync(10))
        this.role = obj.role;
        obj.photo && (this.photo = obj.photo)
        obj.age && (this.age = obj.age)
        obj.cart && (this.cart = obj.cart)
    }
}