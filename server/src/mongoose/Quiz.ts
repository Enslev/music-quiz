import { Ref, Severity, getModelForClass, modelOptions, prop, DocumentType } from '@typegoose/typegoose';
import { User } from './User';

class Track {
    @prop({ required: true })
    public trackUrl!: string;

    @prop({ required: true })
    public title!: string;

    @prop({ required: true })
    public artist!: string;

    @prop({ required: true })
    public points!: number;
}

class Category {

    @prop({ required: true })
    public title!: string;

    @prop({ required: true, type: Track })
    public tracks!: Track[];
}

@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Quiz {

    @prop({ required: true })
    public title!: string;

    @prop({ required: true, ref: User })
    public user!: Ref<User>;

    @prop({ required: true, type: Category })
    public categories!: Category[];
}

export const QuizModel = getModelForClass(Quiz);
export type QuizDocument = DocumentType<Quiz>;
