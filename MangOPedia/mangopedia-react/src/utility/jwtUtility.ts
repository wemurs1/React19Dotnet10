import { jwtDecode } from 'jwt-decode';

export type DecodedJWT = {
  id: string;
  name: string;
  email: string;
  role?: string;
  exp?: number;
};

type jwtFields = {
  id: string;
  fullname: string;
  email: string;
  role?: string;
  exp?: number;
};

const decodeJWT = (token: string) => {
  try {
    return jwtDecode<jwtFields>(token);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string) => {
  const decodedToken = decodeJWT(token);
  return !decodedToken?.exp || decodedToken.exp * 1000 < Date.now();
};

export const getUserInfoFromToken = (token: string) => {
  const decodedToken = decodeJWT(token);
  if (!decodedToken) return null;
  const returnedData: DecodedJWT = {
    id: decodedToken.id,
    name: decodedToken.fullname,
    email: decodedToken.email,
    role: decodedToken.role,
    exp: decodedToken.exp,
  };
  return returnedData;
};
