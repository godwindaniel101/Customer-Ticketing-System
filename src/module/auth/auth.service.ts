import { DocumentDefinition, FilterQuery, UpdateQuery, LeanDocument } from 'mongoose';
import { sign, decode } from '../../utils/jwt.utils';
import User, { UserDocument } from './auth.model';
import Session, { SessionDocument } from './session.model';
import { get, omit } from 'lodash';
import config from 'config';

export async function registerHandler(input: DocumentDefinition<UserDocument>) {
    try {
        const userData = {
            name: input.name,
            email: input.email,
            password: input.password
        };
        return await User.create(userData);
    } catch (error) {
        throw new Error(error);
    }
}

export async function validatePassword({ email, password }: { email: UserDocument['email']; password: string }) {
    const user = await User.findOne({ email });
    //check if email exist
    if (!user) return false;
    const isValid = await user.comparePassword(password);

    // compare password
    if (!isValid) return false;

    //return user
    return omit(user.toJSON(), "password");
}

export async function validateEmail({ email }: { email: UserDocument['email'] }) {
    const user = await User.findOne({ email });

    //check if email exist
    if (!user) return false;

    //return user
    return user;
}
export async function resetPasswordHandler(resetToken: string, update: UpdateQuery<UserDocument>) {
    const { decoded, expired } = decode(resetToken);

    //check for expired token
    if (expired) return false;

    //check for irregular token
    if (!decoded || !get(decoded, '_id')) return false;

    const session = await Session.findById(get(decoded, '_id'));

    // Make sure the session is still valid
    if (!session || !session?.valid) return false;

    const user = await User.findOneAndUpdate({ _id: session.user }, update);

    //check for data
    if (!user) return false;

    //return user
    return user;
}
export async function findAndUpdate(query: FilterQuery<UserDocument>, update: UpdateQuery<UserDocument>) {
    const user = await User.findOneAndUpdate(query, update);

    //check for data
    if (!user) return false;

    //return user
    return user;
}

export async function logoutHandler(query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) {
    //delete all user section
    return Session.updateOne(query, update);
}

export function createAccessToken({
    user,
    session
}: {
    user: Omit<UserDocument, 'password'> | LeanDocument<Omit<UserDocument, 'password'>>;
    session: Omit<SessionDocument, 'password'> | LeanDocument<Omit<SessionDocument, 'password'>>;
}) {
    // Build and return the new access token
    const accessToken = sign(
        { ...user, session: session._id },
        { expiresIn: config.get('accessTokenTtl') } // 15 minutes
    );
    return accessToken;
}

export async function reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
    // Decode the refresh token
    const { decoded } = decode(refreshToken);

    if (!decoded || !get(decoded, '_id')) return false;

    // Get the session
    const session = await Session.findById(get(decoded, '_id'));

    // Make sure the session is still valid
    if (!session || !session?.valid) return false;

    const user = await findUser({ _id: session.user });

    if (!user) return false;

    const accessToken = createAccessToken({ user, session });

    return accessToken;
}

export async function createSession(userId: string, userAgent: string) {
    const session = await Session.create({ user: userId, userAgent });
    return session.toJSON();
}

export async function updateSession(query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) {
    return Session.updateOne(query, update);
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
    return Session.find(query).lean();
}

export async function findUser(query: FilterQuery<UserDocument>) {
    return User.findOne(query).lean();
}
