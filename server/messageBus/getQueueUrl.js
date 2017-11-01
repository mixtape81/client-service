import AWS from 'aws-sdk';

AWS.config.loadFromPath('./credentials/AWS.config.json');

const sqs = new AWS.SQS({});
const params = {
  QueueName: 'Mixtape'
};

sqs.getQueueUrl(params, (err, data) =>
  (err ? console.error(err) : console.log(data.QueueUrl)));
