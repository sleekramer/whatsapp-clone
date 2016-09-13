import { Meteor } from 'meteor/meteor';
import { Chats, Messages } from '../lib/collections';
import { check } from 'meteor/check'
Meteor.methods({
  newMessage(message) {
    check(message, {
      text: String,
      type: 'text',
      chatId: String
    });

    message.timestamp = new Date();

    const messageId = Messages.insert(message);
    Chats.update(message.chatId, { $set: { lastMessage: message } });

    return messageId;
  }
});
