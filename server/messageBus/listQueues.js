import AWS from 'aws-sdk';


export default () => {
  AWS.config.loadFromPath('./credentials/AWS.config.json');

  const sqs = new AWS.SQS({});
  const params = {};

  return new Promise((resolve, reject) => {
    sqs.listQueues(params, (err, data) =>
      (err ? reject(err) : resolve(data.QueueUrls)));
  });
};
