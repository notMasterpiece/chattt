import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import logger from './core/logger/app-logger';
import morgan from 'morgan';
import config from './core/config/config.dev';
import connectToDb from './db/connect';


import Channel from './models/Channel';
import Message from './models/Message';


const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);



const port = config.serverPort;

logger.stream = {
    write: function (message, encoding) {
        logger.info(message);
    }
};

connectToDb();


app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(morgan('dev', {'stream': logger.stream}));

// Index route
app.get('/', (req, res) => {
  res.json({test: '1'});
});

server.listen(port, () => {
    logger.info('server started - ', port);
});

const date = new Date();

io.on('connection', function(socket){
    console.log('Client connected at '+date+' with socket ID: '+ socket.client.id);

    Channel.find({})
        .sort({'channelDate': 'desc'})
        .then(channels => {
            io.emit('GET_ALL_CHANNELS', channels);

            Message.find({channelID: channels[0]._id})
                .then( messages => {
                    io.emit('LOAD_FIRST_MESSAGES', messages);
                })
        })
        .catch(err => {
            console.log(err);
        });

        io.emit('socketClientID', socket.client.id);



    socket.on('ADD_MESSAGES', data => {

        const { message, channelID, user } = data;

        const newMessage = new Message({
            message,
            channelID,
            user
        });

        newMessage.save()
            .then(data => {
                io.emit('ADDED_MESSAGE', data )
            });

    });


    socket.on('ADD_CHANNEL', channel => {

        const { channelName, channelDescription } = channel;

        const newChannel = new Channel({
            channelName,
            channelDescription
        });

        newChannel.save()
            .then(data => {
                socket.emit('ADDED_CHANNEL', data )
            });

    });

    socket.on('SET_ACTIVE_CHANNEL', channelID => {

        Message.find({channelID})
            .then( messages => {
                io.emit('LOAD_MESSAGES_BY_CHANNEL', messages);
            })
            .catch(err => {
                console.log(err);
            })

    });
});


// taskkill /F /IM node.exe





