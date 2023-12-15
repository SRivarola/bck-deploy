import fs from 'fs';
import __dirname from '../../../utils.js';

class CartsManager {

    constructor(path) {
        this.path = path
    }
    
    addNewCart = async() => {
        try {
            if(fs.existsSync(this.path)) {
                const data = await fs.promises.readFile(this.path, 'utf-8');
                const carts = JSON.parse(data);

                const id = carts[carts.length -1].id + 1;
                const cart = {id: id, products: []}
                carts.push(cart);

                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));

                return cart

            } else {
                const cart = {id: 1, products: []};
                const carts = [cart];

                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
                
                return cart
            }
        } catch(err) {
            console.log(err);
        }
    }

    getCart = async (id) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const carts = JSON.parse(data);
            const cartIndex = carts.findIndex( c => c.id === id);

            if(cartIndex === -1) return null;

            return carts[cartIndex].products;
            
        } catch(err) {
            console.log(err)
        }
    }

    addProduct = async (cid, pid) => {
        try {
            const data = await fs.promises.readFile(this.path, 'utf-8');
            const carts = JSON.parse(data);
            const cartIndex = carts.findIndex( c => c.id === cid)

            if(cartIndex === -1) return null

            const cart = carts[cartIndex].products

            let sameProduct = cart.find( p => p.product === pid )
            if(!sameProduct) {
                cart.push({product: pid, quantity: 1})
                
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));

                return cart

            } else {
                const cartIndex = cart.findIndex( p => p.product === pid);
                cart[cartIndex].quantity = cart[cartIndex].quantity + 1;
            
                await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));

                return cart

            }

        } catch(err) {
            console.log(err)
        }
    }

}

export default CartsManager