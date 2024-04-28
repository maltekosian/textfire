var FileSystem = (
function (window) {
	var FileSystem = window;
	FileSystem.fs = null;
	
	FileSystem.readFile = function (filepath, callback) { 
		//->log success, callback or error, return via callback
		fs.root.getFile(filepath, {}, function(fileEntry) {
			// Get a File object representing the file,
			// then use FileReader to read its contents.
			fileEntry.file(function(file) {
				var reader = new FileReader();
				reader.onloadend = function(e) {         
					callback(e.target.result);
				};
				reader.readAsText(file);
			}, FileSystem.errorCallback);
		}, FileSystem.errorCallback);
	};

	FileSystem.getFileUrl = function (filepath, callback) { 
		fs.root.getFile(filepath, {}, function(fileEntry) {
			// Get a File object representing the file,
			// then use FileReader to read its contents.
			fileEntry.file(function(file) {
				var reader = new FileReader();
				reader.onloadend = function(e) {         
					callback(e.target.result);
				};
				reader.readAsDataUrl(file);
			}, FileSystem.errorCallback);
			/*callback(fileEntry.toURL());*/
		}, FileSystem.errorCallback);
	}

	FileSystem.writeFile = function (filepath, data) {
		// ->log success or error
		fs.root.getFile(filepath, {create: true}, function(fileEntry) {
			// Create a FileWriter object for our FileEntry .
			fileEntry.createWriter(function(fileWriter) {

				fileWriter.onwriteend = function(e) {
					console.log('Write completed. '+filepath);
				};

				fileWriter.onerror = function(e) {
					console.log('Write failed: ' + e.toString() +' file -> '+ filepath);
				};
				// Create a new Blob and write it to log.txt.
				var bb = new BlobBuilder(); // Note: window.WebKitBlobBuilder in Chrome 12.
				bb.append(data);
				fileWriter.write(bb.getBlob('text/plain'));
			}, FileSystem.errorCallback);
		}, FileSystem.errorCallback);
	};

	FileSystem.deleteFile = function (filepath) { 
		//->log success or error
		fs.root.getFile(filepath, {create: false}, function(fileEntry) {
			fileEntry.remove(function() {
				console.log('File removed.');
			}, FileSystem.errorCallback);
		}, FileSystem.errorCallback);
	};


	FileSystem.listDirectory = function (filepath, callback) {
		//->log success, callback or error, return via callback
		fs.root.getDirectory(filepath, {create: true, exclusive: false}, 
		function(dirEntry) {
			var dirReader = dirEntry.createReader();
			dirReader.readEntries(function(entries) {
				var	filelist = [];
				for (var i = 0, entry; entry = entries[i]; ++i) {
					var kv = {};
					kv.key = entry.name;
					kv.value = entry;
					kv.type = entry.isDirectory ? 'folder' : 'file';
					filelist.push( kv );
				}
				callback(filelist);
			 }, FileSystem.errorCallback);
		}, FileSystem.errorCallback);
	};

	FileSystem.deleteDirectory = function (filepath) { 
		//->log success or error
		fs.root.getDirectory(filepath, {create: false, exclusive: false}, FileSystem.deleteDir, FileSystem.errorCallback);
	}

	FileSystem.deleteDir = function (dirEntry) {
		var dirReader = dirEntry.createReader();
		dirReader.readEntries(function(entries) {
			for (var i = 0, entry; entry = entries[i]; ++i) {
				if (entry.isDirectory) {
					entry.removeRecursively(function() {}, FileSystem.errorCallback);
				} else {
					entry.remove(function() {}, FileSystem.errorCallback);
				}
			}
		}, FileSystem.errorCallback);
	};

	FileSystem.createDirectory = function (filepath) {
		FileSystem.createDir(fs.root, filepath.split('/'));
	}

	FileSystem.createDir = function (rootDirEntry, folders) {
		//->log success or error
		// Throw out './' or '/' and move on to prevent something like '/foo/.//bar'.
		if (folders[0] == '.' || folders[0] == '') {
			folders = folders.slice(1);
		}
		rootDirEntry.getDirectory(folders[0], {create: true}, function(dirEntry) {
			// Recursively add the new subfolder (if we still have another to create).
			if (folders.length) {
				FileSystem.createDir(dirEntry, folders.slice(1));
			}
		}, FileSystem.errorCallback);
	};



	FileSystem.successCallback = function (fileSystem) {
		fs = fileSystem;

		/*var path = ['slideshow/project/mediamanager/','slideshow/project/dialogmanager/','slideshow/project/image/','slideshow/project/uidCounter/','slideshow/project/language/','slideshow/project/slide/','slideshow/project/selection/','slideshow/savegames/'];
		for (var i = 0; i < path.length; i++)
		{
			FileSystem.createDirectory(fs.root, path[i].split('/')); // fs.root is a DirectoryEntry.
		}*/
		try
		{
			console.log('fs.name -> '+fs.name);
			console.log('fs.root.name -> '+fs.root.name);
		}
		catch (e)
		{
			console.log('FileSystem.onFileSystemSuccess -> '+e);
		}
    }

	FileSystem.errorCallback = function() {
		var msg = '';

		switch (e.code) {
			case FileError.QUOTA_EXCEEDED_ERR:
			  msg = 'QUOTA_EXCEEDED_ERR';
			  break;
			case FileError.NOT_FOUND_ERR:
			  msg = 'NOT_FOUND_ERR';
			  break;
			case FileError.SECURITY_ERR:
			  msg = 'SECURITY_ERR';
			  break;
			case FileError.INVALID_MODIFICATION_ERR:
			  msg = 'INVALID_MODIFICATION_ERR';
			  break;
			case FileError.INVALID_STATE_ERR:
			  msg = 'INVALID_STATE_ERR';
			  break;
			default:
			  msg = 'Unknown Error';
			  break;
		};
		console.log('Error: ' + msg);
	}

	FileSystem.fsinit = function() {
		if (!isDevice)
		{
			window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem || window.mozRequestFileSystem || window.msRequestFileSystem || window.oRequestFileSystem;
			try
			{
				window.requestFileSystem(window.PERSISTENT, 1024*1024*1024, FileSystem.successCallback, errorCallback);
			}
			catch (er)
			{
				window.storageInfo = window.storageInfo || window.webkitStorageInfo || window.mozStorageInfo || window.msStorageInfo || window.oStorageInfo;
				window.storageInfo.requestQuota(window.PERSISTENT, 1024*1024*1024, function(grantedBytes) {
					window.requestFileSystem(PERSISTENT, grantedBytes, FileSystem.successCallback, FileSystem.errorCallback);
				}, function(e) { console.log('Error', e); } );
			}

		} else {
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 1024*1024*1024, FileSystem.successCallback, FileSystem.errorCallback);
		}
	}

	return FileSystem;
}
)(window);
