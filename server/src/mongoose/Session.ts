import { Ref, getModelForClass, prop, DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User } from './User';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Category } from './Quiz';

class Team {
    @prop({ type: Types.ObjectId })
    public _id!: Types.ObjectId;

    @prop({ required: true })
    public name!: string;

    @prop({ type: () => [Number], default: [] })
    public pointsHistory?: number[];
}

class Claimed {
    @prop({ type: Types.ObjectId })
    public _id!: Types.ObjectId;

    @prop({ required: true, type: Types.ObjectId })
    public trackId!: Types.ObjectId;

    @prop({ required: true, type: Types.ObjectId })
    public teamId!: Types.ObjectId | null;

    @prop({ required: true, default: false })
    public artistGuessed!: boolean;
}

export class Session extends TimeStamps {
    @prop({ type: Types.ObjectId })
    public _id!: Types.ObjectId;

    @prop({ required: true })
    public title!: string;

    @prop({ required: true, ref: User })
    public user!: Ref<User>;

    @prop({ type: () => [Category], required: true })
    public categories!: Category[];

    @prop({ type: () => [Claimed], required: true, default: [] })
    public claimed!: Claimed[];

    @prop({ type: () => [Team], required: true, default: [] })
    public teams!: Team[];

    @prop({ required: true, default: false })
    public active!: boolean;

    @prop({ required: true, unique: true })
    public code!: string;
}

export const SessionModel = getModelForClass(Session);
export const ClaimedModel = getModelForClass(Claimed);

export type SessionDocument = DocumentType<Session>;
export type ClaimedDocument = DocumentType<Claimed>;

export type TeamDocument = SessionDocument['teams'][number];
