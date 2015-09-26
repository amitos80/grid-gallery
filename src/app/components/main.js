import riot from 'riot';
import componentFactory from '../component-factory';
import miscUtil from '../util/misc';
import accountStatus from './account-status';
import mall from './mall';
import login from './login';

componentFactory.createComponent('main', `
<div class="ui equal width grid">

    <div each="{image in images}"  class="column">
    <img riot-src="{image.src}">
    </div>

    </div>


    <style>
    main {
    display: block;
    background-color: #2f2f2f;
}
</style>

`,
function(opts) {
    this.images = [];

    this.on('mount', () => {
        console.log("Main mounted");
});

this.dispatcher.on('main_state_updated', () => {
    this.update();
});

this.on('mount', ()=>{

    if(miscUtil.isBrowser()){
    this.primus = Primus.connect('http://localhost:3000', {
        reconnect: {
            strategy: [ 'online', 'timeout', 'diScoNNect' ],
            maxDelay: 99999999, // Number: The max delay for a reconnect retry.
            minDelay: 500, // Number: The minimum delay before we reconnect.
            retries: 10 // Number: How many times should we attempt to reconnect.
        }
    });

    this.primus.on('data', (data, args) => {
        console.log('MAIN: event = ', data, ' args = ', args);

    if(data.message == 'init_images'){
        this.images = args.images;
    }else if(data.message == 'add_new_image'){
        this.images.push(args.image);
    }
});


this.primus.on('error', function error(err) {
    console.error('PRIMUS: something horrible has happened', err, err.message);
});


this.on('images_fetched', (images) => {
    console.log('images_fetched = ', images);
})

setTimeout(()=>{
    this.dispatcher.trigger('get_images');
}, 2500)


}
})
});
