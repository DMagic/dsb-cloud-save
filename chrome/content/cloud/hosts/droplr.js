Hosts.droplr = function uploaddroplr(file, callback){
  function handshake(){
    var message = {
      action: 'https://api.twitter.com/1/account/verify_credentials.xml',
      method: "GET",
        parameters: [
          	["oauth_consumer_key", Keys.twitter.key],
          	["oauth_signature_method", "HMAC-SHA1"],
          	["oauth_token", cloudSavePreference.getItem('twitter_token')]
      	]
    };

    // Define the accessor
    var accessor = {
      consumerSecret: Keys.twitter.secret,
      tokenSecret: cloudSavePreference.getItem('twitter_secret')
    };
    OAuth.setTimestampAndNonce(message);
    OAuth.SignatureMethod.sign(message, accessor);
    var auth = OAuth.getAuthorizationHeader("http://api.twitter.com/", message.parameters);
    
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://api2.droplr.com/handshake.php");  
    xhr.setRequestHeader('X-Verify-Credentials-Authorization', auth);
    xhr.setRequestHeader('X-Auth-Service-Provider', 'https://api.twitter.com/1/account/verify_credentials.xml');
    xhr.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");
    xhr.onload = function(){
      console.log(xhr);
      cloudSavePreference.setItem('droplr_key', xhr.responseText.substr(2));
      //droplr API key = xhr.responseText.substr(2);
      core_upload();
    }
    xhr.onerror = function(){
      callback('error: could not acquire droplr api key')
    }
    xhr.send("source_name=drag2up");
  }
  function core_upload(){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://api2.droplr.com/put-post.php");  
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa("drag2up" + ":" + cloudSavePreference.getItem('droplr_key')));
    xhr.onload = function(){
      console.log(xhr,'droplr done');
      var data = xhr.responseText.split('|');

      var gd = new XMLHttpRequest();
      gd.open('GET', data[2], true);
      gd.onload = function(){
        var direct = gd.responseText.match(/http.*?files\.droplr\.com\/files\/\d+\/[^\"]+/)[0];
        callback({
          url: data[2],
          direct: direct
        });
      }
      gd.send();
    }
    xhr.onerror = function(){
      callback('error: droplr uploading failed')
    }
    xhr.sendMultipart({
      uploaded: file
    });
  }
  if(cloudSavePreference.getItem('twitter_token') && cloudSavePreference.getItem('twitter_secret')){
    if(cloudSavePreference.getItem('droplr_key')){
      core_upload();
    }else{
      handshake();
    }
  }else{
    twitter_login(handshake);
  }
}

