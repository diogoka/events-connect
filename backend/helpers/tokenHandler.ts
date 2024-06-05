import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const key = process.env.TOKEN_KEY;

export const generateToken = (id: string, email: string): string => {
  const options: SignOptions = {
    expiresIn: process.env.TOKEN_EXPIRATION,
  };
  const token = jwt.sign({ id, email }, key!, options);
  return token;
};

export const checkToken = (token: string): JwtPayload => {
  try {
    const verify = jwt.verify(token, key!) as JwtPayload;
    return { valid: true, payload: verify.id };
  } catch (err: any) {
    const decoded = jwt.decode(token) as JwtPayload;

    return {
      valid: false,
      message: err.message,
      payload: {
        id: decoded!.id,
        email: decoded!.email,
      },
    };
  }
};
