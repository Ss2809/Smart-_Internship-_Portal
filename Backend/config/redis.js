import { createClient } from 'redis';

const client = createClient({
    username: process.env.redix_usernmae,
    password: process.env.redix_pass,
    socket: {
        host: process.env.redix_host,
        port: 14985
    }
});

client.on('error', err => console.error('Redis Client Error', err));

await client.connect();

export default client;
