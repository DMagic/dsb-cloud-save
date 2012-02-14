//no https
//user requested!

//var minusGallery = {};

Hosts.minus = function uploadMinus(file, callback) {
  /* get or refresh access token */
  var refresh_token = function(post_data, cb_func) {
    $.ajax({
      type: 'POST', dataType: 'text', cache: false,
      url: 'https://minus.com/oauth/token',
      data: post_data,
      error: function(xhr, status, ex) {
        var err;
        try {
          err = JSON.parse(xhr.responseText);
        } catch (e) {
          callback('error: Authentication failed, please make sure the username and password you provided are valid.');
          return;
        }

        if (token && -1 != err.error_description.indexOf(token)) {
          /* No such refresh token error, go through the authentication process all over again */
          cloudSavePreference.removeItem('minus_refresh');
          uploadMinus(file, callback);
        } else {
          callback('error: ' + err.error_description);
        }
      },
      success: function(resp, status, xhr) {
        try {
          resp = JSON.parse(resp);
          status = resp.access_token && resp.refresh_token;
        } catch (ex) {
          status = false;
        }
        if (!status) {
          callback('error: Failed to parse access token.');
          return;
        }
        cloudSavePreference.setItem('minus_refresh', token = resp.refresh_token);
        cb_func(resp);
      }
    });
  };

  /* get Download Statusbar folder, create one if it doesn't exist */
  var get_folder = function(key, cb_func) {
    /* get user slug, it's part of the folder listing URL */
    $.ajax({
      type: 'GET', dataType: 'text', cache: false,
      url: 'https://minus.com/api/v2/activeuser',
      data: { bearer_token: key },
      error: function(xhr) {
        try {
          callback('error: ' + JSON.parse(xhr.responseText).error_description);
        } catch (ex) {
          callback('error: Failed to get user info.');
        }
      },
      success: function(resp) {
        /* this function iterates over all user folders to look for the Download Statusbar folder */
        var search = function(slug, next, cb_func) {
          $.ajax({
            type: 'GET', dataType: 'text', cache: false,
            url: next ? next : 'https://minus.com/api/v2/users/' + slug + '/folders',
            data: { bearer_token: key },
            error: function(xhr) {
              try {
                callback('error: ' + JSON.parse(xhr.responseText).error_description);
              } catch (ex) {
                callback('error: Failed to list folders.');
              }
            },
            success: function(resp) {
              try {
                resp = JSON.parse(resp);
              } catch (e) {
                callback('error: Failed to parse folder info.');
                return;
              }

              var k, folders = resp.results;
              for (k in folders) {
                if (applicationName == folders[k].name) {
                  /* found Download Statusbar folder */
                  cb_func(folders[k]);
                  return;
                }
              }

              /* not found */
              if (resp.next) {
                /* next page exists */
                search(slug, resp.next, cb_func);
              } else {
                /* folder doesn't exist, create one */
                $.ajax({
                  type: 'POST', dataType: 'text', cache: false,
                  url: 'https://minus.com/api/v2/users/' + slug + '/folders',
                  data: {
                    name: applicationName,
                    is_public: false,
                    bearer_token: key
                  },
                  error: function(xhr) {
                    try {
                      callback('error: ' + JSON.parse(xhr.responseText).error_description);
                    } catch (ex) {
                      callback('error: Failed to create folder.');
                    }
                  },
                  success: function(resp) {
                    try {
                      resp = JSON.parse(resp);
                    } catch (e) {
                      callback('error: Failed to parse folder info.');
                      return;
                    }
                    cb_func(resp);
                  }
                });
              }
            }
          });
        };

        var slug;

        try {
          slug = JSON.parse(resp).slug;
        } catch (e) {
          callback('error: Failed to parse user info.');
          return;
        }

        search(slug, null, cb_func);
      }
    });
  };

  /* upload file */
  var upload = function(key, folder_id, cb_func) {
    var xhr = new XMLHttpRequest();

    xhr.onerror = function() {
      try {
        callback('error: ' + JSON.parse(xhr.responseText).error_description);
      } catch (ex) {
        callback('error: Minus.com uploading failed.');
      }
    }

    xhr.onload = function() {
      try {
        cb_func(JSON.parse(xhr.responseText));
      } catch (e) {
        callback('error: Uploading may have succeeded, but the file info is unrecognized.');
      }
    }

    xhr.open("POST", "https://minus.com/api/v2/folders/" + folder_id + "/files?bearer_token=" + key);

    xhr.sendMultipart({
      filename: file.name || 'Untitled File',
      caption: file.name || 'Untitled File',
      file: file
    });
  };


  var token = cloudSavePreference.getItem('minus_refresh'),
    data = {
      client_id: Keys.minus.key,
      client_secret: Keys.minus.secret,
      scope: 'read_all upload_new'
    };

  if (!token) {
    var user, pswd;
    do {
      user = prompt('Please enter your Minus.com username.');
      pswd = prompt('Please enter your Minus.com password.\n(' + applicationName + ' won\'t save your password)');
    } while ((!user || !pswd) && (alert('Minus.com requires username and password to upload files') || true));

    $.extend(data, {
      grant_type: 'password',
      username: user,
      password: pswd
    });
  } else {
    $.extend(data, {
      grant_type: 'refresh_token',
      refresh_token: token
    });
  }

  /* get or refresh token */
  refresh_token(data, function(auth) {
    /* get folder id */
    get_folder(auth.access_token, function(folder) {
      /* upload file */
      upload(auth.access_token, folder.id, function(info) {
        callback({ url: info.url_rawfile });
      });
    });
  });
}


/********
 * Below is the old version
*********/


//var minusGallery = {};

Hosts.minus_old = function uploadMinus(file, callback) {
  function newGallery(cb){
    minusGallery.obsolete = true;
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://min.us/api/CreateGallery", true);
    xhr.onload = function(){
      var info = JSON.parse(xhr.responseText);
      info.time = +new Date;
      minusGallery = info;
      console.log(info);
      cb();
    }
    xhr.onerror = function(){
      callback('error: min.us could not create gallery')
    }
    xhr.send();
  }
  
  function upload(){
    minusGallery.time = +new Date;
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://min.us/api/UploadItem?editor_id="+minusGallery.editor_id+"&filename="+(file.name||'unknown.file'));  
    xhr.onload = function(){
      var info = JSON.parse(xhr.responseText);
      //console.log(xhr.responseText);
      var x = new XMLHttpRequest();
      x.open('GET', 'http://min.us/api/GetItems/m'+minusGallery.reader_id, true);
      x.onload = function(){
        var j = JSON.parse(x.responseText).ITEMS_GALLERY
        var filepos = "";
        for(var i = 0; i < j.length; i++){
          if(j[i].indexOf(info.id) != -1){
            filepos = j[i];
            i++; //increment by one as counter starts at one
            break;
          }
        }
        callback({
          url: 'http://min.us/m'+minusGallery.reader_id+'#'+i,
          direct: filepos
        });
      }
      setTimeout(function(){
        x.send()
      }, 100);
    }
    xhr.onerror = function(){
      callback('error: min.us uploading failed')
    }
    xhr.sendMultipart({
      "file": file
    })
  }
  
  if(minusGallery.time && minusGallery.time > (+new Date) - (1000 * 60 * 10)){
    //keep uploading to the same gallery until 10 minutes of inactivity
    upload();
  }else if(minusGallery.obsolete){
    //when somethings outdated theres a potential race condition
    (function(){
      if(minusGallery.obsolete){
        setTimeout(arguments.callee, 100);
      }else{
        upload()
      }
    })()
  }else{
    newGallery(upload)
  }
}
