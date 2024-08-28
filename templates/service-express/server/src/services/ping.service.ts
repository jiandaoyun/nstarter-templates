import type { PongService } from './pong.service';
import { injectService, service } from 'nstarter-core';
import { foo } from 'ns-module';

@service()
export class PingService {
    @injectService()
    private pongService: PongService;

    public ping() {
        console.log('ping');
    }

    public pong () {
        this.pongService.pong();
    }

    public moduleFoo() {
        console.log(foo());
    }
}
