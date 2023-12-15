import fs from 'fs';

export default class ProductManager {
    constructor(path) {
        this.path = path;
    };
    create = async (data) => {
        try {
            const products = await this.read();
            //validacion de que existen todos los campos! 
            if(!data.title || !data.description || !data.price || !data.code || data.stock == undefined){
                return null;
            };
            //verificacion de que el campo code no exista en otro producto
            const codeRepetido = products.find(p => p.code == data.code);
            if(codeRepetido) {
                return null;
            };
            //si no existen las propiedades thumbnail & status les crea un valor por default
            if(!data.thumbnail) data.thumbnail = []
            if(!data.status) data.status = true
            //metodo para agregar automaticamente un id autoincremental!
            let id;
            if(products.length == 0) {
                id = 1
            } else {
                id = products[products.length -1].id + 1
            }

            data.id = id
            //pusheo mi producto al array y actualizo el archivo .json
            products.push({
                ...data
            });

            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

            return {
                message: "Product created",
                response: data.id
            }

        } catch (err) {
            console.log(err);
        };                   

    };
    read = async (query, data) => {
        try {
            //si existe mi archivo obtengo sus datos y los retorno, y sino retorno un array vacio. 
            if(fs.existsSync(this.path)) {
                const response = await fs.promises.readFile(this.path, 'utf-8');
                const parseResponse = JSON.parse(response);

                return {
                    message: "Product found",
                    response: parseResponse
                };
            } else {
                return null;
            };
        } catch (err) {
            console.log(err);
        };
    };

    readOne = async (id) => {
        try {
            let resultado = await this.getProducts();
            let product = resultado.find( p => p.id == id );

            //si encuentro un producto con el id ingresado retorno el producto sino un null
            if(product) {
                return {
                    message: "Product found", 
                    response: product
                };
            } else {
                return null;
            };
        } catch (err) {
            console.log(err);
        };
    };

    update = async(id, product) => {
        try {
            const products = await this.getProducts();
            const productToUpdate = products.find( p => p.id == id );
            //si no encontro este producto en nuestro .json retorno que no se encontro este producto
            if(!productToUpdate) {
                return null;
            };
            //busco el indice del producto para actualizar, actualizo ese producto, ya sea 1 campo o todos y actualizo el .json
            const indexOfProduct = products.findIndex( p => p.id == product.id );
            products[indexOfProduct] = {
                ...productToUpdate,
                ...product
            };
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));
            return {
                message: "Product updated",
                response: products[indexOfProduct]
            };
        } catch (err) {
            console.log(err);
        };

    };

    delete = async(id) => {
        try {
            const products = await this.getProducts();
            const indexProduct = products.findIndex( p => p.id === id );
            //validacion para ver si encontro el producto, de no ser asi retorna que no encontro el producto con ese id.
            if(indexProduct === -1) {
                return null;
            };
            
            const deletedProduct = products[indexProduct]
            //elimino del array el producto que se desea borrar, actualizo el .json y retorno el array sin ese producto 
            products.splice(indexProduct, 1);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, '\t'));

            return {
                message: "Product deleted",
                response: deletedProduct
            };

        } catch(err) {
            console.log(err);
        };
    };

};

const arrayProducts = [
    {
        title: "Jack Daniel's",
        description: "Whiskey Jack Daniel's Old Nº 7 750ml",
        price: 13635,
        status: true,
        thumbnail: ['url imagen'],
        code: "000001",
        stock: 50
    },
    {
        title: 'Jameson Black Barrel',
        description: 'Whiskey Jameson Black Barrel 700ml',
        price: 10675,
        status: true,
        thumbnail: ['url imagen'],
        code: "000002",
        stock: 50
    },
    {
        title: 'Chivas Regal',
        description: 'Whisky Chivas Regal Extra 13 Años, con estuche 750ml',
        price: 11136,
        status: true,
        thumbnail: ['url imagen'],
        code: "000003",
        stock: 50
    },
    {
        title: 'Johnnie Walker Black Label',
        description: 'Johnnie Walker Black Label 1L',
        price: 13955,
        status: true,
        thumbnail: ['url imagen'],
        code: "000004",
        stock: 50
    },
    {
        title: 'Buffalo Trace Bourbon',
        description: 'Whiskey Buffalo Trace Bourbon 750ml Kentucky American',
        price: 17100,
        status: true,
        thumbnail: ['url imagen'],
        code: "000005",
        stock: 50
    },
    {
        title: "Ballantine's",
        description: "Ballantine's Blended Scotch Finest 1L",
        price: 6213,
        status: true,
        thumbnail: ['url imagen'],
        code: "000006",
        stock: 50
    },
    {
        title: "Gran Old Parr",
        description: "Gran Old Parr De Luxe 750ml Scotch Blended",
        price: 9300,
        status: true,
        thumbnail: ['url imagen'],
        code: "000007",
        stock: 50
    },
    {
        title: "Buchanans Deluxe",
        description: "Buchanans Deluxe 12 años Scotch Blend 750ml",
        price: 11521,
        status: true,
        thumbnail: ['url imagen'],
        code: "000008",
        stock: 50
    },
    {
        title: "Scapa Skiren",
        description: "Scapa Skiren Single Malt Scotch 700ml",
        price: 20963,
        status: true,
        thumbnail: ['url imagen'],
        code: "000009",
        stock: 50
    },
    {
        title: "Jim Beam Black Full",
        description: "Jim Beam Black Full",
        price: 12126,
        status: true,
        thumbnail: ['url imagen'],
        code: "000010",
        stock: 50
    }
];

export const initializeProducts = async(manager) => {

    for (let item of arrayProducts) {
        await manager.addProduct(item)
    }

};