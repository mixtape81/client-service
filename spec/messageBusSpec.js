/* eslint func-names: 0 */
/* eslint prefer-arrow-callback: 0 */
/* eslint no-unused-expressions: 0 */
import { expect } from 'chai';
import MessageBus from '../server/messageBus/messageBus';

let testMessageId;
const testMessage = 'Hello world!';
const currentQueues = 2;

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

  it('Should only receive the top message in the queue', function (done) {
    this.timeout(5000);
    MessageBus.publishMessage('TestQueue', testMessage)
      .then((thingTwo) => {
        console.log(thingTwo);
        return MessageBus.publishMessage('TestQueue', 'Testing');
      })
      .then((thingTwo) => {
        console.log(thingTwo);
        return MessageBus.consumeMessage('TestQueue');
      })
      .then((resultOne) => {
        MessageBus.consumeMessage('TestQueue')
          .then((resultTwo) => {
            expect(resultOne.Messages[0].Body).to.equal(testMessage);
            expect(resultTwo.Messages[0].Body).to.equal('Testing');
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
    MessageBus.publishMessage('NewTestQueue', testMessage)
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
    MessageBus.consumeMessage('NewTestQueue')
      .then((result) => {
        expect(result.Messages[0].Body).to.equal(testMessage);
        done();
      });
  });
});
