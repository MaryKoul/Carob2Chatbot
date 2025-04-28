const express = require('express');
const bodyParser = require('body-parser');
const { SessionsClient } = require('@google-cloud/dialogflow');
const { GoogleAuth } = require('google-auth-library');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
app.use(bodyParser.json());

app.post('/dialogflowGateway', async (req, res) => {
  const projectId = 'mary-yecb'; // << δικό σου project id

  const auth = new GoogleAuth({
    scopes: 'https://www.googleapis.com/auth/cloud-platform',
  });

  const client = new SessionsClient({ auth });
  const sessionPath = client.projectAgentSessionPath(
    projectId,
    Math.random().toString(36).substring(7)
  );

  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: req.body.message,
        languageCode: 'en',
      },
    },
  };

  const responses = await client.detectIntent(request);
  const result = responses[0].queryResult;

  res.json({ reply: result.fulfillmentText });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 
