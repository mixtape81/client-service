import AWS from 'aws-sdk';

AWS.config.loadFromPath('./credentials/AWS.config.json');


const sqs = new AWS.SQS({});
const params = {
  MessageBody: 'Hello world!',
  QueueUrl: 'https://sqs.us-east-2.amazonaws.com/565396038887/Mixtape'
};

sqs.sendMessage(params, (err, data) =>
  (err ? console.error(err) : console.log('Success!', data.MessageId)));
