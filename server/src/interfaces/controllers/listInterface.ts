import { Request,Response } from 'express';
export interface getListResponse {
   status: (statusCode: number) => this;
    json: (body: {
        message: string;
        lists?: {
            id: string;
            name: string;
            boardId: string;
            tasks: {
                id: string;
                title: string;
                description: string;
            }[];
        }[];
        error?: string;
    }) => this;

}

export interface getListReqest{

}

export interface GetListByBoardIdRequest {
    params: {
        boardId: string;
    };
}

export interface GetListByBoardIdResponse {
    status: (statusCode: number) => this;
    json: (body: {
        message: string;
        lists?: {
            id: string;
            name: string;
            boardId: string;
            tasks: {
                id: string;
                title: string;
                description: string;
            }[];
        }[];
        error?: string;
    }) => this;
}

export interface CreateListRequest {
    body: {
        name: string;
        boardId: string; 
    };
}

export interface CreateListResponse {
    status: (statusCode: number) => this;
    json: (body: {
        message: string;
        list?: {
            id: string;
            name: string;
            tasks: string[];
            boardId: string; 
        };
        error?: string;
    }) => this;
}

export interface UpdateListRequest {
    params: {
        id: string;
    };
    body: {
        name: string;
    };
}

export interface UpdateListResponse {
    status: (statusCode: number) => this;
    json: (body: {
        message: string;
        
        list?: {
            id: string;
            name: string;
            tasks: string[];
            boardId?: string;
        };
        error?: string;
    }) => this;
}

export interface DeleteListRequest extends Request {
    params: {
        id: string;
    };
}

export interface DeleteListResponse extends Response {
    status: (statusCode: number) => this;
    json: (body: {
        message: string;
        error?: string;
    }) => this;
}