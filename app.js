
const { MessageMedia, Client, LocalAuth } = require('whatsapp-web.js');
const { writeFile, writeFileSync, createReadStream, createWriteStream, pipe } = require('fs');
const { v4: uuidv4 } = require('uuid');
const qrcode = require('qrcode-terminal');
const { setTimeout } = require('timers');

const axios = require('axios');

const fetch = require('node-fetch');


/* Amazon API Gateway */

// End of Amazon part

// Going to be executed if there's no ./.wwebjs_auth/ created

const client = new Client({authStrategy: new LocalAuth()});

client.on('qr', (qr) => {
  qrcode.generate(qr, {small:true});
});

// Message that sucessfully connected
client.on('ready', () => {
  console.log('Client is ready');
  client.getChats().then(chats=>{
    // const chat = chats[0]
    // chat.sendMessage(MessageMedia.fromFilePath("./audio/WhatsappAudio.ogg"))
  });
});

client.on('message_create', async (msg)=> {
  // console.log("I Send a message");
  let chat = await msg.getChat();
  
  if(chat.name == "AudioBot") {
    if(msg.hasMedia) {
      // console.log("It has media");
      let name = "WhatsappAudio-"+ uuidv4()+".ogg";
      
      const media = await msg.downloadMedia();
      
      const base64data = media.data;
      const buffer = Buffer.from(base64data.replace('data:audio/ogg; codecs=opus;base64,', ''), 'base64');
      
      // Save audio 
      writeFileSync(`./audio/${name}`, buffer);
      console.log(`Wrote ${buffer.byteLength.toLocaleString()} bytes to file`)
      fetch('https://keg43ehf5h.execute-api.us-east-1.amazonaws.com/dev/audio-input-raw/'+name, {
        method: 'put',
        body: buffer
      }).then((res) =>{
        // console.log('test')
        // console.log(res);
      })

      // =====================================================================
      
      let timeToStop = false;
      var timer = 20000;
      var tries = 1;
      async function getJson(tries) {
        if(tries > 20) {
          return console.log("Failed to find the response of AWS");
        }
        await new Promise(resolve => setTimeout(resolve, 5000));
        axios({
          method: 'get',
          url: 'https://keg43ehf5h.execute-api.us-east-1.amazonaws.com/dev/transcribe-file-output/'+name+'.json',
          responseType: 'stream'
        })
        .then(function (response) {
          // Get Json from the url
          let url = 'https://keg43ehf5h.execute-api.us-east-1.amazonaws.com/dev/transcribe-file-output/'+name+'.json';
      
          let settings = { method: "Get" };
      
          fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
              // console.log(json)
              var text = json['results']['transcripts'][0]['transcript']
              console.log(`Attempt(${tries}): Succeed`)
              msg.reply(text)
              return console.log("The End")
            })
            .catch(err => {
              console.log(`Attempt(${tries}): Failed`),
              timer=-1000,
              tries++
              return getJson(tries);
            })
          });
      }
      await getJson(tries);
      }
    }
  })
client.on('disconnected', ()=>console.log("Disconnected"));
client.initialize();