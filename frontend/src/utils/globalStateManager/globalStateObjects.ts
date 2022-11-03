export interface Friend {
    userId: string,
    username: string,
}

export interface User {
    userId: string,
    username: string,
}

export interface Post {
    message: string,
    messageDate: Date,
    sender: Friend,
}

export interface Room {
    roomId: string,
    name: string,
    lastMessage: Post,
    friends?: Friend[] | null,
}
