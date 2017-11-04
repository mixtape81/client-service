import AWS from 'aws-sdk';

AWS.config.loadFromPath('./credentials/AWS.config.json');

export default () => {
  const sqs = new AWS.SQS({});
  const params = {};

  return new Promise((resolve, reject) => {
    sqs.listQueues(params, (err, data) =>
      (err ? reject(err) : resolve(data.QueueUrls)));
  });
};
