/*
       Licensed to the Apache Software Foundation (ASF) under one
       or more contributor license agreements.  See the NOTICE file
       distributed with this work for additional information
       regarding copyright ownership.  The ASF licenses this file
       to you under the Apache License, Version 2.0 (the
       "License"); you may not use this file except in compliance
       with the License.  You may obtain a copy of the License at

         http://www.apache.org/licenses/LICENSE-2.0

       Unless required by applicable law or agreed to in writing,
       software distributed under the License is distributed on an
       "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
       KIND, either express or implied.  See the License for the
       specific language governing permissions and limitations
       under the License.
*/



    Array.prototype.inArray = function(v) {
		for (var i = 0; i < this.length; i++)
		{
			if (this[i] === v)
			{
				return true;
			}
		}
		return false;
	}

	var console = console || {
		log : function(str) {
			getElement('output').innerHTML = str;
		}
	};

	/*#############################
	DataModel
	*/

	var DataModel = {
		UidCounter : null,
		DialogManager : null,
		DialogLangauge : null,
		KeyValue : null,
		SlideSelection : null,
		SlideText : null,
		Slide : null
	};
    /**
    @class DataModel.UidCounter
    */
	DataModel.UidCounter = function() {
		/**
        @variable
        */
		this.counter = [];
		/**
        @method createNew
        */
        this.createNew = function() {
			var r = 10000 + Math.floor(Math.random() * 89999);
			while (this.counter.inArray(r))
			{
				 r = 10000 + Math.floor(Math.random() * 89999);
			}
			this.counter.push(r);
			return r;
		};
        /**
        @method removeCounter
        */
		this.removeCounter = function(_c) {
			for (var i = this.counter.length -1; i >= 0; i--)
			{
				if (this.counter[i] == _c)
				{
					this.counter.splice(i, 1);
				}
			}
		}
		/**
        @method load
        */
        this.load = function(json) {
            this.counter = json['counter'];
        }
        /**
        @method store
        */
        this.store = function() {
            return JSON.stringify(this, function(key, value) {

            });
        }
	};
    /**
    @class DataModel.DialogManager
    */
	DataModel.DialogManager = function() {
		this.lan = 'en';
		this.currentLanguage = null;
		this.languages = [];
        /**
        @method getCurrentLanguage
        */
		this.getCurrentLanguage = function() {
			if (this.currentLanguage == null)
			{
				this.setCurrentLanguage(this.lan);
			}
			return this.currentLanguage;
		}
        /**
        @method setCurrentLanguage
        */
		this.setCurrentLanguage = function(_lan) {
			this.lan = _lan;
			if (this.hasLanguage(_lan))
			{
				this.currentLanguage = this.getLanguage(_lan);
			} else {
				this.currentLanguage = new DataModel.DialogLanguage(_lan);
				this.languages.push(this.currentLanguage);
			}
		}
        /**
        @method hasLanguage
        */
		this.hasLanguage = function(_lan) {
			for (var i = 0; i < this.languages.length; i++)
			{
				if (this.languages[i].language == _lan)
				{
					return true;
				}
			}
			return false;
		}
        /**
        @method getLanguage
        */
		this.getLanguage = function(_lan) {
			for (var i = 0; i < this.languages.length; i++)
			{
				if (this.languages[i].language == _lan)
				{
					return this.languages[i];
				}
			}
			return null;
		}
        /**
        @method setDialog
        */
		this.setDialog = function(_k, _v) {
			var cl = this.getCurrentLanguage();
			cl.setDialog(_k, _v);
		}
		/**
        @method getDialog
        */
        this.getDialog = function(_k) {
			var cl = this.getCurrentLanguage();
			return cl.getDialog(_k);
		}
	};
    /**
    @class DataModel.DialogLanguage
    */
	DataModel.DialogLanguage = function(_lan) {
		this.language = _lan;
		this.dialogs = []; //an array of keyvalues base64 encoded!
        /**
        @method setDialog
        */
		this.setDialog = function(_k, _v) {
			if (this.hasDialog(_k))
			{
				for (var i = 0; i < this.dialogs.length; i++)
				{
					if (this.dialogs[i].key == _k)
					{
						this.dialogs[i].value =  Base64.encode(_v);;
					}
				}
			} else {
				this.dialogs.push(new DataModel.KeyValue(_k, _v));
			}
		}
        /**
        @method hasDialog
        */
		this.hasDialog = function(_k) {
			for (var i = 0; i < this.dialogs.length; i++)
			{
				if (this.dialogs[i].key == _k)
				{
					return true;
				}
			}
			return false;
		}
        /**
        @method getDialog
        */
		this.getDialog = function(_k) {
			for (var i = 0; i < this.dialogs.length; i++)
			{
				if (this.dialogs[i].key === _k)
				{
					return Base64.decode(this.dialogs[i].value);
				}
			}
			return '';
		}
	};
    /**
    @class DataModel.KeyValue
    */
	DataModel.KeyValue = function(_k, _v) {
		this.key = _k;
		this.value = Base64.encode(_v);
	};
	/**
    @class DataModel.Slide
    */
	DataModel.Slide = function(_uid) {
        this.uid = _uid;
        this.selections = [];
        this.name = '';
        /**
        @method addSelection
        */
        this.addSelection = function(_sel) {
            this.selections.push(_sel);
        }
        /**
        @method removeSelection
        */
        this.removeSelection = function(_uid) {
		    for (var i = 0; i < this.selections.length; i++) {
                if (this.selections[i].hasUid(_uid)) {
                    this.selections.splice(i, 1);
                }
		    }
        }
        /**
        @method getSelection
        */
        this.getSelection = function(_uid) {
		    for (var i = 0; i < this.selections.length; i++) {
                if (this.selections[i].hasUid(_uid)) {
                    return this.selections[i];
                }
    		}
		    return true;
        }
        /**
        @method setName
        */
        this.setName = function(_name) {
            dialogmanager.setDialog(this.uid, _name);
        }
        /**
        @method getName
        */
        this.getName = function(_name) {
            return dialogmanager.getDialog(this.uid);
        }
    }
    /**
    @class DataModel.SlideSelection
    */
	DataModel.SlideSelection = function(_uid) {
		this.uid = _uid;
		this.texts = [];
        /**
        @method setName
        */
		this.setName = function(_name) {
			dialogmanager.setDialog(this.uid, _name);
		}
        /**
        @method getName
        */
		this.getName = function() {
			return dialogmanager.getDialog(this.uid);
		}
        /**
        @method addText
        */
		this.addText = function(_text) {
			if (!this.texts.inArray(_text))
			{
				this.texts.push( _text );
				//console.log('add text '+_text.uid);
			}
		};
        /**
        @method getText
        */
		this.getText = function(_uid) {
			for (var i = 0; i < this.texts.length; i++)
			{
				if (this.texts[i].hasUid(_uid))
				{
					return this.texts[i];
				}
			}
			return null;
		}
        /**
        @method hasText
        */
		this.hasText = function(_uid) {
			for (var i = 0; i < this.texts.length; i++)
			{
				if (this.texts[i].hasUid(_uid))
				{
					return true;
				}
			}
			return false;
		}
        /**
        @method removeText
        */
		this.removeText = function(_uid) {
			for (var i = this.texts.length-1; i >= 0; i--)
			{
				if (this.texts[i].hasUid(_uid))
				{
					this.texts.splice(i,1);
				}
			}
		}
        /**
        @method hasUid
        */
		this.hasUid = function(_uid) {
			return (this.uid == _uid);
		}
	};
    /**
    @class DataModel.SlideText
    */
	DataModel.SlideText = function(_uid) {
		this.uid = _uid;
		this.targetUid = null;
        /**
        @method hasUid
        */
		this.hasUid = function(_uid) {
			return (this.uid == _uid);
		}
        /**
        @method setText
        */
		this.setText = function(_text) {
			dialogmanager.setDialog(this.uid, _text);
		}
        /**
        @method getText
        */
		this.getText = function() {
			return dialogmanager.getDialog(this.uid);
		}
        /**
        @method hasTarget
        */
		this.hasTarget = function() {
			return (this.targetUid != null);
		}
        /**
        @method setTarget
        */
		this.setTarget = function(_target) {
			this.targetUid = _target;
		}
        /**
        @method getTarget
        */
		this.getTarget = function() {
			return this.targetUid;
		}
	};

	/*######################################
	resizeElements, init & Global Variables
	*/

	var current = {
		title : '',
		selections : [],
		dialogmanager : null,
		uidcounter : new DataModel.UidCounter(),
		uid : null,
		currentSelection : null,
		fontsize : 25,
		fontfamily : 'sans-serif', //'sans-serif', 'serif', 'monospace'
		getSelection: function(_uid) {
			for (var i = 0; i < this.selections.length; i++) {
				if (this.selections[i].hasUid(_uid)) {
					return this.selections[i];
				}
			}
			return true;
		}
	}

	var dialogmanager = current.dialogmanager = new DataModel.DialogManager();
    /**
    @method init
    */
	function init() {
            setTimeout('init2();', 1000);
        }
        document.addEventListener("deviceready", function() {setTimeout('init2();', 1000);}, true);


	function init2() {
	    dialogmanager = current.dialogmanager = new DataModel.DialogManager();
		current.uid = current.uidcounter.createNew()+'_'+Date.now();
		current.currentSelection = new DataModel.SlideSelection(current.uidcounter.createNew());
		current.selections.push(current.currentSelection);
		try
		{
			window.addEventListener('resize', resizeElements, false);
		}
		catch (e)
		{
			window.attachEvent('onresize', resizeElements);
		}
		resizeElements();
		getElement('selection_id').innerHTML = current.currentSelection.uid;
		getElement('selection_name').value = current.currentSelection.getName();
	}

	function resizeElements() {
		var w = window.innerWidth;
		var h = window.innerHeight;
		if (!w) {
			w = document.body.clientWidth;
			h = document.body.clientHeight;
		}
		var fontsize = 25;

		if (w > h)
		{
			if (w / 2 <= h)
			{
				fontsize = current.fontsize * (w/2 + h) / 1200;
				for (var i = 0; i < 4; i++) {
				getElement('page_'+i).style.left = (w/4)+'px';
				getElement('page_'+i).style.width = (w/2)+'px';
				getElement('page_'+i).style.minWidth = (w/2)+'px';
				getElement('page_'+i).style.maxWidth = (w/2)+'px';
				}
			} else {
				fontsize = current.fontsize * (w/3 + h) / 1200;
				for (var i = 0; i < 4; i++) {
				getElement('page_'+i).style.left = (w/3)+'px';
				getElement('page_'+i).style.width = (w/3)+'px';
				getElement('page_'+i).style.minWidth = (w/3)+'px';
				getElement('page_'+i).style.maxWidth = (w/3)+'px';
				}
			}

		} else {
			fontsize = current.fontsize * (w + h) / 1200; //800*450
			for (var i = 0; i < 4; i++) {
			getElement('page_'+i).style.left = '0';
			getElement('page_'+i).style.width = w+'px';
			getElement('page_'+i).style.minWidth = w+'px';
			getElement('page_'+i).style.maxWidth = w+'px';
			}
		}
		document.body.style.fontSize = fontsize+'px';
		var tags = ['div','input','select','span','textarea'];
		var br = (fontsize - 1)/ 2;
		for (var j = 0; j < tags.length; j++)
		{
			var eles = document.getElementsByTagName(tags[j]);
			for (var i = 0; i < eles.length; i++)
			{
				if (eles[i].className == 'w50' || eles[i].className == 'w100')
				{
					eles[i].style.borderRadius = br+'px '+br+'px 0px '+br+' px';
				}
			}
		}
		console.log('resizeElements w='+w+', h='+h);
		output('resizeElements w='+w+', h='+h);
	}

	//window.onload = function() {setTimeout('init();',100) };

	/*######################################
	editor functions
	*/

	function newSlideshow() {
	    current.selections = [];
	    current.title = '';
	    current.fontsize = 25;
	    current.fotfamily = 'sans-serif';
	    current.uidcounter = new DataModel.UidCounter(),
	    dialogmanager = current.dialogmanager = new DataModel.DialogManager();
	    current.uid = current.uidcounter.createNew()+'_'+Date.now();
		current.currentSelection = new DataModel.SlideSelection(current.uidcounter.createNew());
		current.selections.push(current.currentSelection);
		//set the content to the inputs
		getElement('title').value = current.title;
		getElement('selection_id').innerHTML = current.currentSelection.uid;
		getElement('selection_name').value = current.currentSelection.getName();
		resizeElements();
	}

	function updateTitle() {
	    dialogmanager.setDialog(current.uid, getElement('title').value);
		current.title = current.uid;
		console.log('updateTitle -> '+current.title+' '+getElement('title').value);
		output('updateTitle -> '+current.title+' '+getElement('title').value);
	}

	function showAllSelections () {
	    getElement('page_0').className = 'hidden';
        getElement('page_1').className = 'hidden';
	    //logic here
	    var tmp = getElement('selection_#id#').innerHTML;
	    var _sel = null;
	    var ele = null;
	    var element = getElement('selections');
	    element.innerHTML = '';
	    for (var i = 0; i < current.selections.length; i++) {
	        _sel = current.selections[i];
	        ele = document.createElement('div');
	        ele.innerHTML = tmp.replace(/#id#/g, _sel.uid);
	        ele.className = 'section';
	        ele.id = 'selection_'+_sel.uid;
	        element.appendChild(ele);
	        if (_sel.getName() != '') {
	            getElement('selection_name_'+_sel.uid).value = _sel.getName();
	        }
	    }
	    //and show
	    getElement('page_3').className = 'content';
	}

	function closeAllSelections() {
        getElement('page_3').className = 'hidden';
        getElement('page_1').className = 'hidden';
        getElement('page_0').className = 'content';
	}

	function selectSelections() {
		var value = getElement('select_selections').value;
		console.log('select_selections -> '+value);
		output('select_selections -> '+value);

		switch (value)
		{
			case '---': break;
			case 'show_all_selections':
				//that will show the prompt page with all selections listed
				//or an overview
				showAllSelections();
				break;
			case 'add_new_selection':
				var _sel = new DataModel.SlideSelection(current.uidcounter.createNew());
				current.currentSelection = _sel;
				current.selections.push(_sel);
				getElement('selection_name').value = _sel.getName();
				getElement('selection_id').innerHTML = _sel.uid;
				getElement('texts').innerHTML = '';
				console.log('ad current.currentSelection -> '+current.currentSelection.uid );
				output('ad current.currentSelection -> '+current.currentSelection.uid );
				var _ele = getElement('select_selections');
				var _htm = '<option value="---">---</option><option value="show_all_selections">show_all_selections</option><option value="add_new_selection">add_new_selection</option><option value="delete_this_selection">delete_this_selection</option>';
				for (var j = 0; j < current.selections.length; j++) {
					_htm = _htm + '<option value="' + current.selections[j].uid + '">edit '+current.selections[j].uid+'</option>';
				}
				_ele.innerHTML = _htm;
				break;
			case 'delete_this_selection':
				var _uid = current.currentSelection.uid;
				deleteSelection(_uid);
				break;
			default:
				//edit that selection specified by uid = value;
				editSelection(value);
			break;
		}
		var element = getElement('select_selections');
		for (var i = 0; i < element.options.length; i++) {
			element.options[i].selected = false;
		}
	}

	function editSelection(_uid) {
	    getElement('page_0').className = 'hidden';
	    getElement('page_2').className = 'hidden';
	    getElement('page_3').className = 'hidden';
	    getElement('page_1').className = 'content';
	    var _sel = current.getSelection(_uid);
		if (_sel == null) return;
		current.currentSelection = _sel;
		getElement('selection_name').value = _sel.getName();
		getElement('selection_id').innerHTML = _sel.uid;
		updateAllTexts();
	}

	function updateSelectionName() {
		current.currentSelection.setName(getElement('selection_name').value);
		console.log('selection_name -> '+getElement('selection_name').value);
		output('selection_name -> '+getElement('selection_name').value);
	}

	function deleteThisSelection(_uid) {
	    for (var i = 0; i < current.selections.length; i++)
		{
			if (current.selections[i].hasUid(_uid))
			{
				current.selections.splice(i, 1);
				current.uidcounter.removeCounter(_uid);
			}
		}
	    showAllSelections();
	}

	function deleteSelection(_uid) {
		var pos = 0;
		for (var i = 0; i < current.selections.length; i++)
		{
			if (current.selections[i].hasUid(_uid))
			{
				current.selections.splice(i, 1);
				current.uidcounter.removeCounter(_uid);
				pos = i;
			}
		}
		current.currentSelection = null;
		//goto previous or
		//goto next or
		var _uid = null;
		if (current.selections.length > 0 && pos > 0)
		{
			_uid = current.selections[pos - 1].uid;
		} else if (current.selections.length > 0)
		{
			_uid = current.selections[1].uid;
		}
		console.log('deleteSelection -> '+_uid+' pos = '+pos+' '+current.selections.length);
		output('deleteSelection -> '+_uid+' pos = '+pos);
		showSelection(_uid);
		//goto page_0 (the create a new interactive text page)
	}

	function showSelection(_uid) {
		if (_uid != null)
		{
			current.currentSelection = current.getSelection(_uid);
			getElement('selection_id').innerHTML = current.currentSelection.uid;
			getElement('selection_name').value = current.currentSelection.getName();
			var _ele = getElement('select_selections');
			var _htm = '<option value="---">---</option><option value="show_all_selections">show_all_selections</option><option value="add_new_selection">add_new_selection</option><option value="delete_this_selection">delete_this_selection</option>';
			for (var j = 0; j < current.selections.length; j++) {
				_htm = _htm + '<option value="' + current.selections[j].uid + '">edit '+current.selections[j].uid+'</option>';
			}
			_ele.innerHTML = _htm;
			updateAllTexts();
		} else try {
			getElement('texts').innerHTML = '';
			getElement('selection_id').innerHTML = '';
			getElement('selection_name').valueL = '';
			getElement('page_1').className= 'hidden';
			getElement('page_0').className= 'content';
		} catch (e) { }
	}

	function updateAllTexts() {
		getElement('texts').innerHTML = '';
		var tmp = getElement('#id#_text').innerHTML;
		var _htm = '';
		var _ele = null;
		for (var i = 0; i < current.currentSelection.texts.length; i++ )
		{
			var text = current.currentSelection.texts[i];
			var element = document.createElement('div');
			element.innerHTML = tmp.replace(/#id#/g, ''+text.uid);
			element.id = 'text_'+text.uid;
			element.className = 'section';
			getElement('texts').appendChild(element);
			getElement(text.uid+'_textarea').value = text.getText();
			_ele = getElement('select_text_target_'+text.uid);
			_htm = '<option value="---">-set a link target-</option><option value="link_selection">link to new selection</option>';
			for (var j = 0; j < current.selections.length; j++) {
				_htm = _htm + '<option value="' + current.selections[j].uid + '">selection '+current.selections[j].uid+'</option>';
			}
			_ele.innerHTML = _htm;
		}
	}

	function deleteText(_uid) {
		current.currentSelection.removeText(_uid);
		current.uidcounter.removeCounter(_uid);
		updateAllTexts();
	}

	function updateFullText(_uid) {
		current.currentSelection.getText(_uid).setText(getElement('textarea_'+_uid).value);
	}

	function updateText(_uid) {
		current.currentSelection.getText(_uid).setText(getElement(_uid+'_textarea').value);
		console.log('updateText -> '+_uid+' '+getElement(_uid+'_textarea').value);
		output('updateText -> '+_uid+' '+getElement(_uid+'_textarea').value);
	}

	function newText() {
		var text = new DataModel.SlideText(current.uidcounter.createNew());
		current.currentSelection.addText(text);
		var tmp = getElement('#id#_text').innerHTML;
		var element = document.createElement('div');
		element.innerHTML = tmp.replace(/#id#/g, ''+text.uid);
		element.id = 'text_'+text.uid;
		element.className = 'section';
		getElement('texts').appendChild(element);
		var _ele = getElement('select_text_target_'+text.uid);
		var	_htm = '<option value="---">-set a link target-</option><option value="link_selection">link to new selection</option>';
		for (var j = 0; j < current.selections.length; j++) {
			_htm = _htm + '<option value="' + current.selections[j].uid + '">selection '+current.selections[j].uid+'</option>';
		}
		_ele.innerHTML = _htm;
	}
    /**
    @method editFullText
    */
	function editFullText(_uid) {
	    var tmp = getElement('page_#id#').innerHTML;
	    getElement('page_2').innerHTML = tmp.replace(/#id#/g, _uid);

	    //set values before you show this
        getElement('page_1').className = 'hidden';
        getElement('page_2').className = 'content';
	}
    /**
    @method closeFullText

    @desc
    makes page_1 visible and hides page_2 fulltext
    to make all changes made in full text visible
    update all texts is called
    */
	function closeFullText() {
        getElement('page_2').className = 'hidden';
        updateAllTexts();
        getElement('page_1').className = 'content';
	}
    /**
    @method setTextTarget
    */
	function setTextTarget(_uid) {
		textTarget(getElement('select_text_target_'+_uid).value, _uid);
	}
    /**
    @method setFullTextTarget
    */
	function setFullTextTarget(_uid) {
	    //#id#_select_text_target
	    textTarget(getElement(_uid+'_select_text_target').value, _uid);
	}
    /**
    @method textTarget

    @desc
    final method for for methods setTextTarget and setFullTextTarget
    sets the link to the text specified by the uid (default) or creates
    a new selection for the link
    */
	function textTarget(value, _uid) {
		switch (value) {
		    case '---':
		    break;
		    case 'link_selection':
		        var _sel = new DataModel.SlideSelection(current.uidcounter.createNew());
                current.currentSelection.getText(_uid).setTarget(_sel.uid);
				current.currentSelection = _sel;
				current.selections.push(_sel);
				getElement('selection_name').value = _sel.getName();
				getElement('selection_id').innerHTML = _sel.uid;
				getElement('texts').innerHTML = '';
				console.log('ad current.currentSelection -> '+current.currentSelection.uid );
				output('ad current.currentSelection -> '+current.currentSelection.uid );
				var _ele = getElement('select_selections');
				var _htm = '<option value="---">---</option><option value="show_all_selections">show_all_selections</option><option value="add_new_selection">add_new_selection</option><option value="delete_this_selection">delete_this_selection</option>';
				for (var j = 0; j < current.selections.length; j++) {
					_htm = _htm + '<option value="' + current.selections[j].uid + '">edit '+current.selections[j].uid+'</option>';
				}
				_ele.innerHTML = _htm;
				getElement('page_1').className = 'content';
				getElement('page_0').className = 'hidden';
				getElement('page_2').className = 'hidden';
				getElement('page_3').className = 'hidden';
		    break;
		    default:
		        current.currentSelection.getText(_uid).setTarget(value);
		    break;
		}
	}

	/*##################################
	global functions
	*/

	/**
	@method getElement

	@desc
	returns the dom-tree element specified by the given id
	*/
	function getElement(id) {
		return document.getElementById(id);
	}
    /**
	@method output

	@param str [String] id of the wanted element
	*/
	function output(str) {
		getElement('output').innerHTML = str;
	}
