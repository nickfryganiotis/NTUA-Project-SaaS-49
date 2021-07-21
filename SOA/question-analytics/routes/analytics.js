const express = require( 'express' );
//const createError = require("http-errors");
const axios = require( 'axios' );
const router = express.Router();

const esb_url = 'http://localhost:5004/authenticate'

/*const question_aux = async ( token , add ) => {
    const auth_options = {
        method: 'post',
        url: esb_url,
        data: {'token': token}
    };
    axios(auth_options).then( (in_res) => {
        console.log(in_res.data);
        axios.get( add ).then( ( in_req ) => {
            return in_req.data;
        } ).catch( ( error ) => {
            console.log( error );
            return error.response.status;
        } )
    }).catch( (error ) => {
        console.log(error)
        return error.response.status;
    });
}
*/
router.post( '/questions_per_keyword' , ( req , res ) => {
    const token = req.body[ 'token' ];
    const auth_options = {
        method: 'post',
        url: esb_url,
        data: {'token': token}
    };
    axios(auth_options).then( (in_res) => {
        console.log(in_res.data);
        axios.get( 'http://localhost:5002/questions_per_keyword' ).then( ( in_req ) => {
            res.send( in_req.data );
        } ).catch( ( error ) => {
            console.log( error );
            res.send( error.response.status );
        } )
    }).catch( (error ) => {
        console.log(error)
        res.send(error.response.status);
    });
})

router.post( '/questions_per_day' , ( req , res ) => {
    const token = req.body[ 'token' ];
    const auth_options = {
        method: 'post',
        url: esb_url,
        data: {'token': token}
    };
    axios(auth_options).then( (in_res) => {
        console.log(in_res.data);
        axios.get( 'http://localhost:5002/questions_per_day' ).then( ( in_req ) => {
            res.send( in_req.data );
        } ).catch( ( error ) => {
            console.log( error );
            res.send( error.response.status );
        } )
    }).catch( (error ) => {
        console.log(error)
        res.send(error.response.status);
    });

} )

router.post('/my_questions' , ( req  , res ) => {
    const token = req.body['token'];
    const auth_options = {
        method: 'post',
        url: esb_url,
        data: {'token': token}
    };
    axios(auth_options).then( (in_res) => {
        console.log(in_res.data);
        question_options = {
            method: 'post',
            url: 'http://localhost:5002/my_questions',
            data: {'username': in_res.data['user']['username']}
        };
        axios( question_options ).then( ( in_req ) => {
            res.send( in_req.data );
        } ).catch( ( error ) => {
            console.log( error );
            res.send( error.response.status );
        } )
    }).catch( (error ) => {
        console.log(error)
        res.send(error.response.status);
    });
})

router.post('/my_answers' , ( req , res ) => {
    const token = req.body['token'];
    const auth_options = {
        method: 'post',
        url: esb_url,
        data: {'token': token}
    };
    axios(auth_options).then( (in_res) => {
        console.log(in_res.data);
        answer_options = {
            method: 'post',
            url: 'http://localhost:5002/my_answers',
            data: {'username': in_res.data['user']['username']}
        };
        axios( answer_options ).then( ( in_req ) => {
            res.send( in_req.data );
        } ).catch( ( error ) => {
            console.log( error );
            res.send( error.response.status );
        } )
    }).catch( (error ) => {
        console.log(error)
        res.send(error.response.status);
    });
} )

router.post('/my_contributions_per_day' , ( req , res ) => {
    const token = req.body['token'];
    const auth_options = {
        method: 'post',
        url: esb_url,
        data: {'token': token}
    };
    axios(auth_options).then( (in_res) => {
        console.log(in_res.data);
        contribution_options = {
            method: 'post',
            url: 'http://localhost:5002/my_contributions_per_day',
            data: {'username': in_res.data['user']['username']}
        };
        axios( contribution_options ).then( ( in_req ) => {
            res.send( in_req.data );
        } ).catch( ( error ) => {
            console.log( error );
            res.send( error.response.status );
        } )
    }).catch( (error ) => {
        console.log(error)
        res.send(error.response.status);
    });
})

module.exports = router;