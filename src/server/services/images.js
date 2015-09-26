
import picturesServer from '../../server/pictresServer.js';

console.log(" IMAGES_SERVICE --> init ");

const imagesService = {
    get: function() {
        return new Promise((resolve, reject) => {
        //        setTimeout(() => {
        //            console.log(" IMAGES_SERVICE --> Get images ");
        //
        //console.log('IMAGES_SERVICE: picturesServer = ', picturesServer)
        //
        //            let images = picturesServer.getImages();
        //            console.log('IMAGES_SERVICE: images = ', images)
        //            if(images){
        //                resolve({
        //                    images: {
        //                        img1: {
        //                            path: '/asdf/fees'
        //                        }
        //                    }
        //                });
        //            }else {
        //                reject('no images found in dir')
        //            }
        //        }, 1000)

                resolve( { images: {
                    img1: {
                        path: '/asdf/fees'
                    }
                }})

        });
    }
};

export default imagesService;
