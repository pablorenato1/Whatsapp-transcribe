# Whatsapp Audio to text using Amazon transcribe

## Node Modules:
<li type="disc"><a href="https://www.npmjs.com/package/whatsapp-web.js">Whatsapp-web.js - </a><i>Version 1.17.1</i></li>
<li type="disc"><a href="https://www.npmjs.com/package/node-fetch">node-fetch - </a><i>Version 3.2.10</i></li>
<li type="disc"><a href="https://www.npmjs.com/package/uuid">uuid - </a><i>Version 9.0.0</i></li>
<li type="disc"><a href="https://www.npmjs.com/package/qrcode-terminal">qrcode-terminal - </a><i>Version 0.12.0</i></li>

## Where the ideia came from ?
<p>This project is an assignment   from college where I learn about the AWS services and have to create some interaction with the services. So I created this API that gets audio from one of the chats on my Whatsapp and transforms it from speech to text.</p>

## What this API does ?
<p>
This API going to get audio from one chat on Whatsapp and send it to Amazon transcribe to transform the audio to text and reply to the audio on Whatsapp with the text.
</p>
<p> 
This project not only utilizes the transcribe, but has a structure behind it, where we use an S3 bucket to store the audio file, and the Lambda Function to execute the Transcribe and save the result in a different S3 bucket from the audio. To connect my API with the AWS service I used the AWS service API gateway.
</p>
<img src="./img/AWS Interaction.png" alt="AWS Digram" class="center">

<p>When receives audio on Whatsapp the API will get the audio and send a request to the API gateway to save the audio on the S3 bucket input this bucket has an event listener that going to trigger a Lambda function when the bucket has a new file(rename also trigger).<br>
The lambda function is going to get the new file and send it to Amazon Transcribe to be executed and return an object that going to be saved in a different bucket from the previous one.</p>


