import Moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { Chats, Messages } from '../lib/collections';

Meteor.startup(function() {
  if (Chats.find().count() !== 0) return;

  Messages.remove({});

  const hardMessages = [
    {
      text: 'You on your way?',
      timestamp: Moment().subtract(1, 'hours').toDate()
    },
    {
      text: 'Hey, it\'s me',
      timestamp: Moment().subtract(2, 'hours').toDate()
    },
    {
      text: 'I should buy a boat',
      timestamp: Moment().subtract(1, 'days').toDate()
    },
    {
      text: 'Look at my mukluks!',
      timestamp: Moment().subtract(4, 'days').toDate()
    },
    {
      text: 'This is wicked good ice cream.',
      timestamp: Moment().subtract(2, 'weeks').toDate()
    }
  ];

  hardMessages.forEach((m) => {
    Messages.insert(m);
  });

  // const hardChats = [
    // profile: {
    //   name: 'Ethan Gonzalez',picture: 'https://randomuser.me/api/portraits/thumb/men/1.jpg'
    // },
    // profile: {
    //   name: 'Bryan Wallace', picture: 'https://randomuser.me/api/portraits/thumb/lego/1.jpg'
    // },
    // profile: {
    //   name: 'Avery Stewart', picture: 'https://randomuser.me/api/portraits/thumb/women/1.jpg'
    // },
    // profile: {
    //   name: 'Katie Peterson', picture: 'https://randomuser.me/api/portraits/thumb/women/2.jpg'
    // },
    // profile: {
    //   name: 'Ray Edwards', picture: 'https://randomuser.me/api/portraits/thumb/men/2.jpg'
    // }
  // ];
  const options = {
    userIds: ['EfPaGWR3NFNpqM6mi', 'ytCoKubzdosjkeiSA'],
    createdAt: new Date()
  };
  const chatId = Chats.insert(options);
  const chat = Chats.findOne(chatId)
  for (let i = 0; i < 5; i++) {
    const message = Messages.findOne({ chatId: { $exists: false }});
    chat.lastMessage = message;
    Messages.update(message._id, { $set:{ chatId: chatId }});
  }
  // hardChats.forEach((chat) => {
  //   const message = Messages.findOne({ chatId: { $exists: false } });
  //   chat.lastMessage = message;
  //   const chatId = Chats.insert(chat);
  //   Messages.update(message._id, { $set: { chatId: chatId } });
  // });
});
