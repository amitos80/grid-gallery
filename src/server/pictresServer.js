import EventEmitter from "./utils/EventUtil";
import PrimusUtil from "./utils/PrimusUtil";

import express from 'express';
import watch from 'watch';
import dir from 'node-dir';
import _ from 'lodash';

class PicturesServer {
    constructor() {

    }

    init(server){
        let self = this;
        this.images = [];

        let primus = new PrimusUtil(server);
        let primusServer = primus.getServer();
        primusServer.save('../primus.js');

        let IMAGES_PATH = __dirname + '/../../public/assets';
        let removeFromPath = __dirname + '/../../';

        let eventEmitter = EventEmitter.getEventEmitter();

        dir.files(IMAGES_PATH, function(err, files) {
            console.log('init_images: ', files);

            for(var i = 0; i < files.length; i++){
                let fileName = files[i].split('/')[files[i].split('/').length - 1];
                console.log('fileName = ', fileName);
                let filePath = '/assets/' + fileName;
                self.images.push({src: filePath});
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
                let fileName = f.split('/')[f.split('/').length - 1];
                let filePublicPath = '/assets/' + fileName;

                let found = _.find(self.images, (item) => {
                    return item == filePublicPath;
                })

                if(!found){
                    self.images.push({
                        src: filePublicPath
                    })

                    primusServer.write({
                        message:'add_new_image',
                        args:{
                            image: {
                                src: filePublicPath
                            }

                        }
                    });
                }

            });

            monitor.on("changed", function (f, curr, prev) {
                // Handle file changes

                console.log('changed: f = ', f);
            });

            monitor.on("removed", function (f, stat) {
                // Handle removed files
                console.log('removed: f = ', f);
                let fileName = f.split('/')[f.split('/').length - 1];
                let filePublicPath = '/assets/' + fileName;

                self.images = _.filter(self.images, (item) => {
                    return filePublicPath == item.src;
                });

                primusServer.write({
                    message:'removed_image',
                    args:{
                        image: f
                    }
                });
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
