import AWS from 'aws-sdk';


export default (queueName) => {
  AWS.config.loadFromPath('./credentials/AWS.config.json');

  const sqs = new AWS.SQS({});
  const params = {
    QueueName: queueName
  };

  return new Promise((resolve, reject) => {
    sqs.createQueue(params, (err, data) =>
      (err ? reject(err) : resolve(data)));
  });
};
