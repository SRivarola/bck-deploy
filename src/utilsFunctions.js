import { randomBytes } from 'crypto';

function generateUniqueToken() {
    const token = randomBytes(20).toString('hex');
    return token;
}

export { generateUniqueToken };