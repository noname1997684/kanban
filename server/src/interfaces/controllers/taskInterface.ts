export interface CreateTaskRequest {
    body: {
        listId: string; 
        title: string;
        description: string;
        
    };
}

export interface CreateTaskResponse {
    status: (statusCode: number) => this;
    json: (body: {
        message: string;
        task?: {
            id: string;
            title: string;
            description: string;
            listId: string;    
        };
        error?: string;
    }) => this;
}

export interface GetTasksByListRequest {
   body: {
    listId: string;
   }
}

export interface GetTasksByListResponse {
    status: (statusCode: number) => this;
    json: (body: {
        message: string;
        tasks?: {
            id: string;
            title: string;
            description: string;
             listId: string;  
          
        }[];
        error?: string;
    }) => this;
}