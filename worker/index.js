const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const subscription = redisClient.duplicate();

function fib(index) {
    if (index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}

subscription.on('message', (channel, message) => {
    // insert into a hash called values
    // message is the index value submitted
    redisClient.hset('values', message, fib(parseInt(message)));
});

// subscribe to any insert event
// calculate the value and send it back to the redis instance
subscription.subscribe('insert');