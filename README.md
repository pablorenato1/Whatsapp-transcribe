# Whatsapp Audio to text using Amazon transcribe

## Node Modules:
<li type="disc"><a href="https://www.npmjs.com/package/whatsapp-web.js">Whatsapp-web.js - </a><i>Version 1.17.1</i></li>
<li type="disc"><a href="https://www.npmjs.com/package/node-fetch">node-fetch - </a><i>Version 3.2.10</i></li>
<li type="disc"><a href="https://www.npmjs.com/package/uuid">uuid - </a><i>Version 9.0.0</i></li>
<li type="disc"><a href="https://www.npmjs.com/package/qrcode-terminal">qrcode-terminal - </a><i>Version 0.12.0</i></li>

## Where the ideia came from ?
<p>This assignment for college involves exploring AWS services and developing interactions with them. As part of the project, I designed an API capable of extracting audio from a WhatsApp chat and converting it from speech to text.</p>

## What this API does ?
<p>
This API is designed to retrieve audio from a specific WhatsApp chat, transmit it to Amazon Transcribe for the conversion of audio to text, and subsequently respond on WhatsApp with the text corresponding to the original audio.
</p>
<p> 
This project not only makes use of Amazon Transcribe but also incorporates a structured approach. It involves utilizing an S3 bucket for storing the audio file and leveraging a Lambda Function to execute the Transcribe process, saving the results in a separate S3 bucket from the original audio. The connection between my API and AWS services is established through the AWS service API Gateway.</p>
<img src="./img/AWS Interaction.png" alt="AWS Digram" class="center">

<p>When receives audio on Whatsapp the API will get the audio and send a request to the API gateway to save the audio on the S3 bucket input this bucket has an event listener that going to trigger a Lambda function when the bucket has a new file(rename also trigger).<br>
The lambda function is going to get the new file and send it to Amazon Transcribe to be executed and return an object that going to be saved in a different bucket from the previous one.</p>


