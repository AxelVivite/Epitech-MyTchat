export const MongoId = {
  type: 'string',
  format: 'uuid',
  example: '632999f5bb5e77c72e9bf905',
};

export const Timestamp = {
  type: 'string',
  format: 'date-time',
  example: '2017-07-21T17:32:28Z',
};

export const Post = {
  type: 'object',
  required: [
    'user',
    'room',
    'content',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    user: MongoId,
    room: MongoId,
    content: {
      type: 'string',
      format: 'string',
      description: 'Content of the post',
    },
    createdAt: Timestamp,
    updatedAt: Timestamp,
  },
};

export const Room = {
  type: 'object',
  required: [
    'name',
    'users',
    'posts',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    name: {
      type: 'string',
      format: 'string',
    },
    users: {
      type: 'array',
      items: MongoId,
    },
    posts: {
      type: 'array',
      items: MongoId,
    },
    createdAt: Timestamp,
    updatedAt: Timestamp,
    lastPost: Post,
  }
};

export const User = {
  type: 'object',
  required: [
    'username',
    'email',
    'rooms',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    username: {
      type: 'string',
      format: 'string',
    },
    email: {
      type: 'string',
      format: 'format',
    },
    rooms: {
      type: 'array',
      items: MongoId,
    },
    createdAt: Timestamp,
    updatedAt: Timestamp,
  },
};

export const SigninResult = {
  type: 'object',
  required: [
    'userId',
    'token',
    'expiresIn',
  ],
  properties: {
    userId: MongoId,
    token: {
      type: 'string',
      description: 'JSON Web Token',
      example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzI5OWEzNTI1ODUzMzY1NTBjYjI2NDkiLCJpYXQiOjE2NjM2NzA4MzcsImV4cCI6MTY2NDUzNDgzN30.J6AOP4OP6ftFA0ahF8_Up29y23qD-gZF_OqKIYwNj7s',
    },
    expiresIn: {
      type: 'string',
      description: 'TTL of the token, format explained at https://github.com/vercel/ms#examples',
      example: '10 days',
    },
  },
};
