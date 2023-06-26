import { Ref, getModelForClass, prop, DocumentType } from '@typegoose/typegoose';
import { User } from './User';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

class Track {
    @prop({ required: true })
    public trackUrl!: string;

    @prop({ required: true })
    public title!: string;

    @prop({ required: true })
    public artist!: string;

    @prop({ required: true })
    public points!: number;

    @prop({ required: true, default: 0 })
    public startPosition!: number;
}

export class Category {

    @prop({ required: true })
    public title!: string;

    @prop({ type: () => [Track], required: true })
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
