const express = require('express');
const bodyParser = require('body-parser');
const { SessionsClient } = require('@google-cloud/dialogflow');

const client = new SessionsClient({
  credentials: JSON.parse(process.env.DIALOGFLOW_CREDENTIALS)
});

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
app.use(bodyParser.json());

app.post('/dialogflowGateway', async (req, res) => {
  const projectId = 'mary-yecb';

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

  try {
    const responses = await client.detectIntent(request);
    const result = responses[0].queryResult;
    res.json({ reply: result.fulfillmentText });
  } catch (error) {
    console.error('Dialogflow error:', error);
    res.json({ reply: 'Σφάλμα κατά την επικοινωνία με Dialogflow.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

