import transporter from "../config/transporter.js";
import env from '../config/env.js';
import __dirname  from '../utils.js';

const { G_MAIL } = env;

export default async (req, res, next) => {
    try {
        let to = req.body.to;
        let subject = "Whiskey 's Shop";
        let html = (product) => `
        <h1>Gracias por adquirir nuestros productos</h1>
        <p>Whiskey shop bla bla bla</p>
        ${product.name} - ${product.price}
        `;
        await transporter.sendMail({
            from: G_MAIL,
            to,
            subject,
            html: html({ name: 'Chivas', price: '13000'}),
            /*attachments: [
                {
                  filename: "ChivasRegal.jpg",
                  path: `${__dirname}/public/images/ChivasRegal.jpg`,
                },
              ],*/
            })
        let response = { response: 'sent' };
        return res.status(200).json(response)
    } catch (error) {
        next(error);
    }
}