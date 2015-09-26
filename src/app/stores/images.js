'use strict'
import riot from 'riot';
import fetch from 'isomorphic-fetch';
import socketUtil from '../util/socket'
import fetchUtil from '../util/fetch';

import Store from './store';

export default class ImagesStore extends Store {

    constructor() {
        super();
        console.log("Init ImagesStore");
        this.images = [];

        this.on('get_images', async () => {
            try{

                let response = await fetchUtil.getJSON('http://localhost:3000/');
                this.images = response.images;

                 //let response = await fetch('http://localhost:3000/images');
                 //this.images = await response.json();

                //this.images  = await socketUtil.rpc('images::get', {});

                if(this.images){
                    console.log("IMAGES_STORE data: ",this.images);
                    this.trigger('images_fetched');
                }else{
                    console.log("IMAGES_STORE error");
                    throw new Error("error fetching images")
                }

            }catch(e){
                console.log('ERROR: get images failed: e = ', e);
            }

        });

    };

}


