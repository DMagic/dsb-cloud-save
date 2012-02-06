/* droplr 2.0 */
Hosts.droplr = function uploaddroplr(file, callback) {
  var onerror = function(msg) {
    console.log(msg);
    callback('error: Upload failed');
  }
  /* droplr gives error message in response headers */
  var geterrmsg = function(xhr) {
    return xhr.getResponseHeader('x-droplr-errordetails') || xhr.getResponseHeader('x-droplr-errorcode');
  }
  var xhr = new XMLHttpRequest();
  var error;

  /* test login status */
  xhr.open("GET", "https://droplr.com/account");
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.onerror = onerror;
  xhr.onload = function() {
    if (200 != xhr.status) {
      /* not logged in */
      loginTab('https://droplr.com/login', /^https:\/\/droplr.com\/?$/, function() {
        uploaddroplr(file, callback);
      });
    } else {
      /* logged in */
      console.log("Logged into droplr as: %s", JSON.parse(xhr.responseText).email);
      /* get authgen */
      xhr = new XMLHttpRequest();
      xhr.open("GET", "https://droplr.com/");
      xhr.onerror = onerror;
      xhr.onload = function() {
        if (error = geterrmsg(xhr)) {
          callback('error:' + error);
          return;
        }

        var token = xhr.responseText.match('authToken\s*=\s*"([^"]+)"')[1];
        var stamp = new Date().getTime();

        getBuffer(file, function(file) {
          var mime = file.type || 'application/octet-stream';

          xhr = new XMLHttpRequest();
          xhr.open("POST", "https://droplr.com/authgen");
          xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
          xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          xhr.onerror = onerror;
          xhr.onload = function() {
            if (error = geterrmsg(xhr)) {
              callback('error:' + error);
              return;
            }

            var resp = JSON.parse(xhr.responseText);
            if (resp.loggedIn) {
              /* access granted */
              xhr = new XMLHttpRequest();
              xhr.open('POST', 'http://api.droplr.com:8080/files.json');
              xhr.setRequestHeader('Authorization', resp.header);
              //xhr.setRequestHeader('Origin', 'https://droplr.com');
              xhr.setRequestHeader('Content-Type', mime);
              xhr.setRequestHeader('x-droplr-date', stamp);
              xhr.setRequestHeader('x-droplr-filename', btoa(file.name));
              xhr.onerror = onerror;
              xhr.upload.addEventListener('progress', function(evt){
                uploadProgress(file.url, evt);
              }, false);

              xhr.onload = function() {
                if (error = geterrmsg(xhr)) {
                  callback('error:' + error);
                  return;
                }

                var resp = JSON.parse(xhr.responseText);
                callback({url: resp.shortlink || 'https://droplr.com'});
              }

              if ('undefined' !== typeof BlobBuilder) {
                var builder = new BlobBuilder();
                builder.append(file.abuf);
                xhr.send(builder.getBlob(file.type));
              } else {
                xhr.sendAsBinary(file.data);
              }
            } else {
              callback('error:Failed to get authentication token');
            }
          }
          xhr.send('contentType=' + mime + '&date=' + stamp + '&authToken=' + token);
        });
      }
      xhr.send();
    }
  }
  xhr.send();
}


/* droplr 1.0, using twitter credentials */
Hosts.droplr1 = function uploaddroplr1(file, callback){
  function handshake(){
    var message = {
      action: 'https://api.twitter.com/1/account/verify_credentials.xml',
      method: "GET",
        parameters: [
            ["oauth_consumer_key", Keys.twitter.key],
            ["oauth_signature_method", "HMAC-SHA1"],
            ["oauth_token", localStorage.twitter_token]
        ]
    };

    // Define the accessor
    var accessor = {
      consumerSecret: Keys.twitter.secret,
      tokenSecret: localStorage.twitter_secret
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
      localStorage.droplr_key = xhr.responseText.substr(2);
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
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa("drag2up" + ":" + localStorage.droplr_key));
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
  if(localStorage.twitter_token && localStorage.twitter_secret){
    if(localStorage.droplr_key){
      core_upload();
    }else{
      handshake();
    }
  }else{
    twitter_login(handshake);
  }
}

