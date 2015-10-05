import riot from 'riot';
import componentFactory from '../component-factory';
import miscUtil from '../util/misc';
import accountStatus from './account-status';
import mall from './mall';
import login from './login';

componentFactory.createComponent('main', `
<div class="main">

    <div if="{images.length == 0}"  class="no-images-container">
        <div class="no-images-text" > No Images </div>
    </div>

    <div class="ui five column grid" style="display: none;">
        <div each="{image in images}"  class="column image-square">
            <img class="ui image" riot-src="{image.src}" >
        </div>
    <div>

</div>

<style>
    main {
        background: #ffffff;

        .ui.image {
            cursor: hand;
        }

        div.no-images-text {
            display: block;
            margin: auto;
            font-weight: bold;
            font-size: 36px;
        }

        div.no-images-container {
            margin-top: 40px;
            width: 100%;
            display: block;
        }

    }

    .main {


        .image-square {

        }


    }


</style>
`,
function(opts) {
    this.images = [];

    this.dispatcher.on('main_state_updated', () => {
        this.update();
    });

    this.on('mount', ()=>{

        if(miscUtil.isBrowser()){

            this.showGrid = () => {
                setTimeout(() => {
                    $('.ui.grid').transition(
                        {animation  : 'scale',
                            duration   : '0.4s'}
                    );
                }, 300)

            }

            this.hideGrid = () => {
                $('.ui.grid').transition('slide right', 400, function() {
                    $('.ui.grid').css('display', 'none');
                })
            }

            this.primus = Primus.connect('http://localhost:3000', {
                reconnect: {
                    strategy: [ 'online', 'timeout', 'diScoNNect' ],
                    maxDelay: 99999999, // Number: The max delay for a reconnect retry.
                    minDelay: 500, // Number: The minimum delay before we reconnect.
                    retries: 10 // Number: How many times should we attempt to reconnect.
                }
            });

            this.primus.on('data', (data, args) => {
                console.log('MAIN: event = ', data);//, ' data.args.image = ', data.args.image);

                if(data.message == 'removed_image'){
                    this.dispatcher.trigger('get_images');
                }else if(data.message == 'add_new_image'){
                    this.images.push(data.args.image);
                }
                this.update();
                //this.showGrid();
            });


            this.primus.on('error', function error(err) {
                console.error('PRIMUS: something horrible has happened', err, err.message);
            });

            this.dispatcher.on('images_fetched', (data) => {
                console.log('main: images_fetched = ', data.images);
                this.images = data.images;
                this.update();

                this.showGrid();
            });

            setTimeout(()=>{
                this.dispatcher.trigger('get_images');
            }, 2500);
    }
})
});
