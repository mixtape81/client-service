import AWS from 'aws-sdk';

AWS.config.loadFromPath('./credentials/AWS.config.json');

// Create SQS service object
const sqs = new AWS.SQS({});
const queueUrl = 'https://sqs.us-east-2.amazonaws.com/565396038887/Mixtape';

const params = {
  AttributeNames: [
    'SentTimestamp'
  ],
  MaxNumberOfMessages: 1,
  MessageAttributeNames: [
    'All'
  ],
  QueueUrl: queueUrl,
  VisibilityTimeout: 0,
  WaitTimeSeconds: 0
};

sqs.receiveMessage(params, (err, data) => {
  if (err) {
    console.error(err);
  } else {
    console.log(data);
    const deleteParams = {
      QueueUrl: queueUrl,
      ReceiptHandle: data.Messages[0].ReceiptHandle
    };
    sqs.deleteMessage(deleteParams, (error, delData) =>
      (err ? console.error(error) : console.log('Message Deleted', delData)));
  }
});
