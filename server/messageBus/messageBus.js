/* eslint require-jsdoc: 0 */
import receiveMessage from './receiveMessage';
import sendMessage from './sendMessage';
import createQueue from './createQueue';
import listQueues from './listQueues';
import deleteQueue from './deleteQueue';

class MessageBus {
  constructor() {
    this.queueUrls = {};
  }

  storeUrls() {
    return listQueues()
      .then(urls => urls.forEach((url) => {
        const splitUrl = url.split('/');
        this.queueUrls[splitUrl[splitUrl.length - 1]] = url;
      }));
  }

  publishMessage(queueName, message) {
    if (!queueName || !message) {
      return 'Must submit a queue name and message!';
    }
    if (!this.queueUrls[queueName]) {
      return createQueue(queueName)
        .then((data) => {
          this.queueUrls[queueName] = data.QueueUrl;
          return sendMessage(data.QueueUrl, message)
            .then(confirm => confirm);
        });
    }
    return sendMessage(this.queueUrls[queueName], message);
  }

  consumeMessage(queueName) {
    if (!queueName || !this.queueUrls[queueName]) {
      return 'Must submit a valid queue name!';
    }
    return receiveMessage(this.queueUrls[queueName]);
  }

  deleteQueue(queueName) {
    if (!queueName || !this.queueUrls[queueName]) {
      return 'Must submit a valid queue name to be deleted!';
    }
    const queueUrl = this.queueUrls[queueName];
    delete this.queueUrls[queueName];
    return deleteQueue(queueUrl);
  }
}

export default new MessageBus();
