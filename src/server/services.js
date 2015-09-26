import fruitService from './services/fruit';
import tasteService from './services/taste';
import userService from './services/users';
import imagesService from './services/images';

const services = {
    fruit: fruitService,
    taste: tasteService,
    users: userService,
    images: imagesService
};

export default services;
