-- Para ejecutar en myPhpAdmin

CREATE DATABASE desafiochat;

USE desafiochat;

CREATE TABLE mensajes(id int PRIMARY KEY AUTO_INCREMENT, mensaje text, email_usuario text, fecha timestamp);

CREATE TABLE productos(id int PRIMARY KEY AUTO_INCREMENT, title float, price text, thumbnail text);

INSERT INTO productos (title, price, thumbnail) VALUES 
    ("PRODUCTO A", 123.45, "http://openclipart.org/image/800px/svg_to_png/87397/Cyrillic_A.png"),
    ("PRODUCTO B", 200, "https://w7.pngwing.com/pngs/204/874/png-transparent-letter-case-b-letter-b-miscellaneous-text-rectangle-thumbnail.png"),
    ("PRODUCTO C", 250, "https://media.istockphoto.com/vectors/vector-colorful-gem-stones-font-letter-c-vector-id991983766"),
    ("PRODUCTO D", 1000, "https://us.123rf.com/450wm/inkdrop/inkdrop1910/inkdrop191006642/132480573-letra-d-distorsionada-fuente-de-texto-con-efecto-de-falla-de-ne%C3%B3n-render-3d.jpg?ver=6"),
    ("PRODUCTO X", 1550, "https://justmockup.com/wp-content/uploads/edd/2019/08/box-packaging-mockup-free-download.jpg")
