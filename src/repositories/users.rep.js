import UserDto from '../dto/register.dto.js'
import dao from '../dao/factory.js';

const { User } = dao;

export default class AuthRepository {
    constructor() {
        this.model = new User();
    }
    register (data) {
        let dataDto = new UserDto(data) 
        let response = this.model.register(dataDto)
        return response
    };
    login = () => this.model.login();
    signout = () => this.model.signout();
    readOne = (mail) => this.model.readOne(mail);
    readById = (id) => this.model.readById(id);
    update = (id, data) => this.model.update(id, data);
    delete = (id) => this.model.delete(id);
    saveResetToken = (user_id, token, expiresIn) => this.model.saveResetToken(user_id, token, expiresIn);
    findOne = (query) => this.model.findOne(query);
}