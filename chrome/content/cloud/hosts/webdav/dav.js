//does not use multipart helper function because its not multipart.


Hosts.webdav = function uploadWebDAV(req, callback){
  if(!cloudSavePreference.getItem('webdav_url')){
    cloudSavePreference.setItem('webdav_url', prompt("Enter the URL of the WebDAV provider"));
  }
  if(!cloudSavePreference.getItem('webdav_url') || !/^http/.test(cloudSavePreference.getItem('webdav_url'))){
    return callback("error: invalid webdav server url");
  }
  if(!cloudSavePreference.getItem('webdav_auth')){
    cloudSavePreference.setItem('webdav_auth', "Basic "+btoa(prompt("WebDAV Username") + ":"+ prompt("WebDAV Password")));
  }


  var fs = new WebDAV.Fs(cloudSavePreference.getItem('webdav_url'));
  WebDAV.auth = cloudSavePreference.getItem('webdav_auth'); //this is a nasty hack
  getRaw(req, function(file){
    var body, raw = file.data, len = raw.length;
    if ('undefined' !== typeof BlobBuilder) {
      var arr = new Uint8Array(len);
      body = new BlobBuilder();
      for (var i = 0; i < len; arr[i] = raw.charCodeAt(i++));
      body.append(arr.buffer);
      body = body.getBlob();
    } else {
      var data = '', i;
      for (var i = 0; i < len; data += String.fromCharCode(raw.charCodeAt(i++) & 0xff));
      body = {
        data: data,
        sendAsBinary: true
      }
    }

    fs.file("/"+file.name).write(body, function(body, xhr){
      if(xhr.status >= 200 && xhr.status < 300){
        callback({url: fs.rootUrl});
        //callback("Yay I think this means it works");
      }else{
        callback("error:"+xhr.status+" "+xhr.statusText);
      }
      console.log(body);
    });
  });
  /*
  var poll = function(){
    if(dropbox.isAccessGranted()){
      getRaw(req, function(file){
        var fname =  file.name;
        var folder = ''
        
        dropbox.getAccountInfo(function(user){
        
        
        dropbox.getDirectoryMetadata(folder + encodeURIComponent(file.name), function(json){
          if(json.error && json.error.indexOf('not found') != -1){
            //yay plop it on the top
          }else if(fname.indexOf('/') == -1){
            fname = Math.random().toString(36).substr(2,4) + '_' + fname;
          }else{
            //no idea. TODO: do something
          }
       
  */
  
}
