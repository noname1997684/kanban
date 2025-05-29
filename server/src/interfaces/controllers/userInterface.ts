import { Request, Response } from "express";

export interface GetUserRequest extends Request {
  body: {
    username?: string;
    email?: string;
    password?: string;
  };
  params: {
    userId?: string;
  };
  query: {
    [key: string]: string | undefined;
  };
}
export interface GetUserResponse extends Response {}

export interface RegisterUserRequest extends Request {
  body: {
    username: string;
    email: string;
    password: string;
  };
}

export interface RegisterUserResponse extends Response {
  status: (statusCode: number) => this;
  json: (body: {
    message: string;
    user?: {
      id: string;
      username: string;
      email: string;
      boards?: string[]; 
    };
    error?: string;
  }) => this;
}

export interface LoginUserRequest extends Request {
  body: {
    email: string;
    password: string;
  
  };
}

export interface LoginUserResponse extends Response {
  status: (statusCode: number) => this;
  json: (body: {
    message: string;
    user?: {
      id: string;
      username: string;
      email: string;
      boards?: string[]; 
    };
    error?: string;
  }) => this;
}

export interface LogoutUserResponse extends Response {
  clearCookie: (
    name: string,
    options?: { path?: string; domain?: string }
  ) => this;
  status: (statusCode: number) => this;
  json: (body: { message: string; error?: string }) => this;
}
