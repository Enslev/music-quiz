import { Ref, getModelForClass, prop, DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User } from './User';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Category } from './Quiz';

class Team {
    @prop({ required: true, type: Types.ObjectId })
    public _id!: Types.ObjectId;

    @prop({ required: true })
    public name!: string;

    @prop({ type: () => [Number], default: [] })
    public pointsHistory?: number[];
}

export class Session extends TimeStamps {
    @prop({ required: true, type: Types.ObjectId })
    public _id!: Types.ObjectId;

    @prop({ required: true })
    public title!: string;

    @prop({ required: true, ref: User })
    public user!: Ref<User>;

    @prop({ type: () => [Category], required: true })
    public categories!: Category[];

    @prop({ type: () => [Types.ObjectId], required: true, default: [] })
    public revealed!: Types.ObjectId[];

    @prop({ type: () => [Team], required: true, default: [] })
    public teams!: Team[];

    @prop({ required: true, default: false })
    public active!: boolean;

    @prop({ required: true, unique: true })
    public code!: string;
}

export const SessionModel = getModelForClass(Session);
export type SessionDocument = DocumentType<Session>;

export type TeamDocument = SessionDocument['teams'][number];
