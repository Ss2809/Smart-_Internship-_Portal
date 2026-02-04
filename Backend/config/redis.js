import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: '8ZNlIqQcZxshWWq8ONupx6iJ3v2zTzJb',
    socket: {
        host: 'redis-14985.crce182.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 14985
    }
});

client.on('error', err => console.error('Redis Client Error', err));

await client.connect();

export default client;
