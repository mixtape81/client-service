import AWS from 'aws-sdk';

export default (queueUrl, message) => {
  AWS.config.loadFromPath('./credentials/AWS.config.json');

  const sqs = new AWS.SQS({});
  const params = {
    MessageBody: message,
    QueueUrl: queueUrl
  };

  return new Promise((resolve, reject) => {
    sqs.sendMessage(params, (err, data) =>
      (err ? reject(err) : resolve(data.MessageId)));
  });
};
