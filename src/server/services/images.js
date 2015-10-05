
import picturesServer from '../../server/pictresServer.js';

console.log(" IMAGES_SERVICE --> init ");

const imagesService = {
    find: function(params) {
        return new Promise((resolve, reject) => {
               setTimeout(() => {
                   console.log(" IMAGES_SERVICE --> Get images ");

                   let images = picturesServer.getImages();
                   console.log('IMAGES_SERVICE: images = ', images);
                   if(images){
                       resolve({
                           images: images
                       });
                   }else {
                       reject('no images found in dir');
                   }
               }, 300)

        });
    }
};

export default imagesService;
