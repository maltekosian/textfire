//var textmanager = null;
//var mediamanager = null;

//var update = false;

//datamodel
/**
@class project

@desc project is a singelton
*/
var project = {
  uid : null,
  title : null, 
  startMemoRef : null,
  datamodel : null,
  overview : null,
  mediamanager : new MediaManager(),
  textmanager : new TextManager(),
  uidCounter : null,

  setTitle : function(_t) {
    if (this.title == null) {
      this.title = this.uidCounter.createNew();
    }
    textmanager.addText(this.title, _t);
  },

  getTitle : function() {
    return textmanager.getText(this.title);
  },

  export : function() {
    this.uid = '' + this.uid;
    this.title = '' + this.title;
    return JSON.stringify(this, function(key, value) {
      switch (key) {
      case 'uid': return value;
      case 'title': return value; 
      case 'startMemoRef': return value;
      case 'datamodel': return (this.datamodel == null ? null : 'datamodel');
      case 'overview': return (this.overview == null ? null : 'overview');
      case 'mediamanager': return 'mediamanager';
      case 'textmanager': return 'textmanager';
      case 'uidCounter': return 'uidcounter';    
      }
      return value;
    });
  },

  store : function() {
    this.uid = '' + this.uid;
    this.title = '' + this.title;
    return JSON.stringify(this, function(key, value) {
      return value;
    });
  },

  load : function(json) {
    this.uid = json['uid'];
    this.startMemoRef = json['startMemoRef'];
    this.overview = new Overview();
    this.overview.load(json['overview']);
    this.uidCounter.load(json['uidCounter']);
    if (json['mediamanager'] != null) {
      this.mediamanager = new MediaManager();
      this.mediamanager.load(json['mediamanager']);
      mediamanager = this.mediamanager;
    }
    if (json['textmanager'] != null) {
      this.textmanager = new TextManager();
      this.textmanager.load(json['textmanager']);
      textmanager = this.textmanager;
    }
    this.title = json['title'];
    if (this.title.split(' ') > 1) {
      var _t = this.title;
      this.title = this.uidCounter.createNew();
      textmanager.setText(this.title, _t);
    }
    this.datamodel.load(json['datamodel']);
  }
};
/**
@class DataModel
*/
function DataModel() {
  this.memos = [];

  this.removeMemo = function(_uid) {
    for (var i = 0; i < this.memos.length; i++) {
      if (this.memos[i].uid == _uid) {
        this.memos.splice(i,1);
      }
    }
  }

  this.getMemo = function(_uid) {
    for (var i = 0; i < this.memos.length; i++) {
      if (this.memos[i].uid == _uid) {
        return this.memos[i];
      }
    }
    return null;
  }

  this.export = function() {
    return JSON.stringify(this, function(key, value) {
      return value;
    });
  }

  this.import = function(json) {
    this.memos = [];
    for (var i = 0; i < json['memos'].length; i++) {
      this.memos.push(new Memo());
      this.memos[i].load(json['memos'][i]);
    }
  }

  this.store = function() {
    return JSON.stringify(this, function(key, value) {
      return value;
    });
  }

  this.load = function(json) {
    this.memos = [];
    for (var i = 0; i < json['memos'].length; i++) {
      this.memos.push(new Memo());
      this.memos[i].load(json['memos'][i]);
    }
  }
}

function KeyValue(_k, _v) {
  this.key = _k;
  this.value = _v;
  this.type = null; 

  this.hasKey = function(_k) {
    return (this.key === _k);
  }

  this.setValue = function(_v) {
    this.value = _v;
  }

  this.setType = function(_t) {
    this.type = _t;
  }

  this.getType = function() {
    return this.type;
  }

  this.hasType = function(_t) {
    return (this.type == _t);
  }
}

function TextManager() {
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
      this.currentLanguage = new TextLanguage(_lan);
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
  @method setText
  */
  this.addText = function(_k, _v) {
    var cl = this.getCurrentLanguage();
    cl.setText(_k, _v);
  }
  /**
  @method getText
  */
  this.getText = function(_k) {
    var cl = this.getCurrentLanguage();
    return cl.getText(_k);
  }

  this.export = function() {
    return JSON.stringify(this, function(key, value) {
      if (key == 'languages') {
        value = [];
        for (var i = 0; i < this.languages.length; i++) {
          value.push(this.languages[i].language);
        }
      }
      return value;
    });
  }

  this.import = function(json) {
    this.lan = json['lan'];
    this.languages = [];
    if (json['languages'] != null) {
      for (var i = 0; i < json['languages'].length; i++)
      {
        this.languages[i] = new TextLanguage(json['languages'][i]['language']);    
      }
      this.currentLanguage = this.getLanguage(this.lan);
    }
  }
  /**
  @method load
  */
  this.load = function(json) {
    this.lan = json['lan'];
    this.languages = [];
    if (json['languages'] != null) {
      for (var i = 0; i < json['languages'].length; i++)
      {
        this.languages[i] = new TextLanguage();
        this.languages[i].load(json['languages'][i]);
      }
      this.currentLanguage = this.getLanguage(this.lan);
    }
  }
  /**
  @method store
  */
  this.store = function() {
    return JSON.stringify(this, function(key, value) {
      return value;
    });
  }
};

/**
@class TextLanguage
*/
function TextLanguage(_lan) {
  this.language = _lan;
  this.texts = []; //an array of keyvalues base64 encoded!
  /**
  @method setText
  */
  this.setText = function(_k, _v) {
    if (this.hasText(_k))
    {
      for (var i = 0; i < this.texts.length; i++)
      {
        if (this.texts[i].key == _k)
        {
          this.texts[i].value = Base64.encode(_v);
        }
      }
    } else {
      this.texts.push(new KeyValue(_k, Base64.encode(_v)));
    }
  }
  /**
  @method hasText
  */
  this.hasText = function(_k) {
    for (var i = 0; i < this.texts.length; i++)
    {
      if (this.texts[i].key == _k)
      {
        return true;
      }
    }
    return false;
  }
  /**
  returns the value of the key value pair or null!
  @method getText
  */
  this.getText = function(_k) {
    for (var i = 0; i < this.texts.length; i++)
    {
      if (this.texts[i].key === _k) {
        return Base64.decode(this.texts[i].value);
      }
    }
    return null;
  }
  /**
  returns the value of the key value pair or null!
  @method removeText
  */
  this.removeText = function(_k) {
    for (var i = 0; i < this.texts.length; i++)
    {
      if (this.texts[i].key == _k) {
        this.texts.splice(i,1);
      }
    }
  }
  /**
  @method load
  */
  this.load = function(json) {
    this.texts = [];
    for (var i = 0; i < json['texts'].length; i++) {
      if (!this.hasText(json['texts'][i]['key'])) {
        this.texts.push(new KeyValue(json['texts'][i]['key'], json['texts'][i]['value']));
      }
    }    
    this.language = json['language'];    
  }
  /**
  @method store
  */
  this.store = function() {
    return JSON.stringify(this, function(key, value) {
      return value;
    });
  }
};
/**
@class MediaManager

*/
function MediaManager() {
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
      this.currentLanguage = new MediaLanguage(_lan);
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

  this.addImage = function(_k, _v) {
    var cl = this.getCurrentLanguage();
    cl.addImage(_k, _v); 
  }

  this.hasImage = function(_k) {
    var cl = this.getCurrentLanguage();
    return cl.hasImage(_k);
  }

  this.getImage = function(_k) {
    var cl = this.getCurrentLanguage();
    return cl.getImage(_k);
  }

  this.removeImage = function(_k) {
    var cl = this.getCurrentLanguage();
    cl.removeImage(_k);
  }

  this.addAudio = function(_k, _v) {
    var cl = this.getCurrentLanguage();
    cl.addAudio(_k, _v); 
  }

  this.hasAudio = function(_k) {
    var cl = this.getCurrentLanguage(); 
    return cl.hasAudio(_k); 
  }

  this.getAudio = function(_k) {
    var cl = this.getCurrentLanguage(); 
    return cl.getAudio(_k); 
  }

  this.removeAudio = function(_k) {
    var cl = this.getCurrentLanguage(); 
    cl.removeAudio(_k); 
  }
  /**
  */
  this.export = function() {
    return JSON.stringify(this, function(key, value) {
      if (key == 'languages') {
        value = [];
        for (var i = 0; i < this.languages.length; i++) {
          value.push(this.languages[i].language);
        }
      }
      return value;
    });
  }
  /**
  */
  this.import = function(json) {
    this.lan = json['lan'];
    this.languages = [];
    if (json['languages'] != null) {
      for (var i = 0; i < json['languages'].length; i++) {
        this.languages[i] = new MediaLanguage(json['languages'][i]['language']);
      }
      this.currentLanguage = this.getLanguage(this.lan);
    }
  }
  /**
  @method load
  */
  this.load = function(json) {
    this.lan = json['lan'];
    this.languages = [];
    if (json['languages'] != null) {
      for (var i = 0; i < json['languages'].length; i++)
      {
        this.languages[i] = new MediaLanguage();
        this.languages[i].load(json['languages'][i]);
      }
      this.currentLanguage = this.getLanguage(this.lan);
    }
  }
  /**
  @method store
  */
  this.store = function() {
    return JSON.stringify(this, function(key, value) {
      return value;
    });
  }
}
/**
@class MediaLanguage
*/
function MediaLanguage(_lan) {
  this.language = _lan;
  this.imagess = []; //image and images are keywords
  this.audios = []; 
  /**
  @method addImage
  */
  this.addImage = function(_k, _v) {
    if (this.hasImage(_k))
    {
      for (var i = 0; i < this.imagess.length; i++)
      {
        if (this.imagess[i].key == _k)
        {
          this.imagess[i].value = _v;
        }
      }
    } else {
      this.imagess.push(new KeyValue(_k, _v));
    }
  }
  /**
  @method hasImage
  */
  this.hasImage = function(_k) {
    for (var i = 0; i < this.imagess.length; i++)
    {
      if (this.imagess[i].key == _k)
      {
        return true;
      }
    }
    return false;
  }
  /**
  returns the value of the key value pair or null!
  @method getImage
  */
  this.getImage = function(_k) {
    for (var i = 0; i < this.imagess.length; i++)
    {
      if (this.imagess[i].key === _k) {
        return this.imagess[i].value;
      }
    }
    return null;
  }
  /**
  @method removeImage
  */
  this.removeImage = function(_k) {
    for (var i = 0; i < this.imagess.length; i++)
    {
      if (this.imagess[i].key == _k) {
        this.imagess.splice(i,1);
      }
    }
  }
  /**
  @method addAudio
  */
  this.addAudio = function(_k, _v) {
    if (this.hasAudio(_k))
    {
      for (var i = 0; i < this.audios.length; i++)
      {
        if (this.audios[i].key == _k)
        {
          this.audios[i].value = _v;
        }
      }
    } else {
      this.audios.push(new KeyValue(_k, _v));
    }
  }
  /**
  @method hasAudio
  */
  this.hasAudio = function(_k) {
    for (var i = 0; i < this.audios.length; i++)
    {
      if (this.audios[i].key == _k)
      {
        return true;
      }
    }
    return false;
  }
  /**
  returns the value of the key value pair or null!
  @method getAudio
  */
  this.getAudio = function(_k) {
    for (var i = 0; i < this.audios.length; i++)
    {
      if (this.audios[i].key === _k) {
        return this.audios[i].value;
      }
    }
    return null;
  }
  /**
  @method removeAudio
  */
  this.removeAudio = function(_k) {
    for (var i = 0; i < this.audios.length; i++)
    {
      if (this.audios[i].key == _k) {
        this.audios.splice(i,1);
      }
    }
  }
  /**
  @method load
  */
  this.load = function(json) {
    this.imagess = [];
    this.audios = [];
    for (var key in json) {
      switch (key)
      {
      case 'imagess':
        for (var i = 0; i < json[key].length; i++)
        {
          //if (json[key][i]['key'].length == 5) {
          this.imagess.push(new KeyValue(json[key][i]['key'], json[key][i]['value'] ) );
          //}
        }
      break;
       case 'audios':
        for (var i = 0; i < json[key].length; i++)
        {
          //if (json[key][i]['key'].length == 5) {
          this.audios.push(new KeyValue(json[key][i]['key'], json[key][i]['value'] ) );
          //}
        }
      break;
      default: 
        this[key] = json[key];
      break;
      }		
    }
  }
  /**
  @method store
  */
  this.store = function() {
    return JSON.stringify(this, function(key, value) {
      return value;
    });
  }
  /**
  @method export
  */
  this.export = function() {
    return JSON.stringify(this, function(key, value) {
      if (key == 'imagess') {
        return this.imagess.length;
      }
      if (key == 'audios') {
        return this.audios.length;
      }
      return value;
    });
  }
  /**
  @method import
  */
  this.import = function(json) {
    this.imagess = [];
    this.audios = [];
    for (var key in json) {
      switch (key)
      {
      case 'imagess':
        
      break;
      case 'audios':
        
      break;
      default: 
        this[key] = json[key];
      break;
      }		
    }
  }
};
/**
@class Memo

@param _uid
*/
function Memo(_uid){
  this.uid = _uid;
  this.text = null;
  this.plugin = null;
  this.audioRef = null;
  this.imageRef = null;
  this.isPlugin = false;
  this.linkRefs = [];
  this.keyValues = [];
  this.title = null;
  this.type = 'text'; //text is default
  this.board = [];
  this.memberOf = null;
  
  this.hasLink = function(_uid) {
    for (var i = 0; i < this.linkRefs.length; i++) {
      if (this.linkRefs[i] == _uid) {
        return true;
      }
    }
    return false;
  }

  this.getAudioRef = function() {
    return mediamanager.getAudio(this.audioRef);
  }

  this.setAudioRef = function(_a) {
    if (this.audioRef == null) {
      this.audioRef = project.uidCounter.createNew();
    }
    mediamanager.addAudio(this.audioRef, _a);
  }
  
  this.getImageRef = function() {
    return mediamanager.getImage(this.imageRef);
  }

  this.setImageRef = function(_i) {
    if (this.imageRef == null) {
      this.imageRef = project.uidCounter.createNew();
    }
    mediamanager.addImage(this.imageRef, _i);
  }

  this.setPlugin = function(_p) {
    if (this.plugin == null) {
      this.plugin = project.uidCounter.createNew();
    }
    textmanager.addText(this.plugin, _p);
  }

  this.getPlugin = function() {
    return textmanager.getText(this.plugin);
  }

  this.setText = function(_t) {
    if (this.text == null) {
      this.text = project.uidCounter.createNew();
    }
    textmanager.addText(this.text, _t);
  }

  this.getText = function() {
    return textmanager.getText(this.text);
  }

  this.setTitle = function(_t) {
    if (this.title == null) {
      this.title = project.uidCounter.createNew();
    }
    textmanager.addText(this.title, _t);
  }

  this.getTitle = function() {
    return textmanager.getText(this.title);
  }

  this.setType = function(_type) {
    this.type = _type;
  }

  this.getType = function() {
    return this.type;
  }
  
  this.addLink = function (_l) {
    this.linkRefs.push (_l);
  }
  
  this.removeLink = function (_l) {
    for (var i = 0; i < this.linkRefs.length; i++) {
      if (this.linkRefs[i] == _l) {
        this.linkRefs.splice(i, 1);
      }
    }
  }

  this.addMember = function (_ref) {
    if (!this.hasMember(_ref)) {
      this.board.push(_ref);
    }    
  }
  
  this.removeMember = function (_ref) {
    for (var i = 0; i < this.board.length; i++) {
      if (this.board[i] == _ref) {
        this.board.splice(i, 1);
      }
    }
  }

  this.hasMember = function (_ref) {
    for (var i = 0; i < this.board.length; i++) {
      if (this.board[i] == _ref) {
        return true;
      }
    }
    return false;
  }

  this.setMemberOf = function(b_ref) {
    this.memberOf = b_ref;
  }

  this.isMemberOf = function(b_ref) {
    return (this.memberOf == b_ref);
  }

  this.getMemberOf = function() {
    return this.memberOf;
  }

  this.isBoard = function() {
    return (this.board.length > 0);
  }

  this.store = function() {
    return JSON.stringify(this, function(key, value) {
      return value;
    });
  }

  this.load = function(json) {
    this.uid = json['uid'];
    this.text = json['text'];
    this.type = json['type'];
    this.plugin = json['plugin'];
    this.isPlugin = json['isPlugin'];  
    if (this.isPlugin && this.type == null) {
      this.plugin = this.text;
      this.type = 'plugin';
      this.text = null;
      this.isPlugin = false;
    }
    this.linkRefs = json['linkRefs'];
    this.title = json['title'];
    this.imageRef = json['imageRef'];
    this.audioRef = json['audioRef'];
    this.keyValues = [];   
    if (json['keyValues'] != null) {
      for (var i = 0; i < json['keyValues'].length; i++) {
        this.keyValues.push(new KeyValue(json['keyValues'][i]['key'], json['keyValues'][i]['value'] ) );
      }
    }
    if (this.getText() == null && this.text != null) this.text = null; 
  }
}

/**
@class Game
@constructor 
*/
function Game() {
  this.uid = null;
  this.title = null; 
  this.startMemoRef = null;
  this.datamodel = new DataModel();
  this.mediamanager = new MediaManager();
  this.textmanager = new TextManager();
  this.visited = [];
  this.func = null;
  this.currentObjects = [];
  this.keyValues = [];

  this.getMemo = function(_uid) {
    return this.datamodel.getMemo(_uid);
  }

  this.getAllMemos = function() {
    return this.datamodel.memos;
  }

  this.export = function() {
    return JSON.stringify(this, function(key, value) {
      return value;
    });
  }
  
  this.store = function() {
    return JSON.stringify(this, function(key, value) {
      if (key == 'func') {
        try
        {
          return func.store();
        }
        catch (e)
        {
          console.log(e);
        } 
      }
      return value;
    });
  }

  this.load = function(json) {
    this.uid = json['uid'];
    this.title = json['title'];
    this.startMemoRef = json['startMemoRef'];
    if (json['visited'] != null) { 
      this.visited = json['visited'];
    }
    if (json['mediamanager'] != null) {
      this.mediamanager.load(json['mediamanager']);
      mediamanager = this.mediamanager;
    }
    if (json['textmanager'] != null) {
      this.textmanager.load(json['textmanager']);
      textmanager = this.textmanager;
    }
    this.datamodel.load(json['datamodel']);
  }

  this.mousePressed = function(x, y) {}
  this.mouseMoved = function(x, y) {}
  this.mouseReleased = function(x, y) {
    console.log('game.mouseReleased = '+x+', '+y);
    for (var i = 0; i < this.currentObjects.length; i++) {
      if (this.currentObjects[i].isHit(x, y)) {
        playGameMemo(this.currentObjects[i].uid);
        return true;
      }
    }
    return false;
  }
}

