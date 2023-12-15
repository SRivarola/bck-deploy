# SEGUNDA PRE-ENTREGA
 
Para levantar el servidor ejecutar npm run dev o npm start. 
El servidor se levanta en el puerto 8080. 

Para levantar la parte del cliente, entrar a la carpeta client y ejecutar npm run dev.
El cliente se levanta en el puerto 5173
 
  
Endpoints para las vistas y api: 

## Product Router 

ENDPOINT DE LA API
create product -> localhost:8080/api/products
para leer todos los productos -> localhost:8080/api/products 
leer 1 product -> localhost:8080/api/products/:pid  
update product -> localhost:8080/api/products/:pid  
delete product -> localhost:8080/api/products/:pid  

ENDPOINS DE LAS VISTAS (CLIENTE)
todos los productos o busqueda -> localhost:5173/products
crear producto -> localhost:5173/new_product
detalle del producto -> localhost:5173/products/:pid (se puede acceder clickeando en cualquier producto desde la vista de productos)  

 
## Cart Router 

ENDPOINT DE LA API
create cart -> localhost:8080/api/carts  
leer 1 cart -> localhost:8080/api/carts/:cid 
leer y popular 1 cart -> localhost:8080/api/carts/bills/:cid  
update cart -> localhost:8080/api/carts/:cid/product/:pid  
delete product from cart -> localhost:8080/api/carts/:cid/product/:pid
delete cart -> localhost:8080/api/carts/:cid 

ENDPOINS DE LAS VISTAS (CLIENTE)
cart -> localhost:5173/cart

## User Router

ENDPOINT DE LA API
create user -> localhost:8080/api/auth/register
login user -> localhost:8080/api/auth/login
signout user -> localhost:8080/api/auth/signout
check session -> localhost:8080/api/auth/check-session

ENDPOINS DE LAS VISTAS (CLIENTE)
login -> localhost:5173/login
signout -> para signout esta visible el icono en la barra de navegacion

## Real Time Products

localhost:8080/api/realtimeproducts