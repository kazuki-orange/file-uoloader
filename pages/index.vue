<template>
    <v-container>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-file-input
          v-model="file"
          label="ファイルを選択"
          prepend-icon="mdi-file"
          required
        ></v-file-input>
        <v-btn :disabled="!file" @click="submitFile">アップロード</v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const valid = ref(true)
  const file = ref(null)

  import fs from 'fs'
  import path from 'path'
  import mime from 'mime'
  import { google } from 'googleapis'

  const googleAuth = () => {
    const CREDENTIALS_PATH = 'credentials.json';
    const TOKEN_PATH = 'token.json';  
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    const token = JSON.parse(fs.readFileSync(TOKEN_PATH, 'utf8'));
    
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token);
    
    return oAuth2Client;
  }
  const auth = googleAuth();
  
  // LIFFの初期化
  onMounted(async () => {
    initializeLiff('2006502464-L4MNkxrX');
  })
  
  // ファイルを送信するメソッド
  const submitFile = async () => {
    if (!file.value) {
      try {
        const drive = google.drive({version: 'v3', auth});
        const folderId = 'root';

        const mimeType = mime.getType(file);
        const params = {
          resource: {
              name: path.basename(file),
              parents: [folderId]
          },
          media: {
              mimeType: mimeType,
              body: fs.createReadStream(file),
          },
          fields: 'id, name'
        };

        const res = await drive.files.create(params);
        console.log(res.data.name, res.data.id);
        alert(`【${file}】 ファイルがアップロードされました！`);
      } catch (error) {
        alert('アップロードに失敗しました');
      }
    }
  }
    // if (!file.value) return
  
    // //const user = await liff.getProfile()
    // const formData = new FormData()
    // formData.append('file', file.value)
    // //formData.append('userName', user.displayName)
    // formData.append('userName', 'test')
    
  
    // try {
    //   await fetch('https://script.google.com/macros/s/AKfycbwZDORYgQIGYKcpdsNh99-f1jcQ7zQJsw6wETja1a0Wce2CzaaGk03da2SmbhxPIqyq/exec', {
    //     method: 'POST',
    //     body: formData,
    //     mode: 'cors', // CORSを有効にする
    //   })
    //   alert(`【${file}】 ファイルがアップロードされました！`)
    //   //sendMessages(`【${file}】 ファイルがアップロードされました！`);
    // } catch (error) {
    //   alert('アップロードに失敗しました')
    // }
  // }

  function initializeLiff(liffId) {
    const liffSDKUrl = 'https://static.line-scdn.net/liff/edge/2/sdk.js';
    const script = document.createElement('script');
    script.src = liffSDKUrl;
    script.onload = () => {
        liff.init({ liffId: liffId })
        .then(() => {
            console.log('LIFF initialized successfully');
            initializeApp(); // 初期化が成功した後にアプリを開始
        })
        .catch((err) => {
            console.log('LIFF Initialization failed ', err);
        });
    };
    document.body.appendChild(script);
  }


  function initializeApp(){
      liff.getProfile().then(profile => {
          console.log('User profile:', profile);
      }).catch((err) => {
          console.log('Failed to get profile', err);
      });

  }

  function sendMessages(message) {
      liff.sendMessages([{
          type: 'text',
          text: message
      }]).then(function() {
          liff.closeWindow();
      }).catch(function(error) {
          console.error(error);
      });
  }

  </script>
  