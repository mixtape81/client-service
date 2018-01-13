import AWS from 'aws-sdk';

AWS.config.loadFromPath('./credentials/AWS.config.json');

export default (queueUrl) => {
  const sqs = new AWS.SQS({});
  const params = {
    QueueUrl: queueUrl
  };

  return new Promise((resolve, reject) => {
    sqs.deleteQueue(params, (err, data) =>
      (err ? reject(err) : resolve(data)));
  });
};
