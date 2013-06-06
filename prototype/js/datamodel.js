/**
@license
Licensed to hogventure.com under one
<br>or more contributor license agreements.  See the NOTICE file
<br>distributed with this work for additional information
<br>regarding copyright ownership.  The hogventure.com licenses this file
<br>to you under the hogventure.com License, Version 1.0 (the
<br>"License"); you may not use this file except in compliance
<br>with the License. You may obtain a copy of the License at
<br>
<br>         http://www.hogventure.com/purchase.html
<br>
<br>Unless required by applicable law or agreed to in writing,
<br>software distributed under the License is distributed on an
<br>"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
<br>KIND, either express or implied.  See the License for the
<br>specific language governing permissions and limitations
<br>under the License.<br>
*/
/*
@author Malte Kosian
@since 2012-06-01
@version 2013-06-06

@namespace DataModel
@namespace window
@since 2013-06-06
*/
  /*########################################
    Classes
  #########################################*/
  
  /**
  @GameText
  */
  function GameText(_id) {
    this.uid = _id;
    this.next = null;
    this.text = null;
    this.wrong = false;
    this.points = 0;
    this.method = null;
    this.audio = null;
    this.logo = null;
  }
  /**
  @class GameDialog
  */
  function GameDialog(_id) {
    this.uid = _id;
    this.texts = [];
    this.image = null;
    this.audio = null;
    this.x = null;
    this.y = null;
    this.w = null;
    this.h = null;
    this.color = null;
  }
  /**
  @class UidCounter
  */
  function UidCounter () {
    this.counters = [];

    this.createNew = function () {
      var abc = 'abcdefghjklmnopqrstuvwxyz0123456789_ABCDEFGHJKLMNOPQRSTUVWXYZ';
      var c = '';
      while (c.length < 5 || this.hasCounter(c) ){
        c = '';
        for (var i = 0; i < 5; i++) {
          c = c + abc.substr(Math.abs (Math.random() * abc.length), 1);
        }
        if (c.length == 5 && !isNaN(c)) {
          c = c.substr(0,4);
        }
      }
      this.counters.push(c);
      return c;
    };

    this.hasCounter = function(c) {
      for (var i = 0; i < this.counters.length; i++) {
        if (this.counters [i] == c) {
          return true;
        }
      }
      return false;
    };
    
    this.store = function() {
      return JSON.stringify(this, function(key, value) {
        return value;
      });
    }
    
    this.load = function(json) {
      this.counters = json['counters'];
    }
  }
  /**
  @class TextManager
  */
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
