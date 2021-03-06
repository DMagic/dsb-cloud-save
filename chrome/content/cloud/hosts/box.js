//box.net

Hosts.box = function uploadBox(file, callback){
  function create_folder(){
    var xhr = new XMLHttpRequest();
    var fname = applicationName;
    xhr.open('GET', 'https://www.box.net/api/1.0/rest?action=create_folder&api_key='+Keys.box+'&auth_token='+cloudSavePreference.getItem('box_auth')+'&parent_id=0&share=0&name='+fname, true);
    xhr.send();
    xhr.onload = function(){
			if(xhr.responseText.indexOf('not_logged_in') != -1){
        login(function(){
          //function inside a function (passed to another function inside a function inside a function) inside a function inside a function
          create_folder();
        });
      }else{
        var fid = xhr.responseXML.getElementsByTagName('folder_id')[0].firstChild.nodeValue;
        console.log('folder ID', fid);
        upload(fid);
      }
    }
  }
  
  
  function upload(folder){
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://upload.box.net/api/1.0/upload/'+cloudSavePreference.getItem('box_auth')+'/'+folder+'?new_copy=1');
    xhr.onload = function(){
			callback({
        url: "http://box.net/"
      });
    }
    xhr.sendMultipart({
      share: 1,
      file: file
    })
  }
  
  function login(stopforward){ //sort of opposite vaguely of callback

    function auth_token(url){
      var auth = url.match(/auth_token=([^\&]+)/)[1];
      cloudSavePreference.setItem('box_auth', auth);
      console.log(cloudSavePreference.getItem('box_auth'), cloudSavePreference.getItem('box_ticket'));
      stopforward();
    }
  
    var xhr = new XMLHttpRequest();
    xhr.open('GET', https()+'www.box.net/api/1.0/rest?action=get_ticket&api_key='+Keys.box, true);
    xhr.send();
    xhr.onload = function(){
      var ticket = xhr.responseXML.getElementsByTagName('ticket')[0].firstChild.nodeValue;
      cloudSavePreference.setItem('box_ticket', ticket);
      var redirect = https()+"www.box.net/api/1.0/auth/"+ticket;
      
      loginTab(redirect, 'auth_token', auth_token);
    }
  }
  
  create_folder()
}
