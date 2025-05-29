interface IBoard{
    id: string;
    name: string;
    userId: string;
    lists: string[]; 
}

export interface getBoardByUserIdRequest {
    params: {
        userId: string;
    };
}

export interface getBoardByUserIdResponse {
    status: (statusCode: number) => this;
    json: (body: {
        boards?: IBoard[];
        message?: string;
        error?: string;
    }) => this;
}

export interface CreateBoardRequest {
    body: {
        name: string;
        userId: string; 
    };
}

export interface CreateBoardResponse {
    status: (statusCode: number) => this;
    json: (body: {
        message: string;
        board?: IBoard;
        error?: string;
    }) => this;
    
}

export interface UpdateBoardRequest {
    params: {
        id: string;
    };
    body: {
        name: string;
    };
}

export interface UpdateBoardResponse {
    status: (statusCode: number) => this;
    json: (body: {
        message: string;
        board?: IBoard;
        error?: string;
    }) => this;
}

export interface DeleteBoardRequest {
    params: {
        id: string;
    };
}

export interface DeleteBoardResponse {
    status: (statusCode: number) => this;
    json: (body: {
        message: string;
        error?: string;
    }) => this;
}