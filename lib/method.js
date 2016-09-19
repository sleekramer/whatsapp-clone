import { Meteor } from 'meteor/meteor';
import { Chats, Messages } from '../lib/collections';
import { check } from 'meteor/check';
Meteor.methods({
  newMessage(message) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in', 'Must be logged in to update name.');
    }

    check(message, Match.OneOf(
      {
        text: String,
        type: 'text',
        chatId: String
      },
      {
        picture: String,
        type: 'picture',
        chatId: String
      }
    ));

    message.timestamp = new Date();
    message.userId = this.userId;

    const messageId = Messages.insert(message);
    Chats.update(message.chatId, { $set: { lastMessage: message } });

    return messageId;
  },

  updateName(name) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in', 'Must be logged in to update name.');
    }

    check(name, String);

    if (name.length === 0) {
      throw Meteor.Error('name-required', 'Must provide a user name');
    }

    return Meteor.users.update(this.userId, { $set: { 'profile.name': name} });
  },

  updatePicture(data) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in', 'Must be logged in to update picture,');
    }

    check(data, String);

    return Meteor.users.update(this.userId, { $set: { 'profile.picture': data } });
  },

  newChat(otherId) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in', 'Must be logged in to create a chat.');
    }

    check(otherId, String);
    const otherUser = Meteor.users.findOne(otherId);

    if (!otherUser) {
      throw new Meteor.Error('user-not-exists', 'Chat\'s user does not exist')
    }

    const chat = {
      userIds: [this.userId, otherId],
      createdAt: new Date()
    };

    const chatId = Chats.insert(chat);

    return chatId;
  },
  removeChat(chatId) {
    if (!this.userId) {
      throw new Meteor.Error('not-logged-in', 'Must be logged in to remove a chat.');
    }

    check(chatId, String);

    const chat = Chats.findOne(chatId);

    if (!chat || !_.include(chat.userIds, this.userId)) {
      throw new Meteor.Error('chat-not-exists', 'Chat does not exist')
    }

    Messages.remove({ chatId: chatId });

    return Chats.remove({ _id: chatId });
  }
});
