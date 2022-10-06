
const { Client, LocalAuth } = require('whatsapp-web.js');
const { v4: uuidv4 } = require('uuid');
const qrcode = require('qrcode-terminal');
const { setTimeout } = require('timers');
const fetch = require('node-fetch');


// API gateway parameter
 const urlGatewayDeployed = "https://keg43ehf5h.execute-api.us-east-1.amazonaws.com/dev";
 const bucketInput = "audio-input-raw"
 const bucketOutput = "transcribe-file-output"

// Functions part
async function getMethod(tries, name, msg) { // Recursive Function
  
  if(tries > 25) { // The limit of tries
    return console.log("Failed to find the response of AWS");
  }
  await new Promise(resolve => setTimeout(resolve, 8000));
  // Trying to get the file from S3
  fetch(`${urlGatewayDeployed}/${bucketOutput}/${name}.json`, { method: "GET"})
  .then(res => res.json()) // Transform the result to Json
    .then((json) => {
      var text = json['results']['transcripts'][0]['transcript']
      console.log(`Attempt(${tries}): Succeed`)
      // Reply the message that trigged the event listener with the text
      return msg.reply(text) 
    })
    .catch(err => { // Failed to find the Json on S3 
      console.log(`Attempt(${tries}): Failed`),
      tries++
      return getMethod(tries, name, msg); // Call the function again
    })
}


// Authentication part
const client = new Client({authStrategy: new LocalAuth()});

client.on('qr', (qr) => {
  qrcode.generate(qr, {small:true}); // Create a qr code on terminal to connect
});

// This event listener going to send a message on console when the API connect sucessfuly with the Whatsapp
client.on('ready', () => {
  console.log('Client is ready'); // Just to confirm
});

// Intercep any message that the user create
client.on('message_create', async (msg)=> { 

  let chat = await msg.getChat(); // Get in which chat de user send a message
  
  if(chat.name == "AudioBot" || chat.name == "Aurilene(31/10)" || chat.name == "FAMILIA Cosmus" || chat.name == "Henrique" || chat.name == "Carla 💩") { // Name of the chat that i want that the API works
    //(Next Line)Verify if the message that trigged the event has media
    if(msg.hasMedia) { // This 'hasMedia' refers to Image, Audio, Video
      if(msg.type == 'audio' || msg.type == 'ptt') { //specify only Audio
        // Creating a name for the audio
        let name = "WhatsappAudio-"+ uuidv4()+".ogg";
        // Downloading the current audio in the msg
        const media = await msg.downloadMedia(); 
        
        // Converting to a buffer so we can send it to AWS service
        const base64data = media.data;
        const buffer = Buffer.from(base64data.replace('data:ogg; codecs=opus;base64,', ''), 'base64');
        
        // Uploading(PUT) on S3 using api gateway
        fetch(`${urlGatewayDeployed}/${bucketInput}/${name}`, {
          method: 'PUT',
          body: buffer
        })

        // Getting(GET) the result of transcribe that is save on S3 bucket
        // The first parameter is only to track how many tries the function does
        await getMethod(1, name, msg);
      }
      }
    }
  })
client.on('disconnected', ()=>console.log("Disconnected"));
client.initialize();