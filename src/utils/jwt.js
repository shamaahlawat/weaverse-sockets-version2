import jwt from 'jsonwebtoken';
import CONFIG from '../config';

// import config from '../config';

const {
    TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRY,
    ACCESS_TOKEN_ALGO,
    REFRESH_TOKEN_EXPIRY,
    REFRESH_TOKEN_ALGO
} = CONFIG;


if (
    !TOKEN_SECRET ||
    !ACCESS_TOKEN_EXPIRY ||
    !ACCESS_TOKEN_ALGO ||
    !REFRESH_TOKEN_EXPIRY ||
    !REFRESH_TOKEN_ALGO
) {
    throw new Error('JWT settings not found in env');
}

export async function issueJWT({ payload }) {
    const token = await jwt.sign(payload, TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
        algorithm: ACCESS_TOKEN_ALGO
    });
    return token;
}



export async function verifyJWT({ token }) {
    const isValid = await jwt.verify(token, TOKEN_SECRET);
    return isValid;
}

export async function decodeJWT({ token }) {
    const decoded = await jwt.decode(token, TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY,
        algorithm: ACCESS_TOKEN_ALGO
    });
    return decoded;
}
