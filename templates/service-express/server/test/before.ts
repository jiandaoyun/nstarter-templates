//#module mongodb
import { mongodb, mongodbComponent } from '../src/components';
//#endmodule mongodb

describe('connectDB', () => {
    //#module mongodb
    before((done) => {
        mongodbComponent.init().then();
        mongodb.once('open', () => {
            console.log('mongodb connected');
            done();
        });
    });
    //#endmodule mongodb
    it('check', (done) => {
        done()
    });
});
