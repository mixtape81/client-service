import AWS from 'aws-sdk';


export default (queueUrl) => {
  AWS.config.loadFromPath('./credentials/AWS.config.json');

  const sqs = new AWS.SQS({});

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

  return new Promise((resolve, reject) => {
    sqs.receiveMessage(params, (err, data) => {
      if (err) {
        reject(err);
      } else if (!data.Messages) {
        resolve('No pending messages in the queue!');
      } else {
        const deleteParams = {
          QueueUrl: queueUrl,
          ReceiptHandle: data.Messages[0].ReceiptHandle
        };
        sqs.deleteMessage(deleteParams, error =>
          (err ? reject(error) : resolve(data)));
      }
    });
  });
};
