import { faker } from "@faker-js/faker";
import ProductsRepository from "../../repositories/products.rep.js";

const product = () => {
    let title = faker.commerce.productName();
    let description = faker.commerce.productDescription();
    let price = faker.commerce.price({ min: 1000, max: 10000 });
    let thumbnail = faker.image.urlLoremFlickr({ category: "food" })
    let code = faker.string.uuid();
    let status = true;
    let stock = faker.number.int({ max: 6000 });
    return { title, description, price, thumbnail, code, status, stock };
};

const fakeData = async () => {
    try {
        let repository = new ProductsRepository();
        for (let i = 0; i < 500; i++ ){
            let fakeProduct = product();
            await repository.create(fakeProduct);
        }
    } catch (error) {
       console.log(error);
    }
}

fakeData();