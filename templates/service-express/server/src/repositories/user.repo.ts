import { profiler } from 'nstarter-metrics';
import { MongodbRepo, repoProvider } from 'nstarter-mongodb';
import { userModel } from '../models';
import type { IUserModel } from '../models';

class UserRepo extends MongodbRepo {
    public async createOne(user: IUserModel) {
        const docs = await userModel.create([user], {
            session: this._session
        });
        return docs[0].toObject<IUserModel>();
    }

    @profiler()
    public async findOneByUsername(username: string): Promise<IUserModel | null> {
        return await userModel
            .findOne({ username })
            .setOptions({
                session: this._session,
            })
            .lean(true);
    }
}

export const userRepo = repoProvider<UserRepo>(UserRepo);
