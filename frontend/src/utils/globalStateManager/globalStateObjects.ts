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
    messageDate: string,
    sender: Friend | null,
}

export interface Room {
    roomId: string,
    name: string,
    lastMessage: Post | null,
    friends?: Friend[] | null,
}
