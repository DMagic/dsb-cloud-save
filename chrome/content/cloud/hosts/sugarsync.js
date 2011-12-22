Hosts.sugarsync = function uploadsugarsync(req, callback){
	function login(){
		var user = prompt('Enter SugarSync Username (Email)');
		var pass = prompt('Enter SugarSync Password');
		if(!user || !pass) return callback('error: no sugarsync credentials entered');	
		cloudSavePreference.setItem('sugarsync_user', user);
		cloudSavePreference.setItem('sugarsync_pass', pass); //too bad their auth things expire. i cant just store that :(
		
	}
	function auth(cb){
		console.log('Authorizing');
		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'https://api.sugarsync.com/authorization', true);
		/* explicit content type is required by Firefox */
		xhr.setRequestHeader('Content-type', 'application/xml');
		xhr.onload = function(){
			if(xhr.status == 401){
				if(confirm('Invalid Username/Password Combination! Try again?')){
					login();
					auth(cb);
				}
				return
			}
			cloudSavePreference.setItem('sugarsync_auth', xhr.getResponseHeader('location'));
			getFolder(function(){
				if(cb) cb();
			})
		}
		xhr.send('<?xml version="1.0" encoding="UTF-8" ?><authRequest><username>'+cloudSavePreference.getItem('sugarsync_user')+'</username><password>'+cloudSavePreference.getItem('sugarsync_pass')+'</password><accessKeyId>'+Keys.sugarsync.key+'</accessKeyId><privateAccessKey>'+Keys.sugarsync.secret+'</privateAccessKey></authRequest>');
	}
	
	
	function getFolder(cb){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', 'https://api.sugarsync.com/user', true);
		xhr.onload = function(){
			var ref = xhr.responseXML.getElementsByTagName('magicBriefcase')[0].textContent;
			cloudSavePreference.setItem('sugarsync_folder', ref);
			cb();
		}
		xhr.setRequestHeader('Authorization', cloudSavePreference.getItem('sugarsync_auth'));
		xhr.send(null);
	}
	
	function upload(ref){
		getBuffer(req, function(file){
			var builder;
			if ('undefined' !== typeof BlobBuilder) {
				builder = new BlobBuilder();
				builder.append(file.abuf);
				builder = builder.getBlob(file.type);
			} else {
				builder = {
					data: file.data,
					sendAsBinary: true
				}
			}
			var xhr = new XMLHttpRequest();

			xhr.open('PUT', ref+'/data', true);
			xhr.setRequestHeader('Authorization', cloudSavePreference.getItem('sugarsync_auth'));
			 xhr.upload.addEventListener('progress', function(evt){
				uploadProgress(file.url, evt);
			}, false)
			xhr.onload = function(){
				callback({
					url: 'https://sugarsync.com/'
				})
			}

			if (builder && builder.sendAsBinary && xhr.sendAsBinary)
				xhr.sendAsBinary(builder.data);
			else
				xhr.send(builder);
		});
	}

	function find_file(file){
		var xhr = new XMLHttpRequest();
		xhr.open('GET', cloudSavePreference.getItem('sugarsync_folder') + '/contents', true);
		xhr.onload = function(){
			var ref = '';
			for(var el = xhr.responseXML.getElementsByTagName('file'), i = 0; i < el.length; i++){
			 if(el[i].firstChild.textContent == file.name) ref = el[i].childNodes[1].textContent;
			}
			upload(ref);
		}
		xhr.setRequestHeader('Authorization', cloudSavePreference.getItem('sugarsync_auth'));
		xhr.send(null);
	}
	
	function create(file){
		var xhr = new XMLHttpRequest();
		xhr.open('POST', cloudSavePreference.getItem('sugarsync_folder'), true);
		xhr.setRequestHeader('Content-type', 'application/xml');
		xhr.onload = function(){
			console.log('created file');
			//if(xhr.status == 401) return auth(function(){create(file)});
			find_file(file);
		}
		xhr.setRequestHeader('Authorization', cloudSavePreference.getItem('sugarsync_auth'));
		xhr.send('<?xml version="1.0" encoding="UTF-8" ?><file><displayName>'+file.name+'</displayName><mediaType>'+file.type+'</mediaType></file>');
	}
	auth(function(){
		create(req);
	})
}
