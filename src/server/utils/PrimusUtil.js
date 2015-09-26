import Primus from 'primus';

export default class PrimusUtil {
    constructor(httpServer) {
        console.log('PrimusUtil init...');

        this.primusServer = new Primus(httpServer, {
            transformer: 'websockets'
        });

        this.primusServer.on('connection', function (spark) {
            console.log('PRIMUS SERVER ON CONNECTION');

            spark.on('data', function (data) {
                console.log('PRIMUS SERVER RECEIVED: ', data);
            });

        });


        this.primusServer.on('disconnection', function (spark) {
            console.log('PRIMUS SERVER ON DISCONNECTION ');

        });
    }

    getServer() {
        return this.primusServer;
    }
}

