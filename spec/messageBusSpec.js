/* eslint func-names: 0 */
/* eslint prefer-arrow-callback: 0 */
/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import MessageBus from '../server/messageBus/messageBus';

let testMessageId;
const testMessage = 'Hello world!';
const currentQueues = 2;

const possible =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let randomQueueName = '';
for (let i = 0; i < 5; i += 1) {
  randomQueueName +=
    possible.charAt(Math.floor(Math.random() * possible.length));
}

describe('Message Bus', function () {
  it('Should grab all existing queue urls', function (done) {
    MessageBus.storeUrls()
      .then(() => {
        expect(Object.keys(MessageBus.queueUrls))
          .to.have.lengthOf(currentQueues);
        done();
      });
  });

  it('Should publish a message to the queue', function (done) {
    MessageBus.publishMessage('TestQueue', testMessage)
      .then((result) => {
        testMessageId = result.MessageId;
        expect(result.MessageId).to.exist;
        done();
      });
  });

  it('Should receive that message from the queue', function (done) {
    MessageBus.consumeMessage('TestQueue')
      .then((result) => {
        expect(result.Messages[0].MessageId).to.equal(testMessageId);
        expect(result.Messages[0].Body).to.equal(testMessage);
        done();
      });
  });

  it('Should receive multiple messages from queue', function (done) {
    this.timeout(5000);
    MessageBus.publishMessage('TestQueue', testMessage)
      .then(() => MessageBus.publishMessage('TestQueue', 'Testing'))
      .then(() => MessageBus.consumeMessage('TestQueue'))
      .then((resultOne) => {
        MessageBus.consumeMessage('TestQueue')
          .then((resultTwo) => {
            const resultArray =
              [resultOne.Messages[0].Body, resultTwo.Messages[0].Body];
            expect(resultArray).to.include(testMessage);
            expect(resultArray).to.include('Testing');
            done();
          });
      });
  });

  it('Should delete message from queue after consuming', function (done) {
    this.timeout(5000);
    MessageBus.publishMessage('TestQueue', testMessage)
      .then(() => MessageBus.consumeMessage('TestQueue'))
      .then((resultOne) => {
        MessageBus.consumeMessage('TestQueue')
          .then((resultTwo) => {
            expect(resultOne.Messages).to.exist;
            expect(resultTwo).to.equal('No pending messages in the queue!');
            done();
          });
      });
  });

  it('Should reject publish without queueName', function (done) {
    expect(MessageBus.publishMessage('', testMessage))
      .to.equal('Must submit a queue name and message!');
    done();
  });

  it('Should reject publish without message', function (done) {
    expect(MessageBus.publishMessage('TestQueue'))
      .to.equal('Must submit a queue name and message!');
    done();
  });

  it('Should reject consume without a queueName', function (done) {
    expect(MessageBus.consumeMessage())
      .to.equal('Must submit a valid queue name!');
    done();
  });

  it('Should reject consume without a valid queueName', function (done) {
    expect(MessageBus.consumeMessage('FakeQueue'))
      .to.equal('Must submit a valid queue name!');
    done();
  });

  it('Should create a new queue on publish', function (done) {
    this.timeout(5000);
    MessageBus.publishMessage(randomQueueName, testMessage)
      .then((result) => {
        expect(result.MessageId).to.exist;
        done();
      });
  });

  it('Should store the newly created queue url', function (done) {
    expect(Object.keys(MessageBus.queueUrls))
      .to.have.lengthOf(currentQueues + 1);
    done();
  });

  it('Should receive message from the newly created queue', function (done) {
    MessageBus.consumeMessage(randomQueueName)
      .then((result) => {
        expect(result.Messages[0].Body).to.equal(testMessage);
        done();
      });
  });

  it('Should delete a queue', function (done) {
    MessageBus.deleteQueue(randomQueueName)
      .then((result) => {
        expect(result.ResponseMetadata.RequestId).to.exist;
        expect(Object.keys(MessageBus.queueUrls))
          .to.have.lengthOf(currentQueues);
        done();
      });
  });
});
