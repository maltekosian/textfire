// indexeddb methods
		window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
		window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
		window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;

		var IndexStorage = {}; // namespace (not required)
		IndexStorage.name = 'projects';
		IndexStorage.db_name = 'projectsDB';
		IndexStorage.db_version = 1;
		IndexStorage.indexedDB = {}; // open, addTodo, getAllTodoItems, deleteTodo - are own methods
		IndexStorage.indexedDB.db = null; // holds the real instance of the indexedDB

		// open/create
		IndexStorage.indexedDB.open = function(_callback) {
			// you must increment the version by +1 in order to get the 'onupgradeneeded' event called
			// ONLY there you can modify the db itself e.g create new object stores and etc.
			var request = indexedDB.open(IndexStorage.db_name, IndexStorage.db_version);
			console.log(request);
			
			request.onupgradeneeded = function(e) {
				console.log('onupgradeneeded', e);

				IndexStorage.indexedDB.db = e.target.result;
				var db = IndexStorage.indexedDB.db;
				console.log('db', db);
				if(db.objectStoreNames.contains(IndexStorage.name)) {
					db.deleteObjectStore(IndexStorage.name);
				}
				db.createObjectStore(IndexStorage.name, {keyPath: 'uid', autoIncrement: false});
				console.log('db.createObjectStore()');
				//objectStore.createIndex("project", "project", { unique: false });					
			};

			request.onsuccess = function(e) {
				console.log('onsuccess', e);
				IndexStorage.indexedDB.db = e.target.result;
				var db = IndexStorage.indexedDB.db;
				console.log('db', db);

				// START chrome (obsolete - will be removed)
				/*if (typeof db.setVersion === 'function') {
					var versionReq = db.setVersion(IndexStorage.db_version);
					versionReq.onsuccess = function (e) {
						console.log('versionReq', e);

						IndexStorage.indexedDB.db = e.target.source; // instead of result
						var db = IndexStorage.indexedDB.db;
						console.log('db', db);

						if(!db.objectStoreNames.contains(IndexStorage.name)){
							db.createObjectStore(IndexStorage.name, {keyPath: 'uid', autoIncrement: true});
						}
					}
				}*/
				// END chrome

				_callback();
			};
		};

		IndexStorage.indexedDB.setStorage = function(_name, _callback) {
			IndexStorage.name = _name;
			IndexStorage.db_name = _name + 'DB';
			IndexStorage.indexedDB.open(_callback);
		}

		// add
		IndexStorage.indexedDB.addItem = function(storeElement, _callback) {
			var db = IndexStorage.indexedDB.db;
			var trans = db.transaction([IndexStorage.name], 'readwrite');
			var store = trans.objectStore(IndexStorage.name);
			var request = store.put(storeElement);

			request.onsuccess = function(e) {
				// Re-render all the todo's
				_callback();
			};

			request.onerror = function(e) {
				console.log(e.value);
			};
		};

		//get
		IndexStorage.indexedDB.getItem = function(_uid, _callback) {
			var db = IndexStorage.indexedDB.db;
			var trans = db.transaction([IndexStorage.name], 'readwrite');
			var store = trans.objectStore(IndexStorage.name);			

			var request = store.get(_uid);
			console.log(_uid + ' ' + request);
			request.onsuccess = function(e) {
				console.log('onsuccess uid -> '+e.target.result.text +' '+e.target.result.uid+'='+_uid );
				_callback(e.target.result);
			};
		}

		// delete
		IndexStorage.indexedDB.deleteItem = function(_uid, _callback) {
			var db = IndexStorage.indexedDB.db;
			var trans = db.transaction([IndexStorage.name], 'readwrite');
			var store = trans.objectStore(IndexStorage.name);			

			var request = store.delete(_uid);

			request.onsuccess = function(e) {
				console.log('onsuccess delete uid -> '+_uid);
				_callback();  // Refresh the screen
			};

			request.onerror = function(e) {
				console.log(e);
			};
		};

		// read all?
		IndexStorage.indexedDB.getAllItems = function(_callback) {			
			var db = IndexStorage.indexedDB.db;
			var trans = db.transaction([IndexStorage.name], 'readwrite');
			var store = trans.objectStore(IndexStorage.name);
			var i = 0;
			var _rows = [];
			// Get everything in the store;
			var keyRange = IDBKeyRange.lowerBound(0);
			console.log('keyRange '+keyRange.lower);
			var cursorRequest = store.openCursor(keyRange);
			

			cursorRequest.onsuccess = function(e) {
				var result = e.target.result;
				if(!!result == false) {
					console.log('!!result == false '+i);
					_callback(_rows);
					return;
				}				
				//renderTodo(result.value);
				_rows.push(result.value);
				//console.log('result.value.text = '+result.value.text);
				i++;
				result.continue();
			};

			cursorRequest.onerror = IndexStorage.indexedDB.onerror;
		};
//indexedDB methods END

//load set db_name = projects & name= projects  webstorage.open(getAllProjects)
function loadProject() {
  //login();
	IndexStorage.indexedDB.setStorage('projects', getAllProjects);
}

function getAllProjects() {
	console.log('getAllProjects()');
	IndexStorage.indexedDB.getAllItems(showAllProjects);
}
//getAllItems(callbackAllProjects);
function showAllProjects(_items) {
	var ele = getElement('prompt');
  ele.innerHTML = '';
  //{project.uid, project.title}
	var htm = 'select one of these projects:<br>';
	console.log('showAllProjects('+_items.length);
	for (var i = 0; i < _items.length; i++)
	{
		htm = htm + '<input type="button" style="width: 96.5%; max-width: 96.5%;" onclick="selectProject(\''
          + _items[i].uid + '\')" value="' +_items[i].title+ '"/>';//+ _items[i].uid + ' '
	}
	htm = htm + '<input type="button" onclick="closePrompt();" value="dismiss"/>';
  ele.className = 'visible';
  ele.innerHTML = htm;
}
//select a single project
function selectProject(_uid) {
	IndexStorage.indexedDB.setStorage('project_'+_uid, getProject);
}
//set db_name = project_uid & name = project_uid webstorage.open(getProject)
function getProject() {
	var ele = getElement('prompt');
	ele.innerHTML = 'please wait until the project has been loaded.<br /><image src="mpic/loading.gif" style="width: 33%; margin: 33%; margin-bottom: 0;" />';
	ele.className = 'visible';
	IndexStorage.indexedDB.getAllItems(showProject);
}

function showProject(_items) {
	//now load the items
	console.log('showProject('+_items.length+'\n'+JSON.stringify(_items[0]));
	project.load(_items[0]);
	//before you do this
	update = true;
	closePrompt();
}
//save a project
//set db_name = projects & name= projects webstorage.open(storeProject)
function saveProject() {
	IndexStorage.indexedDB.setStorage('projects', storeProjectInProjects);
	var ele = getElement('prompt');
	ele.innerHTML = 'please wait until the project has been stored.<br /><image src="mpic/loading.gif" style="width: 33%; margin: 33%; margin-bottom: 0;" />';
	ele.className = 'visible';
}
//addItem({project.uid, project.title})
function storeProjectInProjects() {
	//we ignore the given items
  console.log('{uid : '+project.uid+', title : '+project.title);
	IndexStorage.indexedDB.addItem({uid : '' + project.uid, title : '' + project.title}, prepareStoreProject);
}
//set db_name = project_uid & name = project_uid webstorage.open(storeCurrentProject)
function prepareStoreProject() {
	IndexStorage.indexedDB.setStorage('project_'+project.uid, storeCurrentProject);
}
//for addItem(...)
function storeCurrentProject() {
	//store the project
	IndexStorage.indexedDB.addItem(JSON.parse(project.store() ), closePrompt);
	//before closePrompt
}