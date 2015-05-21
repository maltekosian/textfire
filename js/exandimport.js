window.URL = window.URL || window.webkitURL || null;
window.Blob = window.WebKitBlob || window.MozBlob || window.MSBlob || window.Blob || null;
window.BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder || window.BlobBuilder;
	/*
	Function buildExportBlobUrl

	Params: data, name

	Returns: an a element with blob url
	*/
	function buildExportBlobUrl(data, name, fileEnding) {
		var type = {type: 'text/plain'};
    var bb = null;
    if (window.Blob == null) {
      console.log('no blob');
      return;
    }		
    try {
      bb = new Blob([data], type);
    } catch (e) {
      bb = new BlobBuilder();
      bb.append(data);
      bb = bb.getBlob("text/plain");
    };
		var element = document.createElement('a');
		element.href = fileEnding == 'json' ? window.URL.createObjectURL( bb ) : data;
		element.appendChild(document.createTextNode( name ));
    element.className = 'exportA';
		element.setAttribute('download', name+'.'+fileEnding);
		element.setAttribute('title', name+'.'+fileEnding);
		return element;
	}
  /**
  @method: exportProject
  */
  function exportProject() {
    var args = []
    closePrompt();
    textmanager = project.textmanager;
    //create the blobs
    //for the project, uidcounter, datamodel,
    //textmanager, textlanguages, 
    //mediamanager, medialanguages + medias, 
    var data = null;
    var _ele = null;
    args = [];
    args.push(document.createElement('div'));
    _ele = document.createTextNode('Project:');
    args[0].appendChild(_ele); 
    _ele = document.createElement('br');
    args[0].appendChild(_ele); 
    data = encodeURI(project.export());  
    _ele = buildExportBlobUrl( data, 'project', 'json'); //
		args[0].appendChild(_ele);
    args[0].appendChild(document.createElement('hr'));

    args.push(document.createElement('div'));
    _ele = document.createTextNode('UidCounter:');
    args[1].appendChild(_ele); 
    _ele = document.createElement('br');
    args[1].appendChild(_ele); 
    data = encodeURI(project.uidCounter.store());//store same function like export here  
    _ele = buildExportBlobUrl( data, 'uidcounter', 'json'); //
		args[1].appendChild(_ele);
    args[1].appendChild(document.createElement('hr'));

    args.push(document.createElement('div'));
    _ele = document.createTextNode('DataModel:');
    args[2].appendChild(_ele); 
    _ele = document.createElement('br');
    args[2].appendChild(_ele); 
    data = encodeURI(project.datamodel.export());//export is not same function unlike store  
    _ele = buildExportBlobUrl( data, 'datamodel', 'json'); //
		args[2].appendChild(_ele);
    args[2].appendChild(document.createElement('hr'));
    
    args.push(document.createElement('div'));
    _ele = document.createTextNode('TextManager:');
    args[3].appendChild(_ele); 
    _ele = document.createElement('br');
    args[3].appendChild(_ele); 
    data = encodeURI(project.textmanager.export());//export is not same function unlike store  
    _ele = buildExportBlobUrl( data, 'textmanager', 'json'); //
		args[3].appendChild(_ele);
    args[3].appendChild(document.createElement('hr'));

    args.push(document.createElement('div'));
    _ele = document.createTextNode('TextLanguages:');
    args[4].appendChild(_ele); 
    var languages = project.textmanager.languages;
    for (var i = 0; i < languages.length; i++) {
      _ele = document.createElement('br');
      args[4].appendChild(_ele); 
      data = encodeURI(languages[i].store());//export is not same function unlike store  
      _ele = buildExportBlobUrl( data, 'textlanguage_'+languages[i].language, 'json'); //
		  args[4].appendChild(_ele);
    }
    args[4].appendChild(document.createElement('hr'));

    args.push(document.createElement('div'));
    _ele = document.createTextNode('MediaManager:');
    args[5].appendChild(_ele); 
    _ele = document.createElement('br');
    args[5].appendChild(_ele); 
    data = encodeURI(project.mediamanager.export());//export is not same function unlike store  
    _ele = buildExportBlobUrl( data, 'mediamanager', 'json'); //
		args[5].appendChild(_ele);
    args[5].appendChild(document.createElement('hr'));
    
    args.push(document.createElement('div'));
    _ele = document.createTextNode('MediaLanguages:');
    args[6].appendChild(_ele); 
    languages = project.mediamanager.languages;
    for (var i = 0; i < languages.length; i++) {
      _ele = document.createElement('br');
      args[6].appendChild(_ele); 
      data = encodeURI(languages[i].export());//export is not same function unlike store  
      _ele = buildExportBlobUrl( data, 'medialanguage_'+languages[i].language, 'json'); //
		  args[6].appendChild(_ele);
      _ele = document.createElement('br');
      _ele.style.lineHeight = '1.5';
      args[6].appendChild(_ele); 
      var imagess = languages[i].imagess;
      for (var j = 0; j < imagess.length; j++) {
        data = imagess[i].value;
			  switch (data.substr(0,15) ) {
				  case 'data:image/png;': fileEnding = 'png'; break;
				  case 'data:image/jpeg': fileEnding = 'jpg'; break;
				  default: //must be a gif
					  fileEnding = '.gif';
					break;
			  }
			  _ele = buildExportBlobUrl( data, 'image_'+languages[i].language+'_'+imagess[i].key, fileEnding);
			  args[6].appendChild(_ele);
        _ele = document.createElement('br');
        _ele.style.lineHeight = '1.5';
        args[6].appendChild(_ele); 
      }
      var audios = languages[i].audios;
      for (var j = 0; j < audios.length; j++) {
        data = audios[i].value;
			  switch (data.substr(0,15) ) {
				  case 'data:audio/mpe;': fileEnding = 'mpeg'; break;
				  case 'data:image/wav': fileEnding = 'wav'; break;
          case 'data:image/ogg': fileEnding = 'ogg'; break;	
          default: fileEnding = 'undefined'; break;
			  }
			  _ele = buildExportBlobUrl( data, 'audio_'+languages[i].language+'_'+audios[i].key, fileEnding);
			  args[6].appendChild(_ele);
        _ele = document.createElement('br');
        _ele.style.lineHeight = '1.5';
        args[6].appendChild(_ele); 
      }
    }//this is a for loop through all languages
    //and internal loop through all media files per language, too! 
    args[6].appendChild(document.createElement('hr'));

    var elements = [];
    elements.push(document.createElement('div'));
    for (var i = 0; i < args.length; i++) {
      elements[0].appendChild(args[i]);
    }
    elements[0].style.overflowY = 'scroll';
    elements[0].style.overflowX = 'hidden';
    elements[0].style.maxHeight = '65%';

    showPrompt('export project', elements, [['closePrompt();', 'done']]);
  }
	/*
	Function: exportSlideshow
	
	function exportSlideshow() {
		closePrompt();
		dialogmanager = project.dialogManager;

		var slideshow = project.slideshow;
		element = getElement('exandimport');
		element.className = 'visible prompt';
		element.innerHTML = 'the slideshow game export to the file system';
		//project
		var data = encodeURI(project.storeProject());
		var _ele = document.createElement('br');
		element.appendChild(_ele);
		_ele = buildExportBlobUrl( data, 'project', 'json'); //document.createElement('a');
		element.appendChild(_ele);
		//this.slideshow = new DataModel.Slideshow(this.uidCounter.createNew()+Date.now());
		data = encodeURI(slideshow.store());
		_ele = document.createElement('br');
		element.appendChild(_ele);
		_ele = buildExportBlobUrl( data, 'slideshow', 'json'); //document.createElement('a');
		element.appendChild(_ele);
		
		//save the dialogmanager, uidCounter, metadata, slideshowOverview, slideOverviews, metadataOverview
		
		data = encodeURI(dialogmanager.store());
		_ele = document.createElement('br');
		element.appendChild(_ele);
		_ele = buildExportBlobUrl( data, 'dialogmanager', 'json');
		element.appendChild(_ele);

		var languages = dialogmanager.languages;
		console.log('languages.length = '+languages.length);
		for (var i = 0; i < languages.length; i++)
		{
			data = encodeURI(languages[i].store());
			_ele = document.createElement('br');
			element.appendChild(_ele);
			_ele = buildExportBlobUrl( data, 'language_'+languages[i].language+'', 'json');
			element.appendChild(_ele);
			_ele = document.createElement('br');
			element.appendChild(_ele);
		}

		data = encodeURI(project.uidCounter.store());
		_ele = document.createElement('br');
		element.appendChild(_ele);
		_ele = buildExportBlobUrl( data, 'uidCounter', 'json');
		element.appendChild(_ele);
		_ele = document.createElement('br');
		element.appendChild(_ele);
		
		data = encodeURI(project.metadataOverview.store());
		_ele = document.createElement('br');
		element.appendChild(_ele);
		_ele = buildExportBlobUrl( data, 'overviewMetadata', 'json'); //document.createElement('a');
		element.appendChild(_ele);

		for (var i = 0; i < project.metadata.length; i++)
		{
			data = encodeURI(project.metadata[i].store());
			_ele = document.createElement('br');
			element.appendChild(_ele);
			_ele = buildExportBlobUrl( data, 'metadata_'+project.metadata.uid, 'json'); //document.createElement('a');
			element.appendChild(_ele);
		}

		data = encodeURI(project.slideshowOverview.store());
		_ele = document.createElement('br');
		element.appendChild(_ele);
		_ele = buildExportBlobUrl( data, 'overviewSlideshow', 'json'); //document.createElement('a');
		element.appendChild(_ele);

		for (var i = 0; i < project.slideOverviews.length; i++)
		{
			data = encodeURI(project.slideOverviews[i].store());
			_ele = document.createElement('br');
			element.appendChild(_ele);
			_ele = buildExportBlobUrl( data, 'overviewSlide_'+project.slideOverviews[i].uid, 'json'); //document.createElement('a');
			element.appendChild(_ele);
		}

		var ele2 = null;
		var fileEnding = '.gif';
		if (slideshow.imageRef != null)
		{			
			data = project.mediaManager.getMedia(slideshow.imageRef);
			switch (data.substr(0,15) )
			{
				case 'data:image/png;': fileEnding = 'png'; break;
				case 'data:image/jpeg': fileEnding = 'jpg'; break;
				default: //must be a gif
					fileEnding = '.gif';
					break;
			}
			ele2 = buildExportBlobUrl( data, slideshow.imageRef, fileEnding);
			element.appendChild(ele2);
			_ele = document.createElement('br');
			ele2.appendChild(_ele);
			_ele = document.createElement('img');
			_ele.src = data;
			_ele.style.className = 'overview_image';
			_ele.style.width = Math.round(0.165 * local.width) + 'px';
			_ele.style.height = Math.round(0.165 * local.width * 9 / 16) + 'px';
			_ele.setAttribute('title',slideshow.imageRef, fileEnding);
			ele2.appendChild(_ele);
		}

		//mediamanager complete makes slideshow, slide and object image dumping obsolte

		var _mediae = project.mediaManager.mediae;

		for (var i = 0; i < _mediae.length; i++)
		{
			data = project.mediaManager.getMedia(_mediae[i].key);
			switch (data.substr(0,15) )
			{
				case 'data:image/png;': fileEnding = 'png'; break;
				case 'data:image/jpeg': fileEnding = 'jpg'; break;
				default: //must be a gif
					fileEnding = '.gif';
					break;
			}
			ele2 = buildExportBlobUrl( data, _mediae[i].key, fileEnding);
			element.appendChild(ele2);
			_ele = document.createElement('br');
			ele2.appendChild(_ele);
			_ele = document.createElement('img');
			_ele.src = data;
			_ele.style.className = 'overview_image';
			_ele.style.width = Math.round(0.165 * local.width) + 'px';
			_ele.style.height = Math.round(0.165 * local.width * 9 / 16) + 'px';
			_ele.setAttribute('title', _mediae[i].key, fileEnding);
			ele2.appendChild(_ele);
		}

		//store the slides and the selections (includes texts and targets)
		var slides = slideshow.slides;

		for (var i = 0; i < slides.length; i++)
		{
			data = encodeURI(slides[i].store());
			_ele = document.createElement('br');
			element.appendChild(_ele);
			_ele = buildExportBlobUrl( data, 'slide_'+slides[i].uid+'', 'json');
			element.appendChild(_ele);
			_ele = document.createElement('br');
			element.appendChild(_ele);
			if (slides[i].imageRef != null)
			{
				data = project.mediaManager.getMedia(slides[i].imageRef);
				switch (data.substr(0,15) )
				{
					case 'data:image/png;': fileEnding = 'png'; break;
					case 'data:image/jpeg': fileEnding = 'jpg'; break;
					default: //must be a gif
						fileEnding = '.gif'; break;
				}
				ele2 = buildExportBlobUrl( encodeURI(data), slides[i].imageRef, fileEnding);
				element.appendChild(ele2);
				_ele = document.createElement('br');
				ele2.appendChild(_ele);
				_ele = document.createElement('img');
				_ele.src = project.mediamanager.getMedia(slides[i].imageRef);
				_ele.setAttribute('title',slides[i].imageRef, fileEnding);
				_ele.style.width = Math.round(0.165 * local.width) + 'px';
				_ele.style.height = Math.round(0.165 * local.width * 9 / 16) + 'px';
				ele2.appendChild(_ele);
			}
			var sels = slides[i].selections;
			for (var j = 0; j < sels.length; j++)
			{
				data = encodeURI(sels[j].store());
				_ele = document.createElement('br');
				element.appendChild(_ele);
				_ele = buildExportBlobUrl( data, 'selection_'+slides[i].uid+'_'+sels[j].uid+'', 'json');
				element.appendChild(_ele);
			}
			//store the objects!
			var objs = slides[i].objects;
			for (var j = 0; j < objs.length; j++)
			{
				data = encodeURI(objs[j].store());
				_ele = document.createElement('br');
				element.appendChild(_ele);
				_ele = buildExportBlobUrl( data, 'object_'+slides[i].uid+'_'+objs[j].uid+'', 'json');
				element.appendChild(_ele);
			}
			
		}
		_ele = document.createElement('br');
		element.appendChild(_ele);
		_ele = document.createElement('input');
		_ele.setAttribute('type','button');
		_ele.setAttribute('value','done'); 
		_ele.addEventListener('click', closeExportSlideshow, true);
		element.appendChild(_ele);
	}*/

	/************************************************************
	 *
	 * IMPORTS OF JSON FILES
	 *
	************************************************************/

	var importTitleImage = false;
	/*
	Function: importSlideshow
	*/
	function importSlideshow() {
		closePrompt();
		//reset, clear  title, slideshow_title, title_image, background_image, texts
		//getElement('texts').innerHTML = '';
		//getElement('title').value = '';
		//getElement('editor_title').value = '';
		//getElement('slides_left_slides').innerHTML = '';
		//getElement('slideshow_image_title').src = '';
		//stopGame();
		project = new Project();
		//updateAddSlide();
		var element = getElement('exandimport');
		element.className = 'visible prompt'; 
		element.innerHTML = 'the slideshow game import from the file system';
		var _ele = document.createElement('br');
		element.appendChild(_ele);
		_ele = document.createElement('input');
		//_ele.name = 'select_200';
		//_ele.className = 'select_200';
		_ele.setAttribute('type','file');
		_ele.setAttribute('multiple','multiple');
		_ele.setAttribute('value','import json files');
		//_ele.setAttribute('id','handleJsonImport');
		_ele.addEventListener('change', handleJsonImport, false);
		element.appendChild(_ele);
		_ele = document.createElement('br');
		element.appendChild(_ele);
		_ele = document.createElement('input');
		_ele.setAttribute('type','button');
		_ele.setAttribute('value','dismiss');
		_ele.addEventListener('click', closeImportSlideshow, false);
		element.appendChild(_ele);
	}
	/*
	Function: handleTitleImport

	Pass through for the handleImageImport function
	sets the var boolean importTitleImage = true

	Params: event
	*/
	function handleTitleImport(evt) {
		importTitleImage = true;
		//console.log('handleTitleImport ');
		handleImageImport(evt);
	}
	/*
	Function: handleBackgroundImport

	Pass through for the handleImageImport function
	sets the var boolean importTitleImage = false

	Params: event
	*/
	function handleBackgroundImport(evt) {
		importTitleImage = false;
		//console.log('handleBackgroundImport ');
		handleImageImport(evt);
	}
	/*
	Function: handleJsonImport

	Params: event
	*/
	function handleJsonImport(evt) {
		// Loop through the FileList and render image files as thumbnails.
		//project = new Project();
		var files = evt.target.files; // FileList object
		for (var i = 0, f; f = files[i]; i++) {
			var reader = new FileReader();
			reader.onload = (function(theFile) {
				return function(e) {
					//console.log('handleJsonImport->'+theFile.name);
					loadImportProject(e.target.result,theFile.name);
				};
			})(f);
			if (i == files.length - 1)
			{
				reader.onloadend = importProjectJsons;
			}
			reader.readAsText(f, 'UTF-8');//readAsDataURL(f);//, 'UTF-8');
		}
	}
	/*
	Function: importProject
	*/
	function importProjectJsons() {
		project = new Project();
		var slideshow = false;
		var json = false;
		var uidCounter = new UidCounter();
		var slides = new Array();
		var dialogs = new Array();
		var selections = new Array();
		var objects = new Array();
		var filenames = tmp_storage.filenames;
		var metadataOverview = new Overview('metadata');
		var slideshowOverview = new Overview('slideshowOverview');
		var slideOverviews = [];
		//var overview = false;
		//var preferences = new Preferences();
		//console.log(tmp_storage.jsons.length+', filenames ='+filenames.length );
		for (var i = 0; i < filenames.length; i++)
		{
			//console.log('filenames[i] = '+filenames[i]);
			json = JSON.parse( decodeURI(tmp_storage.jsons[i]) );
			//json = JSON.parse( tmp_storage.jsons[i] );
			switch ( filenames[i].substr(0,6) )
			{
				case 'slide_':
					//console.log(decodeURI(tmp_storage.jsons[i]));
					var slide = new DataModel.Slide(json['uid']);
					slide.load(json);
					slides.push(slide);
				break;
				case 'select':
					var selection = new DataModel.SlideSelection(json['uid']);
					selection.load(json);
					selections.push(selection);
				break;
				case 'slides':
					slideshow = new DataModel.Slideshow(json['uid']);
					slideshow.load(json);
					
				break;
				case 'uidCou':
					uidCounter = new UidCounter();
					uidCounter.load(json);
				break;
				case 'dialog':
					//that's the global one!
					dialogmanager = new DataModel.DialogManager();
					dialogmanager.load(json);
				break;
				case 'langua':
					var dialog = new DataModel.DialogLanguage(json['language']);
					dialog.load(json);
					dialogs.push(dialog);
				break;
				case 'overvi':
					var overview = new Overview(json['uid']);
					overview.load(json);
					switch (overview.uid)
					{
					case 'slideshowOverview': slideshowOverview = overview; break;
					case 'metadata': metadataOverview = overview; break;
					default: slideOverviews.push(overview); break;
					}
				break;
				case 'object':
					var object = new DataModel.SlideObject(json['uid']);
					object.load(json);
					objects.push(object);
				break;
				case 'metada':
					var meta = new MetaDataObject(json['uid']);
					meta.load(json);
					project.metadatas.push(meta);
				break;
				case 'prefer'://preferences
					preferences.load(json);
				break;
			}
		}
		//var element = getElement('slides_left_slides');
		//element.innerHTML = '';
		//if (!overview)
		//{
		//		overview = new Overview();
		//}

		if (dialogs.length > 0)
		{
			dialogmanager.languages = dialogs;
		}

		for (var i = 0; i < slides.length; i++)
		{
			var sels = new Array();
			for (var j = 0; j < selections.length; j++)
			{
				for (var k = 0; k < slides[i].selections.length; k++)
				{
					if (slides[i].selections[k].hasUid( selections[j].uid ) )
					{
						sels[k] = selections[j];
					}
				}
			}
			slides[i].selections = sels;
			if (slides[i].getCurrentSelection() != null)
			{
				slides[i].setCurrentSelection( slides[i].getSelection( slides[i].getCurrentSelection().uid ) );
			} else {
				// WHAT to do here?
				slides[i].setCurrentSelection( slides[i].selections[0] );
			}
			//console.log('slides[i].getCurrentSelection() = '+JSON.stringify(slides[i].getCurrentSelection()) );
			var _ele = document.createElement('img');
			_ele.setAttribute('id','image_'+slides[i].uid);
			//_ele.src = imgSrc;
			_ele.alt = 'slide '+slides[i].uid+' '+slides[i].getName();
			_ele.style.width = '100px';
			//_ele.style.margin = '2px';
			_ele.style.height = '56px';
			//element.appendChild(_ele);
			//create a new overview here if the the o_slides.length != slides.length;
			//don't forget to add the selection and objects
		}
		//slideshow.slides = slides;
		for (var i = 0; i <  slideshow.slides.length; i++)
		{
			for (var j = 0; j < slides.length; j++)
			{
				if (slideshow.slides[i].hasUid( slides[j].uid ) )
				{
					slideshow.slides[i] = slides[j];
				}
			}
		}
		//project = new Project();
		project.slideshow = slideshow;
		project.uidCounter = uidCounter;
		project.dialogManager = dialogmanager;
		project.metadataOverview = metadataOverview;
		project.slideshowOverview = slideshowOverview;
		project.slideOverviews = slideOverviews;
		//project.preferences = preferences;
		tmp_storage = false;
		//now load the images into the mediamanager
		element = getElement('exandimport');
		var _ele = document.createElement('br');
		element.appendChild(_ele);
		_ele = document.createElement('span');
		_ele.innerHTML = 'import title image:<br>';
		element.appendChild(_ele);
		_ele = document.createElement('input');
		_ele.name = 'select_200';
		_ele.className = 'select_200';
		_ele.setAttribute('type','file');
		_ele.setAttribute('value','import title images');
		_ele.addEventListener('change', handleTitleImport, false);
		element.appendChild(_ele);
		_ele = document.createElement('br');
		element.appendChild(_ele);
		_ele = document.createElement('span');
		_ele.innerHTML = 'import background images:<br>';
		element.appendChild(_ele);
		_ele = document.createElement('input');
		_ele.name = 'select_200';
		_ele.className = 'select_200';
		_ele.setAttribute('type','file');
		_ele.setAttribute('multiple','multiple');
		_ele.setAttribute('value','import background');
		_ele.addEventListener('change', handleBackgroundImport, false);
		element.appendChild(_ele);

		//updateAddSlide();
		//getElement('title').value = project.slideshow.getCurrentSlide().getName();
		//getElement('editor_title').value = project.slideshow.getName();
	}

	var tmp_storage = false;
	/*
	Function: loadImportProject

	Params: json, filename
	*/
	function loadImportProject(json, filename) {
		if (!tmp_storage)
		{
			tmp_storage = {
				filenames: [],
				jsons: []
			};
		}
		//var length = tmp_storage.filenames.length;
		tmp_storage.filenames[tmp_storage.filenames.length] = filename;
		tmp_storage.jsons[tmp_storage.jsons.length] = json;

		//console.log('loadImportProject imported '+filename+' '+tmp_storage.jsons.length);
	}
	/*
	Function: handleImageImport

	Params: event
	*/
	function handleImageImport(evt) {
		// Loop through the FileList and render image files as thumbnails.
		var files = evt.target.files; // FileList object
		//console.log('handleImageImport '+files.length);
		// Loop through the FileList and render image files as thumbnails.
		for (var i = 0, f; f = files[i]; i++) {

			if (!f.type.substr('image')) {
				continue;
			}
			//console.log('handleImageImport '+f.type);
			var reader = new FileReader();
			reader.onload = (function(theFile) {
				//console.log('handleImageImport '+theFile.name);
				return function(e) {
					//console.log('handleImageImport '+ e.target.result);
					addBackgroundImage(e.target.result);
				};
			})(f);
			reader.readAsDataURL(f);
		}
	}
	/*
	Function: addBackgroundImage

	Params: imageSource
	*/
	function addBackgroundImage(imgSrc) {
		//console.log('addBackgroundImage '+imgSrc);
		if (importTitleImage)
		{
			_uid = project.slideshow.uid;
			if (_uid == 'undefined')
			{
				_uid = project.uidCounter.createUid()+project.uidCounter.createUid()+'_'+Date.now();
				project.slideshowuid = _uid;
			}
			project.slideshow.imageRef = _uid;
		} else {
			_uid = project.slideshow.getCurrentSlide().uid;
			if (!_uid)
			{
				_uid = project.uidCounter.createNew();//
			}
			project.slideshow.getCurrentSlide().imageref = _uid;
		}
		project.mediaManager.addMedia(_uid, imgSrc);
		//console.log('addBackgroundImage = '+_uid+' '+imgSrc);
		var element = false;
		//console.log(importTitleImage+'\n'+imgSrc);
		if (importTitleImage) {
			//console.log('addTitleImage = '+imgSrc);
			//element = getElement('slideshow_image_title');
			//element.src = imgSrc;
			//element.style.className = 'overview_image';
			//element.style.width = '100px';
			//element.style.height = '56px';

		} else {
		/*	element = getElement('slides_left_slides');
			var _ele = document.createElement('img');
			_ele.setAttribute('id','image_'+_uid);
			_ele.src = imgSrc;
			_ele.style.width = '192px';
			_ele.style.margin = '2px';
			_ele.style.height = '108px'; */
			console.log('addBackgroundImage = image_'+_uid);
			//element = getElement('slide_image_background');
			//element.src = imgSrc;
			//element.style.className = 'overview_image';
			//element.style.width = '100px';
			//element.style.height = '56px';

			/*element = getElement('image_'+_uid);
			element.src = imgSrc;
			element.style.className = 'overview_image';
			element.style.width = '100px';
			//element.style.margin = '2px';
			element.style.height = '56px';*/
		}
	}