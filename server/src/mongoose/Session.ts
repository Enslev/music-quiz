import { Ref, Severity, getModelForClass, modelOptions, prop, DocumentType } from '@typegoose/typegoose';
import { Types } from 'mongoose';
import { User } from './User';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { Category } from './Quiz';

class Team {

    @prop()
    public name!: string;

    @prop()
    public pointsHistory!: number[];

    public get points() {
        return this.pointsHistory.reduce((acc, cur) => {
            return acc += cur;
        }, 0);
    }
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Session extends TimeStamps {

    @prop({ required: true })
    public title!: string;

    @prop({ required: true, ref: User })
    public user!: Ref<User>;

    @prop({ type: Category })
    public categories!: Category[];

    @prop({ default: [] })
    public revealed!: Types.ObjectId[];

    @prop({ type: Team })
    public teams!: Team[];

    @prop({ default: false })
    public active!: boolean;
}

export const SessionModel = getModelForClass(Session);
export type SessionDocument = DocumentType<Session>;
