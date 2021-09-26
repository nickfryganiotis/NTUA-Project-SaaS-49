const express = require('express');
const router = express.Router();
const axios = require( 'axios' );

//Redis Connection
const REDIS_PORT = 6379;
const REDIS_HOST = 'localhost';
const TotalConnections = 20;
const pool = require('redis-connection-pool')('myRedisPool', {
    host: REDIS_HOST,
    port: REDIS_PORT,
    max_clients: TotalConnections,
    perform_checks: false,
    database: 0
});
console.log('connected to redis');

pool.hset('subscribers','sign-up', JSON.stringify([]) , () => {});
pool.hset('subscribers' , 'create-question', JSON.stringify([]) , () => {});
pool.hset('subscribers' , 'answer-question', JSON.stringify([]) , () => {});
pool.hset('bus' , 'sign-up' , JSON.stringify([]) , () => {});
pool.hset('bus' , 'create-question' , JSON.stringify([]) , () => {});
pool.hset('bus' , 'answer-question' , JSON.stringify([]) , () => {});


router.post('/sign_up' , ( req , res) => {
    const event = req.body;
    let currentMessages;
    let newMessage = {};

    pool.hget('bus' , 'sign-up' , async ( error , data ) => {
        currentMessages = JSON.parse( data );
        newMessage = {
            'id': currentMessages.length + 1,
            event,
            'timestamp': Date.now()
        };
        currentMessages.push(newMessage);
        pool.hset('bus' , 'sign-up' , JSON.stringify(currentMessages) , () => {
            pool.hget('subscribers' , 'sign-up' , ( error , data) => {
                let subscribers = JSON.parse(data);
                for ( let i = 0; i <subscribers.length; i++ ) {
                    let options = {
                        method: 'post',
                        url: subscribers[i],
                        data: newMessage
                    };
                    axios(options).then(resp => {
                        console.log(subscribers[i],resp.data);
                    }).catch(e => {
                        console.log(subscribers[i],{'status':'lost connection'});
                    });
                    res.send({'status':'ok'})
                }
            })
        })
    })
})
router.post('/create_question' , ( req , res ) => {
    const event = req.body;
    let currentMessages;
    let newMessage = {};

    pool.hget('bus' , 'create-question' , async ( error , data ) => {
        currentMessages = JSON.parse( data );
        newMessage = {
            'id': currentMessages.length + 1,
            event,
            'timestamp': Date.now()
        };
        currentMessages.push(newMessage);
        pool.hset('bus' , 'create-question' , JSON.stringify(currentMessages) , () => {
            pool.hget('subscribers' , 'create-question' , ( error , data) => {
                let subscribers = JSON.parse(data);
                for ( let i = 0; i <subscribers.length; i++ ) {
                    let options = {
                        method: 'post',
                        url: subscribers[i],
                        data: newMessage
                    };
                    axios(options).then(resp => {
                        console.log(subscribers[i],resp.data);
                    }).catch(e => {
                        console.log(subscribers[i],{'status':'lost connection'});
                    });
                }
                res.send({'status':'ok'})
            })
        })
    })
})

router.post('/answer_question' , ( req , res) => {
    const event = req.body;
    let currentMessages;
    let newMessage = {};

    pool.hget('bus' , 'answer-question' , async ( error , data ) => {
        currentMessages = JSON.parse( data );
        newMessage = {
            'id': currentMessages.length + 1,
            event,
            'timestamp': Date.now()
        };
        currentMessages.push(newMessage);
        pool.hset('bus' , 'answer-question' , JSON.stringify(currentMessages) , () => {
            pool.hget('subscribers' , 'answer-question' , ( error , data) => {
                let subscribers = JSON.parse(data);
                for ( let i = 0; i <subscribers.length; i++ ) {
                    let options = {
                        method: 'post',
                        url: subscribers[i],
                        data: newMessage
                    };
                    axios(options).then(resp => {
                        console.log(subscribers[i],resp.data);
                    }).catch(e => {
                        console.log(subscribers[i],{'status':'lost connection'});
                    });
                }
                    res.send({'status':'ok'})
            })
        })
    })
})

module.exports = router;