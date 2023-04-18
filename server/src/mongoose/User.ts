import { getModelForClass, prop, DocumentType } from '@typegoose/typegoose';

export class User {
    @prop({ required: true })
    public spotifyKey!: string;

    @prop({ required: true })
    public name!: string;

    @prop({ required: true })
    public email!: string;

    @prop({ required: true })
    public spotifyUri!: string;

    @prop({ required: true })
    public country!: string;
}

export const UserModel = getModelForClass(User);
export type UserDocument = DocumentType<User>;
