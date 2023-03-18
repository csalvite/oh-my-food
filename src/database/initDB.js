const getDB = require('./getDB');

async function initDB() {
  let connection;

  try {
    connection = await getDB();

    await connection.query('CREATE DATABASE IF NOT EXISTS OhMyFood');

    await connection.query('USE OhMyFood');

    await connection.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('Eliminando tablas...');

    // Eliminamos las tablas primeramente
    await connection.query('DROP TABLE IF EXISTS UserOrderContainsPlate');
    await connection.query('DROP TABLE IF EXISTS UserOrder');
    await connection.query('DROP TABLE IF EXISTS Plate');
    await connection.query('DROP TABLE IF EXISTS Menu');
    await connection.query('DROP TABLE IF EXISTS Restaurant');
    await connection.query('DROP TABLE IF EXISTS Addresses');
    await connection.query('DROP TABLE IF EXISTS Users');

    console.log('¡Tablas eliminadas!');

    console.log('Creando tablas...');

    await connection.query(`
        create table if not exists Users(
            id INT UNSIGNED primary KEY AUTO_INCREMENT,
            name varchar(50) not null,
            lastname varchar(200) not null,
            email varchar(200) not null,
            password varchar(250) not null,
            active tinyint default 0,
            registrationCode varchar(100),
            phone varchar(15) not null,
            lat varchar(100),
            lon varchar(100)
        );
    `);

    await connection.query(`
        create table if not exists Addresses (
            id INT UNSIGNED primary KEY AUTO_INCREMENT,
            street varchar(200) not null,
            cp char(5),
            province varchar(20),
            country varchar(20),
            idUser int unsigned not null,
            foreign key (idUser) references Users(id)
        );
    `);

    await connection.query(`
        create table if not exists Restaurant (
            id int unsigned primary key auto_increment,
            name varchar(80) not null,
            deliveryType enum('reparto', 'recogida') default 'reparto',
            minimumOrder decimal(5, 2) default 9,
            shippingCosts decimal(5, 2) default 0,
            profileImage varchar(200),
            headerImage varchar(200),
            idOwner int unsigned not null,
            foreign key (idOwner) references Users(id)
        );
    `);

    await connection.query(`
        create table if not exists Menu (
            id int unsigned primary key auto_increment,
            title varchar(50) not null,
            idRestaurant int unsigned not null,
            foreign key (idRestaurant) references Restaurant(id)
        );
    `);

    await connection.query(`
        create table if not exists Plate (
            id int unsigned primary key auto_increment,
            title varchar(50) not null,
            price decimal(5, 2) not null,
            image varchar(200),
            description varchar(500),
            idMenu int unsigned not null,
            foreign key (idMenu) references Menu(id)
        );
    `);

    await connection.query(`
        create table if not exists UserOrder (
            id int unsigned primary key auto_increment,
            createdAt datetime,
            totalPrice decimal(6, 2),
            idUser int unsigned not null,
            foreign key (idUser) references Users(id),
            idRestaurant int unsigned not null,
            foreign key (idRestaurant) references Restaurant(id)
        );
    `);

    await connection.query(`
        create table if not exists UserOrderContainsPlate (
            id int unsigned primary key auto_increment,
            idUserOrder int unsigned not null,
            foreign key (idUserOrder) references UserOrder(id),
            idPlate int unsigned not null,
            foreign key (idPlate) references Plate(id)
        );
    `);

    console.log('¡Tablas creadas con éxito!');
  } catch (error) {
    console.error(error.message);
  } finally {
    if (connection) connection.release();
    process.exit();
  }
}

initDB();
