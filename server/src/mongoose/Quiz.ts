import { Ref, getModelForClass, prop, DocumentType } from '@typegoose/typegoose';
import { User } from './User';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class Track {
    @prop()
    public trackUrl!: string;

    @prop()
    public title!: string;

    @prop()
    public artist!: string;

    @prop()
    public points!: number;

    @prop({ default: 0 })
    public startPosition!: number;

    @prop({ default: 0 })
    public length!: number;
}
export class Category {

    @prop()
    public title!: string;

    @prop({ type: () => [Track] })
    public tracks!: Track[];
}

export class Quiz extends TimeStamps {

    @prop({ required: true })
    public title!: string;

    @prop({ required: true, ref: User })
    public user!: Ref<User>;

    @prop({ type: () => [Category], required: true })
    public categories!: Category[];
}

export const QuizModel = getModelForClass(Quiz);
export type QuizDocument = DocumentType<Quiz>;

export type CategoryDocument = QuizDocument['categories'][number];
export type TrackDocument = QuizDocument['categories'][number]['tracks'][number];
