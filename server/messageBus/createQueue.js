import AWS from 'aws-sdk';

AWS.config.loadFromPath('./credentials/AWS.config.json');

export default (queueName) => {
  const sqs = new AWS.SQS({});
  const params = {
    QueueName: queueName
  };

  return new Promise((resolve, reject) => {
    sqs.createQueue(params, (err, data) =>
      (err ? reject(err) : resolve(data)));
  });
};
