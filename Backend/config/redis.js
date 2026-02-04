import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: '8ZNlIqQcZxshWWq8ONupx6iJ3v2zTzJb',
    socket: {
        host: 'redis-14985.crce182.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 14985
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)  // >>> bar



export default client;
