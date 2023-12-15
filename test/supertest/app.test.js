import "dotenv/config.js";
import { expect } from "chai";
import supertest from "supertest";
import dao from "../../src/dao/factory.js";
const { Product } = dao;

const requester = supertest(`http://localhost:${process.env.PORT}/api`);

describe("Testing Products with auth", () => {
  const model = new Product();
  let dataUser = {
    first_name: "SuperTestGonza",
    last_name: "SuperTestRodriguez",
    mail: "supertest@coder.com",
    photo: "avatar.png",
    age: 33,
    password: "Test1234",
    role: "USER",
  };
  const dataProduct = {
    title: "WhiskeyTest",
    description: "Whiskey for supertest",
    price: "100000",
    status: true,
    thumbnail: ["SuperTest.jpg"],
    code: "546546",
    stock: "45555",
  };
  const dataProductCart = {
    product_id: "64d025d04a8a67858fc659a2",
    quantity: 3,
  };
  const dataProductCartUpdate = {
    product_id: "64d025d04a8a67858fc659a2",
    quantity: 6,
  };
  const dataTicket = {
  code: "77cd6def-499a-4e5d-9620-f2e3f79982db",
  amount: 71680
  }
  const dataProductToUpdate = {
    title: "SuperChangeTest",
    description: "ChangeDescription",
    price: "200000",
    status: true,
    thumbnail: ["SuperTestChanged.jpg"],
    code: "546546",
    stock: "45555",
  };
  const dataRecoverMail = {
    mail: "testforgithub@hotmail.com"
  }
  let idProduct = null;
  let idUser = null;
  let idCart = null;
  let token = {};
  it("Must register an User", async () => {
    const responseCreate = await requester
      .post("/auth/register")
      .send(dataUser);
    const { _body, statusCode } = responseCreate;
    idUser = _body.response;
    expect(statusCode).to.be.equals(201);
  });
  it("Must log in an user", async () => {
    const response = await requester.post("/auth/login").send(dataUser);
    const { statusCode, headers } = response;
    token.key = headers["set-cookie"][0].split("=")[0];
    token.value = headers["set-cookie"][0].split("=")[1];
    expect(statusCode).to.be.equals(200);
  });
  it("Must Upgrade the user in Premium", async () => {
    let responsePremium = await requester
      .put("/auth/premium/" + idUser)
      .set("Cookie", [token.key + "=" + token.value]);
    const { _body, statusCode } = responsePremium;
    idUser = _body.response;
    expect(statusCode).to.be.equals(200);
  });
  it("Must create a product", async () => {
    const responseProduct = await requester
      .post("/products")
      .send(dataProduct)
      .set("Cookie", [token.key + "=" + token.value]);
    const { _body, statusCode } = responseProduct;
    idProduct = _body.response;
    expect(statusCode).to.be.equals(201);
  });
  it("Must respond with an array of products", async () => {
    const responseGetProd = await requester.get("/products");
    const { _body } = responseGetProd;
    expect(Array.isArray(_body.payload.docs)).to.be.equals(true);
  });
  it("Must update a product", async () => {
    const before = await model.readOne(idProduct);
    const response = await requester
      .put("/products/" + idProduct)
      .send(dataProductToUpdate)
      .set("Cookie", [token.key + "=" + token.value]);
    const after = await model.readOne(idProduct);
    expect(before === after).to.be.equals(false);
  });
  it("Must create a cart", async () => {
    const responseCart = await requester
      .post("/carts")
      .send(dataProductCart)
      .set("Cookie", [token.key + "=" + token.value]);
    const { statusCode } = responseCart;
    expect(statusCode).to.be.equals(201);
  });
  it("Must read a cart", async () => {
    const responseCart = await requester
      .get("/carts")
      .set("Cookie", [token.key + "=" + token.value]);
    const { _body, statusCode } = responseCart;
    idCart = _body.response;
    expect(statusCode).to.be.equals(200);
  });
  it("Must update a cart", async () => {
    let responseCart = await requester
      .get("/carts")
      .set("Cookie", [token.key + "=" + token.value]);
    const { _body } = responseCart;
    const cartArray = _body.response.docs;
    const firstCart = cartArray[0];
    idCart = firstCart._id.toString();
    let responseUpdateCar = await requester
      .put("/carts/" + idCart)
      .send(dataProductCartUpdate)
      .set("Cookie", [token.key + "=" + token.value]);
    const { statusCode } = responseUpdateCar;
    expect(statusCode).to.be.equals(200);
  });
  it("Must create a ticket", async () => {
    const responseTicket = await requester
      .post("/tickets")
      .send(dataTicket)
      .set("Cookie", [token.key + "=" + token.value]);
    const { statusCode } = responseTicket;
    expect(statusCode).to.be.equals(201);
  });
  it("Must read the ticket", async () => {
    const responseReadTicket = await requester
      .get("/tickets")
      .set("Cookie", [token.key + "=" + token.value]);
    const { _body, statusCode } = responseReadTicket;
    /* //Muestra el contenido del ticket
    const ticketContent = _body.response;
    console.log(ticketContent) */
    expect(statusCode).to.be.equals(200);
  });
  it("Must destroy the cart", async () => {
    const responseCart = await requester
      .delete("/carts/" + idCart)
      .set("Cookie", [token.key + "=" + token.value]);
    const { statusCode } = responseCart;
    expect(statusCode).to.be.equals(200);
  });
  it("Must destroy a product", async () => {
    const responseProduct = await requester
      .delete("/products/" + idProduct)
      .set("Cookie", [token.key + "=" + token.value]);
    const { statusCode } = responseProduct;
    expect(statusCode).to.be.equals(200);
  });
  it("Must send email to reset pass", async () => {
    const responseRecover = await requester
      .post("/auth/forgot-password")
      .send(dataRecoverMail);
    const { statusCode } = responseRecover;
    expect(statusCode).to.be.equals(200);
  });
  it("Must Upgrade the user Premium to Admin for destroy itself", async () => {
    let before = await requester
      .get("/auth/current/")
      .set("Cookie", [token.key + "=" + token.value]);
    const { _body } = before;
    idUser = _body.user._id;
    let responseAdmin = await requester
      .put("/auth/admin/" + idUser)
      .set("Cookie", [token.key + "=" + token.value]);
    const { statusCode } = responseAdmin;
    expect(statusCode).to.be.equals(200);
  });
  it("Must sign out an admin user", async () => {
    const response = await requester
      .post("/auth/signout")
      .set("Cookie", [token.key + "=" + token.value]);
    const { statusCode } = response;
    expect(statusCode).to.be.equals(200);
  });
  it("Must destroy the user created for SuperTest", async () => {
    let responseCreate = await requester
      .delete("/auth/" + idUser)
      .set("Cookie", [token.key + "=" + token.value]);
    const { _body, statusCode } = responseCreate;
    idUser = _body.response;
    expect(statusCode).to.be.equals(200);
  });
});
