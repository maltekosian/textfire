var WebStorage = (
function (window) {
	var WebStorage = window;
	WebStorage.db = null;
	// Now we can open our database
	WebStorage.dbName = 'the_name';
	WebStorage.version = 0;

	if (typeof window.openDatabase === 'function')
    {
		console.log('use websql');

		WebStorage.updateDataBase = function (tx) {
			tx.executeSql('DROP TABLES');//gshogs.com
			try {
			for (var i = 0; i < objectStoreNames.length; i++) {
				tx.executeSql('DROP TABLES');// IF EXISTS '+objectStoreNames[i]);
				//CREATE TABLE IF NOT EXISTS tasks (id REAL UNIQUE, text TEXT)
				var data_keys = 'uid REAL UNIQUE, data';
				var _object = data[objectStoreNames[i]][data[objectStoreNames[i]].length - 1];
				for (var key in _object) {
					data_keys = data_keys+','+key;
				}
				var sql = 'CREATE TABLE IF NOT EXISTS '+objectStoreNames[i]+' ('+data_keys+')';
				console.log('updateDataBase -> '+sql);
				tx.executeSql(sql);
				for (var j in data[objectStoreNames[i]]) {
					addData(objectStoreNames[i],data[objectStoreNames[i]][j]);
				}
			}
			} catch(e) {}
		}

		/**
		@desc
		Query the database
		 @deprecated
		 @experimental
		*/
		WebStorage.queryDB = function (objectStoreName, callback) {
			//console.log('queryDB '+objectStoreName+' '+callback.constructor.toString());
			db.transaction(function(tx) {
				var sql = 'SELECT * FROM '+objectStoreName;
				console.log('queryDB -> '+sql);
				tx.executeSql(sql, [], function (tx, results) { querySuccess(tx, results, callback); }, function() { callback(false); } );
			});
		}

		/**
		@desc
		Query the success callback
		 @deprecated
		 @experimental
		*/
		WebStorage.querySuccess = function (tx, results, callback) {
			console.log('querySuccess ');
			callback( (results.rows.length > 0) );
		}

		WebStorage.getDataByUid = function(objectStoreName, uid, callback) {
			db.transaction(function(tx) {
				var sql = 'SELECT * FROM '+objectStoreName+' WHERE uid="'+uid+'"';
				console.log('getDataByUid -> '+sql);
				tx.executeSql(sql, [], function (tx, results) {returnDataByUid(tx, results, objectStoreName, callback); }, errorCB);
			});
		}

		WebStorage.returnDataByUid = function(tx, results, objectStoreName, callback) {
			var data = results.rows.item(0);
			data.data = JSON.parse(data.data);
			callback(objectStoreName, '', data);
		}

		WebStorage.showData = function (objectStoreName, uid, data) {
			if (data == null)
			{
				getDataByUid(objectStoreName, uid, showData);
				return;
			}
			alert('name for ssn '+data.ssn+' is '+data.name);
		}

		WebStorage.getAllData = function (objectStoreName, datas, callback) {
			//var out = document.getElementById('output');
			//out.innerHTML = '';
			if (datas == null)
			{
				datas = [];
				db.transaction(function(tx) {
					var sql = 'SELECT * FROM '+objectStoreName;
					console.log('getAllData transaction -> \n'+sql);
					tx.executeSql(sql, [], function (tx, results) {returnAllData(tx, results, objectStoreName, callback); }, function () {callback( objectStoreName, datas );} );
				});
			} else {
				return datas;
			}
		}

		WebStorage.returnAllData = function (tx, results, objectStoreName, callback) {
			var len = results.rows.length;
			var item = null;
			var datas = [];
			for (var i = 0; i < len; i++) {
				item = results.rows.item(i);
				datas[i] = item; //JSON.parse(item.data);
				datas[i].data = JSON.parse(item.data);
			}
			console.log(''+objectStoreName);
			callback( objectStoreName, datas );
			//return datas;
		}

		WebStorage.showAllData = function (objectStoreName, datas) {
			if (datas == null)
			{
				getAllData(objectStoreName, datas, showAllData);
				return;
			}
			document.getElementById('output').innerHTML = '';
			for (var i = 0; i < datas.length; i++)
			{
				document.getElementById('output').innerHTML = document.getElementById('output').innerHTML+'<br />'+'Name for SSN ' + datas[i].ssn + ' is ' + datas[i].name;
			}
		}

		WebStorage.addData = function (objectStoreName, _object) {
			var value_keys = 'uid,data';
			var value_marks = '?,?';
			var value_key_marks = 'data = ?'
			var value_array = [];
			var value_up_array = [];
			var i = 0;
			for (var key in _object) {
				if (i == 0)
				{
					value_array[0] = _object['uid'];
					value_array[1] = JSON.stringify(_object);
					value_up_array[0] = value_array[1];
				}
				i++;
				if (key != 'uid')
				{
					value_marks = value_marks+',?';
					value_keys = value_keys+','+key;
					value_key_marks = value_key_marks+','+key+' = ?';
					value_array[value_array.length] = _object[key];
					value_up_array[value_up_array.length] = _object[key];
				}
			}

			db.transaction(function(tx) {
				var sql = 'CREATE TABLE IF NOT EXISTS '+objectStoreName+' ('+value_keys+')';
				console.log('addData.updateDataBase -> '+sql);
				tx.executeSql(sql);
				var sql = 'SELECT uid FROM '+objectStoreName+' WHERE uid = "'+_object.uid+'"';
				console.log('addData.select -> '+sql);
				tx.executeSql(sql, [], function (tx, results) {
					var _sql = '';
					var v_a = [];
					if (results.rows.length > 0)
					{
						_sql = 'UPDATE '+objectStoreName+' SET '+value_key_marks+' WHERE uid ="'+_object.uid+'"';
						v_a = value_up_array;
					} else {
						_sql = 'INSERT INTO '+objectStoreName+' ('+value_keys+') values ('+value_marks+')';
						v_a = value_array;
					}
					console.log('addData -> ' + _sql);
					tx.executeSql(_sql, v_a);
				}, errorCB);

				//tx.executeSql('INSERT INTO '+objectStoreName+' (uid, data) values (?,?)', value_array);
			}, errorCB, successCB);
		}

		WebStorage.deleteData = function (objectStoreName, uid) {
			db.transaction(function(tx) {
				tx.executeSql('DELETE FROM '+objectStoreName+' WHERE uid=?', [uid]);
			}, errorCB, successCB);
		}

		WebStorage.getIndex = function (objectStoreName, _index, index_key, callback) {
			db.transaction(function(tx) {
				var sql = 'SELECT * FROM '+objectStoreName+' WHERE '+_index+'="'+index_key+'"';
				console.log('getIndex -> '+sql);
				tx.executeSql(sql, [], function (tx, results) {
					returnIndex(tx, results, objectStoreName, callback, _index);
				});
			}, errorCB);
		}

		WebStorage.returnIndex = function (tx, results, objectStoreName, callback, _index) {
			var len = results.rows.length;
			var item = null;
			var datas = [];
			for (var i = 0; i < len; i++) {
				item = results.rows.item(i);
				datas[i] = item;//JSON.parse(item.data);
				datas[i].data = JSON.parse(item.data);
			}

			callback(objectStoreName, _index, '', datas);
		}

		WebStorage.showIndex = function (objectStoreName, _index, index_key, datas) {
			if (datas == null)
			{
				getIndex(objectStoreName, _index, index_key, showIndex);
				return;
			}
			for (var i = 0; i < datas.length; i++)
			{
				document.getElementById('output').innerHTML = document.getElementById('output').innerHTML+'<br />'+  datas[i].name +' is in partnership ' + datas[i][_index];
			}

		}
		// Transaction error callback
		//
		WebStorage.errorCB = function (err) {
			if (err != null)
			{
			console.log("Error processing SQL: "+err.code);
			}
		}

		// Transaction success callback
		//
		WebStorage.successCB = function () {
			//var db = window.openDatabase("Database", "1.0", "Cordova Demo", 200000);
			//db.transaction(queryDB, errorCB);
		}

		WebStorage.wsinit = function() {
			try
			{
				WebStorage.db = window.openDatabase(''+WebStorage.dbName, ''+WebStorage.version, ''+WebStorage.dbName, 2 * 1024 * 1024 * 1024);
				db.transaction(updateDataBase, errorCB, successCB);
			}
			catch (ex)
			{
				WebStorage.versionUpdate(WebStorage.version - 1);
			}
		}

		WebStorage.versionUpdate = function(i) {
			try
			{
				if (i < 0)
				{
					i = '';
				}
				WebStorage.db = window.openDatabase(''+WebStorage.dbName, ''+i, ''+WebStorage.dbName, 2 * 1024 * 1024 * 1024);
				db.changeVersion(''+i, ''+WebStorage.version, function(t){});
				db.transaction(updateDataBase, errorCB, successCB);
			}
			catch (ex)
			{
				i--;
				WebStorage.versionUpdate(i);
			}
		}

	/*    return WebStorage;
	)(window);
	var indexedDB = (
	function (window) {
		var WebStorage = window;*/
	}
	else
	{
	console.log('use indexedDB');
	// This will improve our code to be more readable and shorter
	var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
	window.indexedDB = indexedDB;

	//WebStorage.db = null;
	// Now we can open our database
	//WebStorage.dbName = 'the_name';
	//WebStorage.version = 3;
	WebStorage.wsinit = function() {
		WebStorage.request = indexedDB.open(WebStorage.dbName, WebStorage.version);

		WebStorage.request.onerror = function(event) {
		  alert('Why didn\'t you allow my web app to use IndexedDB?!');
		};

		WebStorage.request.onsuccess = function(event) {
			WebStorage.db = WebStorage.request.result;//event.result //?
			alert('Database '+WebStorage.db.version+' '+WebStorage.db.name);
			WebStorage.db.onerror = function(event) {
			// Generic error handler for all errors targeted at this database's
			// requests!
				alert('Database error: ' + event.target.errorCode);
			};
			if (typeof WebStorage.db.setVersion === 'function')
			{
				if (WebStorage.db.version == WebStorage.version)
				{
					//do nothing
					return;
				}
				alert('Database set version');
				var setVrequest = WebStorage.db.setVersion(WebStorage.version);
				console.log('db version set to '+WebStorage.db.version+' '+WebStorage.version);
					// onsuccess is the only place we can create Object Stores
				setVrequest.onfailure = WebStorage.db.onerror;
				setVrequest.onsuccess = function(e) {
					updateDataBase(WebStorage.db);
				};
			}
		};

		WebStorage.request.onupgradeneeded = function(event) {
			WebStorage.db = event.target.result;
			console.log('Database onupgradeneeded ');
			// Create an objectStore to hold information about our customers. We're
			// going to use 'ssn' as our key path because it's guaranteed to be
			// unique.
			updateDataBase(WebStorage.db);
			alert('Database onupgradeneeded ');
		};

	}

	WebStorage.updateDataBase = function (db) {
		if(db.objectStoreNames.contains('customers')) {
			db.deleteObjectStore('customers');
		}
		if(db.objectStoreNames.contains('wermitwem')) {
			db.deleteObjectStore('wermitwem');
		}
		var objectStore = db.createObjectStore('customers', { keyPath: 'ssn' });
		var objectStoreEhe = db.createObjectStore('wermitwem', { keyPath: 'wmw' });

		// Create an index to search customers by name. We may have duplicates
		// so we can't use a unique index.
		objectStore.createIndex('name', 'name', { unique: false });

		// Create an index to search customers by email. We want to ensure that
		// no two customers have the same email, so use a unique index.
		objectStore.createIndex('email', 'email', { unique: true });
		objectStore.createIndex('wmw', 'wmw', { unique: false });

		objectStoreEhe.createIndex('datum', 'datum', { unique: true });

		// Store values in the newly created objectStore.
		for (var i in data.customers) {
			objectStore.add(data.customers[i]);
			console.log('objectStore onupgradeneeded '+i);
		}

		for (var i in data.wermitwem) {
			objectStoreEhe.add(data.wermitwem[i]);
			console.log('objectStoreEhe onupgradeneeded '+i);
		}
	}

	// This is what our customer data looks like.
	WebStorage.getDataByUid = function(objectStoreName, uid, callback) {
		var transaction = WebStorage.db.transaction([objectStoreName]);
		var objectStore = transaction.objectStore(objectStoreName);
		var _request = objectStore.get(uid);
		_request.onerror = function(event) {
		  // Handle errors!
			WebStorage.request.onerror(event);
		};
		_request.onsuccess = function(event) {
			if (_request.result != null)
			{
				//console.log(_request.result.name);
				callback(objectStoreName, uid, _request.result);
			} else {
				callback(objectStoreName, uid, {});
			}
		};
	}


	WebStorage.showData = function (objectStoreName, uid, data) {
		if (data == null)
		{
			getDataByUid(objectStoreName, uid, showData);
			return;
		}
		alert('name for ssn '+data.ssn+' is '+data.name);
	}

	WebStorage.deleteData = function (objectStoreName, ssn) {
		var transaction = WebStorage.db.transaction([objectStoreName], 'readwrite');
		var objectStore = transaction.objectStore(objectStoreName);
		var _request = objectStore.delete(ssn);
		_request.onerror = function(event) {
		  // Handle errors!
			WebStorage.request.onerror(event);
		};
		_request.onsuccess = function(event) {
			// It's gone!
			console.log(ssn+' It\'s gone!');
		};
	}

	WebStorage.addData = function (objectStoreName, _object) {
		var transaction = WebStorage.db.transaction([objectStoreName], 'readwrite');
		var objectStore = transaction.objectStore(objectStoreName);
		var _request = objectStore.add(_object);
		_request.onerror = function(event) {
		  // Handle errors!
			WebStorage.request.onerror(event);
		};
		_request.onsuccess = function(event) {
			// It's gone!
			console.log(_object.ssn+' Object added!');
		};
	}

	WebStorage.getAllData = function (objectStoreName, datas, callback) {
		if (datas == null)
		{
			datas = [];
		}
		var transaction = WebStorage.db.transaction([objectStoreName]);
		var objectStore = transaction.objectStore(objectStoreName);
		objectStore.openCursor().onerror = function(event) {
			request.onerror(event);
		};
		objectStore.openCursor().onsuccess = function(event) {

			var cursor = event.target.result;
			if (cursor) {
				datas.push(cursor.value);
				cursor.continue();
			} else {
				callback(objectStoreName, datas);
			}
		};
	}

	WebStorage.showAllData = function (objectStoreName, datas) {
		if (datas == null)
		{
			getAllData(objectStoreName, datas, showAllData);
			return;
		}
		document.getElementById('output').innerHTML = '';
		for (var i = 0; i < datas.length; i++)
		{
			document.getElementById('output').innerHTML = document.getElementById('output').innerHTML+'<br />'+'Name for SSN ' + datas[i].ssn + ' is ' + datas[i].name;
		}

	}

	WebStorage.getIndex = function (objectStoreName, _index, index_key, callback) {
		var transaction = WebStorage.db.transaction([objectStoreName]);
		var objectStore = transaction.objectStore(objectStoreName);
		console.log(objectStore+' '+objectStoreName+' '+_index+' '+index_key);
		var index = objectStore.index(_index);
		var datas = [];
		index.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				if (index_key == null)
				{
					datas.push(cursor.value);
				}
				else if (index_key == cursor.key)
				{
					datas.push(cursor.value);
				}
				cursor.continue();
			} else {
				callback(objectStoreName, _index, index_key, datas);
			}
		};
	}

	WebStorage.showIndex = function (objectStoreName, _index, index_key, datas) {
		/*var transaction = WebStorage.db.transaction([objectStoreName]);
		var objectStore = transaction.objectStore(objectStoreName);
		var index = objectStore.index(_index);
		index.openCursor().onsuccess = function(event) {
			var cursor = event.target.result;
			if (cursor) {
				if (index_key == null)
				{
					//retun all indices
					document.getElementById('output').innerHTML = document.getElementById('output').innerHTML+'<br />'+  cursor.value.name +' is in partnership ' + cursor.key;
				} else if (index_key == cursor.key)
				{
					//return the result for a specific index.key
					document.getElementById('output').innerHTML = document.getElementById('output').innerHTML+'<br />'+  cursor.value.name +' is in partnership ' + cursor.key;
				}
				cursor.continue();
			}
		};*/
		if (datas == null)
		{
			console.log(objectStoreName+' '+_index+' '+index_key);
			getIndex(objectStoreName, _index, index_key, showIndex);
			return;
		}
		for (var i = 0; i < datas.length; i++)
		{
			document.getElementById('output').innerHTML = document.getElementById('output').innerHTML+'<br />'+  datas[i].name +' is in partnership ' + datas[i][_index];
		}
	}
	//end of else
	}
	return WebStorage;
}
)(window);
