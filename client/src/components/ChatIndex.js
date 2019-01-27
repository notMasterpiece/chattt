import React, {Component} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import io from 'socket.io-client';
const socket = io.connect(window.location.origin, {
    reconnection: true
});




class ChatIndex extends Component {


    state = {
        messages: [],
        message: '',
        activeChannel: false,
        channels: [],
        showAddChannel: false,
        channelName: '',
        channelDescription: ''
    };


    resize = () => {
        console.log('resize');
    };


    componentDidMount() {

        window.addEventListener('resize', this.resize);

        this.socketConnect();


        socket.on('GET_ALL_CHANNELS', channels => {
            this.setState({
                channels,
                activeChannel: channels[0]
            })
        });

        socket.on('LOAD_FIRST_MESSAGES', messages => {
            this.setState({
                messages
            });
            this.scrollToBottomMessages();
        });


        socket.on('ADDED_CHANNEL', channel => {

            const channels = [...this.state.channels, channel];
            channels.sort((a, b) => new Date(b.channelDate) - new Date(a.channelDate));

            this.setActiveChannel(channels[0]);

            this.setState({
                channels,
                showAddChannel: false,
                channelName: '',
                channelDescription: ''

            })
        });

        socket.on('ADDED_MESSAGE', message => {

            this.setState({
                messages: [...this.state.messages, message],
                message: ''
            });

            this.scrollToBottomMessages();


        });

        socket.on('LOAD_MESSAGES_BY_CHANNEL', messages => {

            this.setState({
                messages
            });

            this.scrollToBottomMessages();

        });

    }


    scrollToBottomMessages = () => {
        this.messagesBlock.scrollTop = this.messagesBlock.scrollHeight;
    };


    socketConnect = () => {

        socket.on('socketClientID', function (socketClientID) {
            console.log('Connection to server established. SocketID is',socketClientID);
        });
    };


    componentWillUnmount() {

        window.removeEventListener('resize', this.resize);
    }


    setActiveChannel = activeChannel => {

        this.setState({ activeChannel });
        socket.emit('SET_ACTIVE_CHANNEL', activeChannel._id );

    };


    changeMessage = e => {
        this.setState({ message: e.target.value })
    };

    addMessage = e => {
        e.preventDefault();


        const { message, activeChannel } = this.state;

        if ( !message.trim().length ) return;

        const newMessage = {
            user: 'Vasul',
            message,
            channelID: activeChannel
        };


        socket.emit('ADD_MESSAGES', newMessage);


        this.setState({ message: ''})
    };



    showAddChannel = () => {
        this.setState({showAddChannel: true})
    };



    addChannel = () => {

      const { channelName, channelDescription } = this.state;

      const newChannel = {
          channelName,
          channelDescription
      };

      socket.emit('ADD_CHANNEL', newChannel);

    };


    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    };




    render() {

        console.log(this.state);

        const { messages, channels , activeChannel, message, showAddChannel, channelDescription, channelName } = this.state;



        return (
            <div className='app_messenger'>
                <div className="header">
                    <div className="header_left">asdas</div>
                    <div className="header_content"><h1>#{ activeChannel.channelName } <span>{ messages.length }</span></h1></div>
                    <div className="header_right">
                        <div className="user_info">
                            <div className="user_info_title">Vasul Pankiv</div>
                            <div className="user_info_photo">
                                <img src="https://gravatar.com/avatar/3asdasdasdasdasdasdasd?d=mm" alt=""/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="main">
                    <div className="sidebar_left">

                        {
                            showAddChannel ?

                                <div className="add_channel">
                                    <div className="add_channel__title">Add channel</div>
                                    <label>
                                        <input
                                            className='add_channel__input'
                                            placeholder='ChannelName'
                                            value={channelName}
                                            name='channelName'
                                            onChange={this.onChange}
                                            type="text"/>
                                    </label>

                                    <label>
                                        <input
                                            className='add_channel__input'
                                            placeholder='ChannelDescription'
                                            value={channelDescription}
                                            name='channelDescription'
                                            onChange={this.onChange}
                                            type="text"/>
                                    </label>
                                    <div className="add_channel__bottom">
                                        <button
                                            type='button'
                                            onClick={this.addChannel}
                                            className='add_channel__btn'
                                        >Add</button>
                                    </div>
                                </div>
                                :

                                <div className="user-list">

                                    {
                                        channels.map(channel => (
                                            <div
                                                className={`user-w ${ activeChannel._id === channel._id ? 'active' : ''}`}
                                                key={channel._id}
                                                onClick={ () => this.setActiveChannel(channel) }
                                            >
                                                <div className="avatar with-status status-green">
                                                    <img alt="" src={`https://api.adorable.io/avatars/60/${channel._id}@adorable.png`} />
                                                </div>
                                                <div className="user-info">
                                                    <div className="user-date">
                                                        { moment(channel.channelDate).format('MM/DD/YYYY') }
                                                    </div>
                                                    <div className="user-name">
                                                        #{ channel.channelName }
                                                    </div>
                                                    <div className="last-message">
                                                        { channel.channelDescription }
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }

                                </div>


                        }


                        {
                            !showAddChannel &&

                            <div className="user-list__bottom">
                                <h2 className='user-list__title'>
                                    Channels <span className="user-list__count">{ channels.length }</span>
                                </h2>
                                <div
                                    onClick={this.showAddChannel}
                                    className="user-list__add">
                                    +
                                </div>
                            </div>
                        }



                    </div>
                    <div className="content">
                        <div
                            className="messages"
                            ref={node => this.messagesBlock = node}
                        >

                            {
                                messages.map(m => (
                                        <div key={m._id} className={ `message ${m.me ? 'me' : ''}` }>
                                            <div className="message_photo">
                                                <img src="https://gravatar.com/avatar/3asdasdasdasdasdasdasd?d=mm" alt=""/>
                                            </div>
                                            <div className="message_body">
                                                <div className="message_author">{ `${m.me ? 'Ви' : m.user}` } <time>{ moment(m.created).fromNow() }</time></div>
                                                <div className="message_text">
                                                    <p>{ m.message }</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                            }

                        </div>
                        
                        <div className="messages_input_wrap">
                            <form onSubmit={this.addMessage}>
                                <input
                                    autoFocus={true}
                                    className='messages_input'
                                    type="text"
                                    placeholder='Введіть повідомлення тут...'
                                    value={ message }
                                    onChange={this.changeMessage}

                                />
                            </form>
                        </div>
                    </div>
                    <div className="sidebar_right ae-list">
                        <div className="ae-item with-status  status-green">
                            <div className="aei-image">
                                <div className="user-avatar-w">
                                    <img alt="" src="https://gravatar.com/avatar/3asdasdasdasdasdasdasd?d=mm" />
                                </div>
                            </div>
                            <div className="aei-content">
                                <div className="aei-timestamp">
                                    11:12am
                                </div>
                                <h6 className="aei-title">
                                    Kyle Jefferson
                                </h6>
                                <div className="aei-sub-title">
                                    Document Verification
                                </div>
                                <div className="aei-text">
                                    When the equation, first to ability the forwards, the a but travelling
                                </div>
                            </div>
                        </div>

                        <div className="ae-item with-status  status-red">
                            <div className="aei-image">
                                <div className="user-avatar-w">
                                    <img alt="" src="https://gravatar.com/avatar/3asdasdasdasdasdasdasd?d=mm" />
                                </div>
                            </div>
                            <div className="aei-content">
                                <div className="aei-timestamp">
                                    2 days ago
                                </div>
                                <h6 className="aei-title">
                                    Mesut Ozil
                                </h6>
                                <div className="aei-sub-title">
                                    New comment received
                                </div>
                                <div className="aei-text">
                                    When the equation, first to ability the forwards, the a but travelling
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ChatIndex.propTypes = {};

export default ChatIndex;