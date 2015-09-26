import EventEmitter from "./utils/EventUtil";
import PrimusUtil from "./utils/PrimusUtil";

import express from 'express';
import watch from 'watch';
import dir from 'node-dir';

class PicturesServer {
    constructor() {

    }

    init(server){
        let self = this;

        let primus = new PrimusUtil(server);
        let primusServer = primus.getServer();
        primusServer.save('../primus.js');

        let IMAGES_PATH = __dirname + '/../../public/images';
        let removeFromPath = __dirname + '/../../';

        this.images = [];
        let eventEmitter = EventEmitter.getEventEmitter();

        dir.files(IMAGES_PATH, function(err, files) {
            console.log('init_images: ', files);

            for(var i = 0; i < files.length; i++){
                let path = files[i].substring(removeFromPath.length + 1, files[i].length)
                console.log('path = ', path)
                self.images.push({src: '/public/images/' + path});
            }

            primusServer.write({
                message:'init_images',
                args:{
                    images: self.images
                }
            });
        });

        watch.createMonitor(IMAGES_PATH, function (monitor) {
            //monitor.files['/home/mikeal/.zshrc'] // Stat object for my zshrc.

            monitor.on("created", function (f, stat) {
                // Handle new files

                console.log('add_new_image: f = ', f);
                let path = f.substring(removeFromPath.length + 1, f.length);
                let filePublicPath = '/public/images/' + path;

                primusServer.write({
                    message:'add_new_image',
                    args:{
                        image: {
                            src: filePublicPath
                        }

                    }
                });
            });

            monitor.on("changed", function (f, curr, prev) {
                // Handle file changes
                console.log('changed: f = ', f)
            });

            monitor.on("removed", function (f, stat) {
                // Handle removed files
                console.log('removed: f = ', f)

            });

        });

    }


    getImages(){
        return this.images;
    }

};

// Singleton
let instance = new PicturesServer();
export default instance;
