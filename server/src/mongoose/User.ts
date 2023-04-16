import { getModelForClass, prop } from '@typegoose/typegoose';

export class User {
    @prop({ required: true })
    public spotifyKey!: string;

    @prop({ required: true })
    public name!: string;
}

export const UserModel = getModelForClass(User);
