import { Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { CreateSessionSchema, CreateTeamSchema, GetSessionSchema, PutTeamSchema } from './schema';
import { Types } from 'mongoose';
import { QuizModel } from '../../../mongoose/Quiz';
import { SessionDocument, SessionModel } from '../../../mongoose/Session';
import { makeCode } from './utils';

export const createSession = async (req: ValidatedRequest<CreateSessionSchema>, res: Response) => {

    if (!Types.ObjectId.isValid(req.body.quizId)) {
        res.status(400).send({
            message: 'Invalid id',
        });
        return;
    }

    const quiz = await QuizModel.findById(req.body.quizId);

    if (!quiz) {
        res.status(404).send({
            message: 'Quiz not found',
        });
        return;
    }

    // We allow 10 attempts at creating a unique code, which should be more than enough
    let code = '';
    let codeAttempts = 0;
    let sessionByCode: SessionDocument | null = null;
    do {
        code = makeCode(5);
        sessionByCode = await SessionModel.findOne({ code });
        codeAttempts++;
    } while (sessionByCode != null && codeAttempts <= 10);

    if (sessionByCode != null) {
        res.status(500).send({
            message: 'Something went wrong while generating unique code',
        });
        return;
    }


    const sessionDoc = await SessionModel.create({
        _id: new Types.ObjectId(),
        title: quiz.title,
        categories: quiz.categories,
        user: req.user._id,
        code: code,
    });

    res.status(200).send(sessionDoc);
};

export const getSessions = async (req: ValidatedRequest<GetSessionSchema>, res: Response) => {
    const sessionDoc = await SessionModel.findOne({ code: req.params.sessionCode });

    if (!sessionDoc) {
        res.status(404).send({
            message: 'Session not Found',
        });
        return;
    }

    res.status(200).send(sessionDoc);
};

export const createTeam = async (req: ValidatedRequest<CreateTeamSchema>, res: Response) => {
    const sessionDoc = await SessionModel.findOne({ _id: req.params.sessionId });

    if (!sessionDoc) {
        res.status(404).send({
            message: 'Session not Found',
        });
        return;
    }

    sessionDoc.teams.push({
        _id: new Types.ObjectId(),
        name: req.body.name,
    });

    const savedSession = await sessionDoc.save();
    res.status(200).json(savedSession);
};

export const putTeam = async (req: ValidatedRequest<PutTeamSchema>, res: Response) => {

    if (req.body._id != req.params.teamId) {
        res.status(400).send({
            message: 'Team ID mismatch',
        });
        return;
    }

    const sessionDoc = await SessionModel.findOne({ _id: req.params.sessionId });

    if (!sessionDoc) {
        res.status(404).send({
            message: 'Session not Found',
        });
        return;
    }

    const teamFromDb = sessionDoc.teams.find((team) =>
        team._id.equals(req.params.teamId),
    );

    if (!teamFromDb) {
        res.status(404).send({
            message: 'Team not Found',
        });
        return;
    }

    const teamIdx = sessionDoc.teams.indexOf(teamFromDb);
    sessionDoc.teams[teamIdx] = {
        _id: new Types.ObjectId(req.body._id),
        name: req.body.name,
        pointsHistory: req.body.pointsHistory,
    };

    const savedSession = await sessionDoc.save();
    res.status(200).json(savedSession);
};

export const deleteTeam = async (req: ValidatedRequest<PutTeamSchema>, res: Response) => {
    const sessionDoc = await SessionModel.findOne({ _id: req.params.sessionId });

    if (!sessionDoc) {
        res.status(404).send({
            message: 'Session not Found',
        });
        return;
    }

    const teamFromDb = sessionDoc.teams.find((team) =>
        team._id.equals(req.params.teamId),
    );

    if (!teamFromDb) {
        res.status(404).send({
            message: 'Team not Found',
        });
        return;
    }

    const teamIdx = sessionDoc.teams.indexOf(teamFromDb);
    sessionDoc.teams.splice(teamIdx, 1);

    const savedSession = await sessionDoc.save();
    res.status(200).json(savedSession);
};
