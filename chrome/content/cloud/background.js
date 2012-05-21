window.BlobBuilder = window.BlobBuilder || window.MozBlobBuilder || window.WebKitBlobBuilder;

if (window.Blob) {
        Blob.prototype.slice = Blob.prototype.slice || function(start, length) {
                if (this.webkitSlice) {
                        return this.webkitSlice(start, start + length);
                }
                if (this.mozSlice) {
                        return this.mozSlice(start, start + length);
                }
                throw "Neither of the following methods exist: slice(), mozSlice(), webkitSlice()";
        }
}

function loginTab(loginurl, string, cb) {
  var test = function(url) {
    if ('string' === typeof string)
      return url.indexOf(string) != -1;
    else
      /* regular expression */
      return string.test(url);
  }

        if(typeof chrome != 'undefined'){
    chrome.tabs.create({
      url: loginurl
    }, function(tab){
      var poll = function(){
        chrome.tabs.get(tab.id, function(info){
          if(test(info.url)){
            cb(info.url);
            chrome.tabs.remove(tab.id);
          }else{
            setTimeout(function() { poll(); }, 500)
          }
        })
      };
      poll();
    })
  }else if(typeof tabs != 'undefined'){
    tabs.open({
      url: loginurl,
      onOpen: function(tab){
        var poll = function(){
          if(test(tab.url)){
            cb(tab.url);
            tab.close();
          }else{
            setTimeout(function() { poll(); }, 500)
          }
        };
        poll();
      }
    })
  } else if ('undefined' != typeof gBrowser) {
                var tab = gBrowser.addTab(loginurl), tbrowser = gBrowser.getBrowserForTab(tab);
                var handler = function(e) {
                        var poll = function() {
                                var url = gBrowser.currentURI.spec;
                                if (test(url)) {
                                        cb(url);
                                        gBrowser.removeTab(tab);
                                } else {
                                        setTimeout(function() { poll(); }, 500);
                                }
                        }
                        poll();
      /* the load event is triggered many many times, on both 3.* and 8.*, should I listen to another event? */
      tbrowser.removeEventListener('load', handler, true);
                };
    tbrowser.addEventListener('load', handler, true);
                gBrowser.selectedTab = tab;
        } else {
                console.log("Don't know how to open the login tab\n");
        }
}

function https(){
  if(cloudSavePreference.getItem('no_https') == 'on'){
    return 'http://'; //idk why someone would want this
  }
  return 'https://';
}

function getURL(type, request, callback, sync){
  if(request.data && sync) return request.data;

  if(request.data) return callback(request); //no need reconverting!

  if(/^data:/.test(request.url)){
    console.log('opened via data url');
    var parts = request.url.match(/^data:(.+),/)[1].split(';');
    var mime = parts[0], b64 = parts.indexOf('base64') != -1;
    var enc = request.url.substr(request.url.indexOf(',')+1);
    var data = b64 ? atob(enc) : unescape(enc);
    //data urls dont have any weird encoding issue as far as i can tell
    var name = '';
    if(request.name){
      name = request.name;
    }else{
      name = enc.substr(enc.length/2 - 6, 6) + '.' + mime.split('/')[1];
    }
    if(sync) return data;
    callback({
      data: data,
      type: mime,
      id: request.id,
      size: data.length,
      name: name, url: request.url
    });

    //callback(new dFile(data, name, mime, id, size)
  }else{

                var xhr = new XMLHttpRequest();
    xhr.addEventListener('progress', function(evt){
                downloadProgress(request.url, evt);
        }, false)

    xhr.open('GET', request.url, !sync);
    if(type == 'binary' || type == 'raw'){
      xhr.overrideMimeType('text/plain; charset=x-user-defined'); //should i loop through and do that & 0xff?
    }
    if(type == 'arraybuffer'){
        console.log('Setting Type ArrayBuffer');
                        xhr.responseType = 'arraybuffer';
                }

    if(sync){
      xhr.send();
      return xhr.responseText;
    }
    xhr.onload = function(){
      if(!request.type) request.type = xhr.getResponseHeader("Content-Type");

      console.log('opened via xhr ', request.url);
      var data = '';


      if(type == 'binary'){
        //*
        if(typeof BlobBuilder == 'undefined'){

          for(var raw = xhr.responseText, l = raw.length, i = 0, data = ''; i < l; i++) data += String.fromCharCode(raw.charCodeAt(i) & 0xff);

          callback({id: request.id, data: data, type: request.type, size: data.length, name: request.name, url: request.url});
        }else{

          var bb = new BlobBuilder();//this webworker is totally overkill
          bb.append("onmessage = function(e) { for(var raw = e.data, l = raw.length, i = 0, data = ''; i < l; i++) data += String.fromCharCode(raw.charCodeAt(i) & 0xff); postMessage(data) }");
          var url;
          if(window.createObjectURL){
            url = window.createObjectURL(bb.getBlob())
          }else if(window.createBlobURL){
            url = window.createBlobURL(bb.getBlob())
          }else if(window.URL && window.URL.createObjectURL){
            url = window.URL.createObjectURL(bb.getBlob())
          }else if(window.webkitURL && window.webkitURL.createObjectURL){
            url = window.webkitURL.createObjectURL(bb.getBlob())
          }
          var worker = new Worker(url);
          worker.onmessage = function(e) {
            var data = e.data;
            callback({id: request.id, data: data, type: request.type, size: data.length, name: request.name, url: request.url});
          };

          worker.postMessage(xhr.responseText);
        }

        //*/
      }else if(type == 'raw'){
        var data = xhr.responseText;
        callback({id: request.id, data: data, type: request.type, size: data.length, name: request.name, url: request.url});
      }else if(type == 'arraybuffer'){
        var fr = new FileReader(), bb = new BlobBuilder();
                                bb.append(xhr.response);
                                fr.addEventListener('loadend', function() {
                                        callback({
                                                id: request.id,
                                                data: fr.result,
                                                abuf: xhr.response,
                                                type: request.type,
                                                size: xhr.response.byteLength,
                                                name: request.name,
                                                url: request.url
                                        });
                                }, false);
                                fr.readAsBinaryString(bb.getBlob());
      }else{
        var raw = xhr.responseText;
        callback({id: request.id, data: raw, type: request.type, size: data.length, name: request.name, url: request.url});
      }
    }
    xhr.send();
  }
}


function getText(request, callback){
  getURL('text', request, callback);
}

function getRaw(request, callback){
  getURL('raw', request, callback);
}

function getBinary(request, callback){
  getURL('binary', request, callback);
}


function getBuffer(request, callback){
        var tmp = new XMLHttpRequest();
        var abuf = 'responseType' in tmp && 'response' in tmp;
        console.log('Testing for array bufs', abuf);
        getURL(abuf?'arraybuffer':'raw', request, function(file){
                console.log(abuf, file);
                if(abuf){
                        callback(file);
                } else if (typeof Uint8Array == 'undefined') {
      var raw = file.data, len = file.size, data = '', i;
      for (i = 0; i < len; data += String.fromCharCode(raw.charCodeAt(i++) & 0xff));
      file.data = data;
      callback(file);
    } else {
                        var bin = file.data
                  var arr = new Uint8Array(bin.length);
                  for(var i = 0, l = bin.length; i < l; i++)
                    arr[i] = bin.charCodeAt(i);
                  file.data = arr.buffer;
                  callback(file);
                }
        })
}
