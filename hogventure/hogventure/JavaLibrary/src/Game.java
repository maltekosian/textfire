
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Random;
import java.util.logging.Logger;
import org.json.me.JSONArray;
import org.json.me.JSONObject;

/*
Using a prototype method:
Notice the recursion going on; isn"t it divine?
The clone() method steps through the properties of any object one by one.
If the property is itself an object or array, it calls the clone() method on that object too.
If the property is anything else, it just takes the value of the property.
Then the result received is assigned to a property of the same name in a new object.
 *//*
Object.prototype.clone() {
var newObj = (this instanceof Array) ? [] : {};
for (i in this) {
if (i == "clone") continue;
if (this.get(i) && typeof this.get(i) == "object") {
newObj.get(i) = this.get(i).clone();
} else newObj.get(i) = this.get(i)
}
return newObj;
};*/
/* 
Function: Array.prototype.inArray

Returns true if the passed value is found in the
array. Returns false if it is not.

Params: value
 */

/* 
Variable: project
global project */
/*
Variable: game
global game*/
/*
Class: Project

the project data model
contains the slideshow
the uidcounter
and the dialogutil
 */
class Project {

	private UidCounter counter;
	private Slideshow slideshow;
	private Overview overview;

	public Project() {
		this.counter = new UidCounter();
		this.slideshow = new Slideshow();
		this.overview = new Overview();
	}
	/*
	Function: init
	 */

	public void init() {
		this.counter = new UidCounter();
		this.slideshow = new Slideshow();
		this.overview = new Overview();
	}
	/*
	Function: load
	
	Params: jsonstr
	 */

	public void load(JSONObject jso) throws Exception {
		//this.counter.load(jsonstr["counter"]);
		//this.slideshow.load(jsonstr["slideshow"]);
		//this.overview.load(jsonstr["overview"]);
	}
	/*
	Function: store
	
	Returns: a json string
	 */

	public String store() {
		return "";//JSON.stringify(this); 
	}
	/*
	Function: createNewSlide
	
	creates a new Slide and adds it to the slides array,
	the reference "uid" to the overview as an OverviewSlide,
	and sets the slide as the currentSlide in the slideshow.
	 */

	public void createNewSlide() {
		ArrayList<OverviewSlide> o_slides = this.overview.getOverviewSlides();
		for (int i = 0; i < o_slides.size(); i++) {
			o_slides.get(i).setMarked( false );
		}
		Slide slide = new Slide(this.counter.createUid());
		this.slideshow.addSlide(slide);
		this.slideshow.setCurrentSlide(slide);
		this.overview.addSlide(slide.getUid());
	}
}
/*
Class: UidCounter

creates and stores all used uids.
a single uid is 5 letters long
 */

class UidCounter {

	private ArrayList uids;

	public UidCounter() {
		this.uids = new ArrayList();
	}

	/*
	Function: createUid
	
	creates a new uid and stores it in the uids array
	
	Returns: new uid
	 */
	public String createUid() {
		Random random = new Random();
		String newUid = "";
		String abc = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		while (hasUid(newUid) || newUid.length() < 5 ) {
			newUid = "";
			for (int i = 0; i < 5; i++) {
				newUid = newUid + abc.charAt((int) Math.floor(random.nextInt() * abc.length()) );
			}
		}
		uids.add(newUid);
		return newUid;
	}
	/*
	Function: setUids
	
	Params: _uids
	 */

	public void setUids(ArrayList _uids) {
		this.uids = _uids;
	}
	/*
	Function: hasUid
	
	Params: _uid an unique identifier
	
	Returns: true if the given uid is contained in the uids array
	 */

	public boolean hasUid(String _uid) {

		return uids.contains(_uid);
	}
	/*
	Function: load
	
	Params: jsonstr
	 */

	public void load(JSONObject jso) throws Exception {
		//this.uids = jsonstr["uids"];
	}
}
/*
Class: Game

the game is the datamodel for a slideshow played.
it can be stored as a savegame
 */

public class Game {

	public Slideshow getSlideshow() {
		return slideshow;
	}

	public void setSlideshow(Slideshow slideshow) {
		this.slideshow = slideshow;
	}

	private Slideshow slideshow;

	public Game() {
		this.slideshow = null;
	}
	/*
	Function: init
	 */

	public void init() {
		this.slideshow = new Slideshow();
	}
	/*
	Function: load
	
	Params: jsonstr
	 */

	public void load(String jsonstr) {
		this.slideshow = new Slideshow();
		try {
			JSONObject jso = new JSONObject(jsonstr);
			this.slideshow.load(jso.getJSONObject("slideshow"));
		} catch (Exception ex) {
                    System.out.println(ex);
		}
	}
	/*
	Function: store
	
	Returns: the game as an jsonstr
	 */

	public String store() {
		//return JSON.stringify(this);
		return null;
	}
}
/*
Class: Slideshow

basic class of the datamodel itself.
A multiple lines "slide show" of choices. It is named slideshow, because
the word slide is the most absract compared to sceen, room, stage etc.
 */

class Slideshow {

	public String getMetaData() {
		return metaData;
	}

	public void setMetaData(String metaData) {
		this.metaData = metaData;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getPoints() {
		return points;
	}

	public void setPoints(int points) {
		this.points = points;
	}

	public ArrayList<Slide> getSlides() {
		return slides;
	}

	public void setSlides(ArrayList<Slide> slides) {
		this.slides = slides;
	}

	public String getStartSlideRef() {
		return startSlideRef;
	}

	public void setStartSlideRef(String startSlideRef) {
		this.startSlideRef = startSlideRef;
	}

	public String getTitleImageRef() {
		return titleImageRef;
	}

	public void setTitleImageRef(String titleImageRef) {
		this.titleImageRef = titleImageRef;
	}

	public ArrayList getValues() {
		return values;
	}

	public void setValues(ArrayList values) {
		this.values = values;
	}

	public ArrayList<String> getVisitedSlideUids() {
		return visitedSlideUids;
	}

	public void setVisitedSlideUids(ArrayList<String> visitedSlideUids) {
		this.visitedSlideUids = visitedSlideUids;
	}

	public ArrayList<String> getVisitedTargetUids() {
		return visitedTargetUids;
	}

	public void setVisitedTargetUids(ArrayList<String> visitedTargetUids) {
		this.visitedTargetUids = visitedTargetUids;
	}

	private ArrayList<String> visitedSlideUids;
	private ArrayList<Slide> slides;
	private ArrayList<String> visitedTargetUids;
	private String startSlideRef;
	private Slide currentSlide;
	private String titleImageRef;
	private ArrayList values;
	private int points;
	private String name;
	private String metaData;

	public Slideshow() {
		this.slides = new ArrayList<Slide>();
		this.visitedSlideUids = new ArrayList<String>();
		this.visitedTargetUids = new ArrayList<String>();
		this.startSlideRef = null;
		this.currentSlide = null;
		this.points = 0;
		this.name = null;
		this.metaData = null;
		this.values = new ArrayList<KeyValue>();
		this.titleImageRef = null;
	}
	/*
	Function: getTargets
	
	the target model can be different
	pointing on all possible targets or 
	on
	slides and the dialogs and object inside the currentslide.
	we may make that a decission in the slideshow preferences  ->
	model one enables to effect changes in other slides than the current one
	having other multiple entry points than the first dialog in the chosen slide.
	
	implemented is the simple model two slides and d&o in cs
	
	Returns:
	
	all available targets of the slideshow excluding the currentslide
	but with it"s dialogs and objects.
	 */

	public ArrayList<Object> getTargets() {
		ArrayList<Object> targets = new ArrayList<Object>();
		for (int i = 0; i < this.slides.size(); i++) {
			if (!this.slides.get(i).hasUid(this.currentSlide.getUid())) {
				targets.add( this.slides.get(i) );
			} else {
				for (int j = 0; j < this.slides.get(i).getSelections().size(); j++) {
					targets.add( this.slides.get(i).getSelections().get(j));
				}
				for (int j = 0; j < this.slides.get(i).getObjects().size(); j++) {
					targets.add( this.slides.get(i).getObjects().get(j));
				}
			}
		}
		return targets;
	}
	/*
	Function: load
	
	Params: jsonstr
	 */

	public void load(JSONObject jso) throws Exception {
		this.slides = new ArrayList<Slide>();
		for (int i = 0; i < jso.getJSONArray("slides").length(); i++)
		{
			this.slides.add( new Slide( jso.getJSONArray("slides").getJSONObject(i).getString("uid") ) );
			this.slides.get(i).load(jso.getJSONArray("slides").getJSONObject(i));
		}
		this.visitedSlideUids = new ArrayList<String>();
		for (int i = 0; i < jso.getJSONArray("visitedSlideUids").length(); i++)
		{
			this.visitedSlideUids.add(jso.getJSONArray("visitedSlideUids").getString(i));
		}
		this.visitedTargetUids = new ArrayList<String>();
		for (int i = 0; i < jso.getJSONArray("visitedTargetUids").length(); i++)
		{
		this.visitedTargetUids.add( jso.getJSONArray("visitedTargetUids").getString(i));
		}
		this.startSlideRef = jso.getString("startSlideRef");
		this.currentSlide = getSlide(jso.getJSONObject("currentSlide").getString("uid"));
		this.points = jso.getInt("points");
		this.name = jso.getString("name");
		this.metaData = jso.getString("metaData");
		this.titleImageRef = jso.getString("titleImageRef");
		this.values = new ArrayList<KeyValue>();
		JSONArray jsa = jso.getJSONArray("values");
		for (int i = 0; i < jsa.length(); i++)
		{
			this.values.add(new KeyValue(jsa.getJSONObject(i).getString("key"),
				jsa.getJSONObject(i).get("value") ) );
		}
	}
	/*
	Function: store
	
	Use for team builds.
	Requires to store and load the slides of the slideshow seperatly.
	Use setSlides and setCurrentSlide!
	
	Returns: the whole mess of the slideshow,
	but the slides only by reference key *uid*!
	 */

	public String store() {
		/*JSON.stringify(this, function(key, value) {
		if (key == "slides")
		{
		var list = "";
		for (int i = 0; i < this.slides.size(); i++)
		{
		list = list + (i == 0 ? "" : ",") + slides.get(i).getUid();
		}
		return list;
		} else {
		return value;
		}
		});*/
		return null;
	}
	/*
	Function: callMethod
	
	Params: _slideUid, _targetUid, _method, values
	 */

	public void callMethod(String _slideUid, String _targetUid, String _method, String values) {
		/*values = JSON.parse(values);
		switch (_method)
		{
		default:
		this.currentSlide.setCurrentSelection(_targetUid);
		}
		if (!this.visitedSlideUids.inArray(_slideUid) )
		{
		this.visitedSlideUids[this.visitedSlideUids.size()] = _slideUid;
		}
		if (!this.visitedTargetUids.inArray(_slideUid) )
		{
		this.visitedTargetUids[this.visitedTargetUids.size()] = _targetUid;
		if (values["points"] != false)
		{
		this.points += values["points"];
		}
		}*/
	}
	/*
	Function: addSlide
	
	Params: _slide
	 */

	public void addSlide(Slide _slide) {
		this.slides.add(_slide);
	}
	/*
	Function: removeSlide
	
	Params: _slide
	 */

	public void removeSlide(Slide _slide) {
		slides.remove(_slide);
	}
	/*
	Function: getSlide
	
	Params: _uid
	
	Returns: the slide with the given uid or false
	 */

	public Slide getSlide(String _uid) {
		for (int i = 0; i < this.slides.size(); i++) {
			if (this.slides.get(i).hasUid(_uid)) {
				return this.slides.get(i);
			}
		}
		return null;
	}
	/*
	Function: setCurrentSlide
	
	Params: _slide
	 */

	public void setCurrentSlide(Slide _slide) {
		this.currentSlide = _slide;
	}
	/*
	Function: getCurrentSlide
	
	Returns: the current selected slide
	 */

	public Slide getCurrentSlide() {
		return this.currentSlide;
	}
}
/*
Class: SlideshowObject

a raw prototype 

See:
<Slide>
<SlideObject>
<SlidePlayer>
<SlideBag>
<SlidePlugin>
<SlideText>
<SlideSelection>
<SlideTarget>
 */

abstract class SlideshowObject {

	String uid = "";

	public SlideshowObject(String _uid) {
		this.uid = _uid;
	}

	public abstract String getUid();

	public abstract boolean hasUid(String _uid);
}

/*
Class: Slide
the basic element of a slideshow
 */
class Slide extends SlideshowObject {

	public String getMetaData() {
		return metaData;
	}

	public void setMetaData(String metaData) {
		this.metaData = metaData;
	}

	public ArrayList<SlideObject> getObjects() {
		return objects;
	}

	public void setObjects(ArrayList<SlideObject> objects) {
		this.objects = objects;
	}

	public SlidePlugin getPlugin() {
		return plugin;
	}

	public void setPlugin(SlidePlugin plugin) {
		this.plugin = plugin;
	}

	public ArrayList<SlideSelection> getSelections() {
		return selections;
	}

	public void setSelections(ArrayList<SlideSelection> selections) {
		this.selections = selections;
	}

	private ArrayList<SlideSelection> selections;
	private ArrayList<SlideObject> objects;
	private SlideSelection currentSelection;
	private String backgroundRef;
	private String name;
	private String metaData;
	private SlidePlugin plugin;
	private String currentObject;

	public Slide(String _uid) {
		super(_uid);

		this.selections = new ArrayList<SlideSelection>();
		this.objects = new ArrayList<SlideObject>();
		//this.hiddenObjects = new ArrayList();
		this.currentSelection = null;
		this.backgroundRef = null;
		this.name = null;
		this.metaData = null;
		this.plugin = null;
		this.currentObject = null;
	}
	/*
	Function: load
	
	Params: jsonstr
	 */

	public void load(JSONObject jso) throws Exception {
		this.selections = new ArrayList<SlideSelection>();
		JSONArray jsa = jso.getJSONArray("selections");
		for (int i=0; i < jsa.length(); i++)
		{
		this.selections.add( new SlideSelection(jsa.getJSONObject(i).getString("uid") ) );
		this.selections.get(i).load(jsa.getJSONObject(i));
		}
		this.currentSelection = this.getSelection(jso.getJSONObject("currentSelection").getString("uid") );
		this.objects = new ArrayList();
		jsa = jso.getJSONArray("objects");
		for (int i=0; i < jsa.length(); i++)
		{
			this.objects.add( new SlideObject(jsa.getJSONObject(i).getString("uid") ) );
			this.objects.get(i).load(jsa.getJSONObject(i));
		}
		this.name = jso.getString("name");
		this.metaData = jso.getString("metaData");
		this.backgroundRef =  jso.getString("backgroundRef");
		/*this.plugin = new SlidePlugin(jsonstr["plugin"]["uid"]);*/
	}

	/*
	Function: hasUid
	
	Params: _uid an unique identifier
	
	Returns: true if the given uid is the uid of this class
	 */
	@Override
	public boolean hasUid(String _uid) {
		return uid.equals(_uid);
	}

	@Override
	public String getUid() {
		return super.uid;
	}
		
	/*
	Function: addObject
	
	Params: _obj
	 */

	public void addObject(SlideObject _obj) {
		this.objects.add( _obj);
	}
	/*
	Function: removeObject
	
	Params: _obj
	 */

	public void removeObject(SlideObject _obj) {
		objects.remove(_obj);
	}
	/*
	Function: getObject
	
	Params: _uid
	
	Returns: the object with the given uid or false
	 */

	public SlideObject getObject(String _uid) {
		for (int i = 0; i < this.objects.size(); i++) {
			if (this.objects.get(i).hasUid(_uid)) {
				return this.objects.get(i);
			}
		}
		return null;
	}
	/*
	Function: setCurrentObject
	
	Params: _uid
	 */

	public void setCurrentObject(String _uid) {
		this.currentObject = _uid;
	}
	/*
	Function: getCurrentObject
	
	Returns: the current selected object
	 */

	public String getCurrentObject() {
		return this.currentObject;
	}
	/*
	Function: setBackgroundRef
	
	Params: _ref
	 */

	public void setBackgroundRef(String _ref) {
		this.backgroundRef = _ref;
	}
	/*
	Function: getBackgroundRef
	
	Returns: the background reference, an uid
	 */

	public String getBackgroundRef() {
		return this.backgroundRef;
	}	
	/*
	Function: addSelection
	
	Params: _selection
	 */

	public void addSelection(SlideSelection _selection) {
		this.selections.add( _selection);
	}
	/*
	Function: removeSelection
	
	Params: _selection
	 */

	public void removeSelection(SlideSelection _selection) {
		selections.remove(_selection);
	}
	/*
	Function: getSelection
	
	Params: _uid
	
	Returns: the selection eith the given uid or false
	 */

	public SlideSelection getSelection(String _uid) {
		for (int i = 0; i < this.selections.size(); i++) {
			if (this.selections.get(i).hasUid(_uid)) {
				return this.selections.get(i);
			}
		}
		return null;
	}
	/*
	Function: setCurrentSelection 
	
	Params: _selection
	 */

	public void setCurrentSelection(SlideSelection _selection) {
		this.currentSelection = _selection;
	}
	/*
	Function: getCurrentSelection
	
	Returns: the current selection
	 */

	public SlideSelection getCurrentSelection() {
		return this.currentSelection;
	}
	/*
	Function: hasTarget
	
	Returns: true if slide has a target with the given uid
	 */

	public boolean hasTarget(String _uid) {
		for (int i = 0; i < this.selections.size(); i++) {
			for (int j = 0; j < this.selections.get(i).texts.size(); j++) {
				if (_uid.equals(selections.get(i).texts.get(j).target.slideUid)) {
					return true;
				}
			}
		}
		for (int i = 0; i < this.objects.size(); i++) {
			if (_uid.equals(objects.get(i).target.slideUid)) {
				return true;
			}
		}
		return false;
	}
	/*
	Function: initPlugin
	
	Params: _uid
	 */

	public void initPlugin(String _uid) {
		plugin = new SlidePlugin(_uid);
		ArrayList values = new ArrayList();
		values.add("objects");
		values.add("selections");
		this.plugin.setTmpFunc(values);
	}
	/**/

	public void setName(String _name) {
		this.name = _name;
	}
	/**/

	public String getName() {
		return this.name;
	}
}
/*
Class: SlidePlugin

Where you can script the parent slides behavior
 */

class SlidePlugin extends SlideshowObject {
	private Slide slide;
	private ArrayList eventListeners;
	private String intervalID;
	private Object tmpFunc;
	private String code;
	private ArrayList values;

	public SlidePlugin(String _uid) {
		super(_uid);
		this.slide = null;
		this.tmpFunc = null;
		this.code = "";
		this.values = null;
		this.intervalID = null;
		this.eventListeners = new ArrayList();
	}
	
	public boolean hasUid(String _uid) {
		return uid.equals(_uid);
	}
	
	public String getUid() {
		return super.uid;
	}
	/*
	Function: load
	
	Params: jsonstr
	 */

	public void load(JSONObject jso) throws Exception {
		/*
		this.slide = false;
		this.tmpFunc = false;
		this.code = "";
		this.values = false;
		this.intervalID = false;
		this.eventListeners = new ArrayList();
		*/
	}
	/*
	Function: setTmpFunc
	
	Params: _values
	 */

	public void setTmpFunc(ArrayList _values) {
		this.values = _values;
		/*
		var _call = "game.slideshow.getCurrentSlide().plugin.";
		//var str = _call + "tmpFunc = {";
		var str = "{";
		
		for (int i = 0; i < _values.size(); i++)
		{
		str = str + ""_"+ _values.get(i) +"":this.slide."+_values.get(i)+",";
		}
		str = str + " "run" : false };";
		this.tmpFunc = JSON.parse(str);
		this.tmpFunc["run"] = new Function("var draw() {"+_call+"draw(); }; var setInterval(_m,_t){"+_call+"registerInterval(_m, _t); }; var addEventListener(_t,_m) { "+_call+"addEventListener(_m, _t); };var objects = this._objects; var selections = this._selections;"+(!this.code ? "" : this.code));
		 */
	}
	/*
	Function: registerInterval
	
	Params: _m, _t
	 */

	public void registerInterval(Method _m, int _t) {
		/*if (this.intervalID != false) {
			this.deregisterInterval();
		}*/
		//this.intervalID = setInterval(_m, _t);
	}
	/*
	Function: deregisterInterval
	 */

	public void deregisterInterval() {
		//clearInterval(this.intervalID);
	}
	/*
	Function: addEventListener
	
	Params: _t, _m
	 */

	public void addEventListener(int _t, Method _m) {
		/*
		document.getElementById("gameframe").addEventListener(_t, function(event) 
		{
			console.log(_t + " " + event.pageX + ", " + event.pageY);
			_m(event.pageX, event.pageY);
		}
		
		, true);
			this.eventListeners[this.eventListeners.size()] = new ArrayList(_t, _m);
		 */
	}
	/*
	Function: evalCode
	 */
	public void evalCode() {
	/*this.tmpFunc.run();
	var _values = this.values;
	for (int i = 0; i < _values.size(); i++)
	{
	this.slide[_values.get(i)] = this.tmpFunc["_"+_values.get(i)]; 
	}*/
	}
	/*
	Function: draw
	 */
	public void draw() {/*
	var _htm = "";
	var object = false;
	var slide = this.slide;
	for (int i = 0; i < slide.objects.size(); i++)
	{
	object = slide.objects.get(i);
	_htm =_htm +"<div id="obj_"+object.uid+"" style="position: absolute; top: "+object.posY+"px; left: "+object.posX+"px; height: "+object.height+"px; width: "+object.width+"px; border: 1px solid #f00; overflow: hidden;">"+object.uid+"</div>";
	}
	game.draw( _htm );*/
	}


}
/*
Class: SlideSelection

the way a single text or texts are deployed, representing the model of choices.

Params: _uid
 */

class SlideSelection extends SlideshowObject {
	ArrayList<SlideText> texts;
	private String name;
	private String metaData;

	public SlideSelection(String _uid) {
		super(_uid);
		this.texts = new ArrayList<SlideText>();
		this.name = null;
		this.metaData = null;
	}
	/*
	Function: hasUid
	
	Params: _uid an unique identifier
	
	Returns: true if the given uid is zhe uid of this class
	 */

	public boolean hasUid(String _uid) {
		return uid.equals(_uid);
	}
	
	public String getUid() {
		return super.uid;
	}
	/*
	Function: load
	
	Params: jsonstr
	 */

	public String getMetaData() {
		return metaData;
	}

	public void setMetaData(String metaData) {
		this.metaData = metaData;
	}

	public void load(JSONObject jso) throws Exception {
		this.texts = new ArrayList<SlideText>();/*
		for (int i = 0; i < jsonstr["texts").length(); i++) {
			this.texts.get(i) = new SlideText(jsonstr["texts"].get(i)["uid"]);
			this.texts.get(i).load(jsonstr["texts"].get(i));
		}
		this.name = jsonstr["name"];
		this.metaData = jsonstr["metaData"];*/
	}
	/*
	Function: getName
	 */

	public String getName() {
		return this.name;
	}
	/*
	Function: setName
	
	Params: _name
	 */

	public void setName(String _name) {
		this.name = _name;
	}
	/*
	Function: getTexts
	
	Returns: the texts array
	 */

	public ArrayList<SlideText> getTexts() {
		return this.texts;
	}
	/*
	Function: getText
	
	Returns: the text for the given _uid or false
	 */

	public SlideText getText(String _uid) {
		for (int i = 0; i < this.texts.size(); i++) {
			if (this.texts.get(i).hasUid(_uid)) {
				return this.texts.get(i);
			}
		}
		return null;
	}

	/*
	Function: removeText
	
	Params: _text
	 */
	public void removeText(String _text) {
		texts.remove(_text);
	}
	/*
	Function: addText
	
	Params: _text
	 */

	public void addText(SlideText _text) {
		this.texts.add(_text);
	}
	/*
	Function: hasTarget
	
	Params: target_uid
	 */

	public boolean hasTarget(String target_uid) {
		for (int i = 0; i < this.texts.size(); i++) {
			if (this.texts.get(i).hasTarget(target_uid)) {
				return true;
			}
		}
		return false;
	}
}
/*
Class: SlideText

a single choice or simply a text.
 *Do not forget to set the target!*
 */

class SlideText extends SlideshowObject {
	public SlideTarget target;
	String text;
	
	public SlideText(String _uid) {
		super(_uid);
		this.target = null;
		this.text = null;
	}
	/*
	Function: hasUid
	
	Params: _uid an unique identifier
	
	Returns: true if the given uid is zhe uid of this class
	 */

	public boolean hasUid(String _uid) {
		return uid.equals(_uid);
	}
	
	public String getUid() {
		return super.uid;
	}
	/*
	Function: setTarget
	
	Params: _target
	 */

	public void setTarget(SlideTarget _target) {
		this.target = _target;
	}
	/*
	Function: getTarget
	
	Returns: the target object of the text
	 */

	public SlideTarget getTarget() {
		return this.target;
	}
	/*
	Function: hasTarget
	
	Params: _target
	
	Returns: boolean true if the text"s target has the same uid like the given target
	 */

	public boolean hasTarget(String _targetUid) {
		if (this.target == null) {
			return false;
		}
		return this.target.hasTargetUid(_targetUid);
	}
	/*
	Function: setText
	
	Params: _text
	 */

	public void setText(String _text) {
		this.text = _text;
	}
	/*
	Function: getText
	
	Returns: the text
	 */

	public String getText() {
		return this.text;
	}
	/*
	Function: load
	
	Params: jsonstr
	 */

	public void load(JSONObject jso) throws Exception {
		/*this.target = new SlideTarget(jsonstr["target"]["uid"]);
		this.target.load(jsonstr["target"]);
		this.text = jsonstr["text"];*/
	}
}
/*
Class: SlideObject

An alternative to a selection/dialog.
Requires an action or at least a selection as it"s target.
 */

class SlideObject extends SlideshowObject {
	SlideTarget target;
	private int posX;
	private int posY;
	private int posZ;
	private int width;
	private int height;
	private int depth;
	private String name;
	private int type;
	private String metaData;
	private int type2;
	private int level;
	private int level2;
	private ArrayList values;
	private int moveX;
	private int moveY;
	private String imageRef;
	private int direction;
	public SlideObject(String _uid) {
		super(_uid);
		this.target = null;
		this.posX = 0;
		this.posY = 0;
		this.posZ = 0;
		this.width = 0;
		this.height = 0;
		this.depth = 0;
		this.name = null;
		this.metaData = null;
		this.type = 0;
		this.type2 = 0;
		this.level = 0;
		this.level2 = 0;
		this.values = new ArrayList();
		this.moveX = 0;
		this.moveY = 0;
		this.imageRef = null;
		this.direction = 0;
	}
	/*
	Function: hasUid
	
	Params: _uid an unique identifier
	
	Returns: true if the given uid is zhe uid of this class
	 */

	public int getDepth() {
		return depth;
	}

	public void setDepth(int depth) {
		this.depth = depth;
	}

	public int getDirection() {
		return direction;
	}

	public void setDirection(int direction) {
		this.direction = direction;
	}

	public int getHeight() {
		return height;
	}

	public void setHeight(int height) {
		this.height = height;
	}

	public int getLevel() {
		return level;
	}

	public void setLevel(int level) {
		this.level = level;
	}

	public int getLevel2() {
		return level2;
	}

	public void setLevel2(int level2) {
		this.level2 = level2;
	}

	public String getMetaData() {
		return metaData;
	}

	public void setMetaData(String metaData) {
		this.metaData = metaData;
	}

	public int getMoveX() {
		return moveX;
	}

	public void setMoveX(int moveX) {
		this.moveX = moveX;
	}

	public int getMoveY() {
		return moveY;
	}

	public void setMoveY(int moveY) {
		this.moveY = moveY;
	}

	public int getPosX() {
		return posX;
	}

	public void setPosX(int posX) {
		this.posX = posX;
	}

	public int getPosY() {
		return posY;
	}

	public void setPosY(int posY) {
		this.posY = posY;
	}

	public int getPosZ() {
		return posZ;
	}

	public void setPosZ(int posZ) {
		this.posZ = posZ;
	}

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public int getType2() {
		return type2;
	}

	public void setType2(int type2) {
		this.type2 = type2;
	}

	public ArrayList getValues() {
		return values;
	}

	public void setValues(ArrayList values) {
		this.values = values;
	}

	public int getWidth() {
		return width;
	}

	public void setWidth(int width) {
		this.width = width;
	}

	public boolean hasUid(String _uid) {
		return uid.equals(_uid);
	}
	
	public String getUid() {
		return super.uid;
	}
	/*
	Function: setTarget
	
	Params: _target
	 */

	public void setTarget(SlideTarget _target) {
		this.target = _target;
	}
	/*
	Function: getTarget
	
	Returns: the target of the object
	 */

	public SlideTarget getTarget() {
		return this.target;
	}
	/*
	Function: hasTarget
	
	Params: target_uid
	
	Returns: boolean true if the text"s target has the same uid like the given target_uid
	 */

	public boolean hasTarget(String target_uid) {
		if (this.target == null) {
			return false;
		}
		return this.target.hasTargetUid(target_uid);
	}
	/*
	Function: load
	
	Params: jsonstr
	 */

	public void load(JSONObject jso) throws Exception {
		/*this.target = new SlideTarget(jsonstr["target"]["uid"]);
		this.target.load(jsonstr["target"]);
		this.posX = jsonstr["posX"];
		this.posY = jsonstr["posY"];
		this.posZ = jsonstr["posZ"];
		this.width = jsonstr["width"];
		this.height = jsonstr["height"];
		this.depth = jsonstr["depth"];
		this.name = jsonstr["name"];
		this.type = jsonstr["type"];
		this.type2 = jsonstr["type2"];
		this.level = jsonstr["level"];
		this.level2 = jsonstr["level2"];
		this.moveX = jsonstr["moveX"];
		this.moveY = jsonstr["moveY"];
		this.direction = jsonstr["direction"];
		this.metaData = jsonstr["metaData"];
		this.imageRef = jsonstr["imageRef"];
		this.values = new ArrayList();
		for (int i = 0; i < jsonstr["values").length(); i++) {
			values = new KeyValue(jsonstr["values"].get(i)["key"], jsonstr["values"].get(i)["value"]);
		}*/
		/*
		this.values = new ArrayList();
		 */
	}
	/**/

	public boolean moveBy(int _x, int _y) {
		if (this.posX < this.moveX - _x / 2) {
			this.posX += _x;
		} else if (this.posX > this.moveX + _x / 2) {
			this.posX -= _x;
		} else {
			this.posX = this.moveX;
		}
		if (this.posY < this.moveY - _y / 2) {
			this.posY += _y;
		} else if (this.posY > this.moveY + _y / 2) {
			this.posY -= _y;
		} else {
			this.posY = this.moveY;
		}
		return (this.posX == this.moveX && this.posY == this.moveY);
	}
	/**/

	public void setMoveTo(int _x, int _y) {
		this.moveX = _x;
		this.moveY = _y;
	}
	/**/

	public void setPosition(int _x, int _y) {
		this.posX = _x;
		this.posY = _y;
	}
	/**/

	public void setDimension(int _w, int _h) {
		this.width = _w;
		this.height = _h;
	}
	/**/

	public void setName(String _name) {
		this.name = _name;
	}
	/**/

	public String getName() {
		return this.name;
	}

	/**/
	public void setImageRef(String img_ref) {
		this.imageRef = img_ref;
	}
	/**/

	public String getImageRef() {
		return this.imageRef;
	}
}
/*	
Class: SlidePlayer
 */

class SlidePlayer extends SlideshowObject {

	public SlidePlayer(String _uid) {
		super( _uid);
		//this.bagUid = false;
	}

	@Override
	public String getUid() {
		return super.uid;
	}

	@Override
	public boolean hasUid(String _uid) {
		return super.uid.equals(_uid);
	}
}
/*
Class: SlideBag
 */

class SlideBag extends SlideshowObject {
	private boolean shared;
	private ArrayList playerUids;

	public SlideBag(String _uid) {
		super(_uid);
		this.playerUids = new ArrayList();
		this.shared = true;
	}
	@Override
	public String getUid() {
		return super.uid;
	}

	@Override
	public boolean hasUid(String _uid) {
		return super.uid.equals(_uid);
	}
}
/*
Class: SlideTarget
 */

class SlideTarget extends SlideshowObject {
	String targetUid;
	String slideUid;
	private String methodToCall;
	private String values;

	public SlideTarget(String _uid) {
		super(_uid);
		this.targetUid = null;
		this.slideUid = null;
		this.methodToCall = "showSelection";
		this.values = "";
	}
	/*
	Function: hasUid
	
	Params: _uid an unique identifier
	
	Returns: true if the given uid is zhe uid of this class
	 */

	public boolean hasUid(String _uid) {
		return uid.equals(_uid);
	}
	
	public String getUid() {
		return super.uid;
	}
	/**/

	public void callMethod(Slideshow _slideshow) {
		_slideshow.callMethod(this.slideUid, this.targetUid, this.methodToCall, this.values);
	}
	/*
	Function: load
	
	Params: jsonstr
	 */

	public String getSlideUid() {
		return slideUid;
	}

	public void setSlideUid(String slideUid) {
		this.slideUid = slideUid;
	}

	public String getTargetUid() {
		return targetUid;
	}

	public void setTargetUid(String targetUid) {
		this.targetUid = targetUid;
	}

	public void load(JSONObject jso) throws Exception {
		/*this.targetUid = jsonstr["targetUid"];
		this.slideUid = jsonstr["slideUid"];
		this.methodToCall = jsonstr["methodToCall"];
		this.values = jsonstr["values"];*/
	}
	/**/

	public void setValues(String _values) {
		this.values = _values;
	}
	/**/

	public void setMethodToCall(String _method) {
		this.methodToCall = _method;
	}
	/**/

	public void setUids(String _slideUid,String  _targetUid) {
		this.targetUid = _targetUid;
		this.slideUid = _slideUid;
	}
	/*
	Function: hasTargetUid
	
	Params: target_uid
	 */

	public boolean hasTargetUid(String _target_uid) {
		return (this.targetUid == null ? false : (this.targetUid.equals(_target_uid)) );
	}
}
/*
Class: Overview

the visual representation model of the slideshow.
only used in the editor and the project. The game only
shows one slide per time.

See:
<Project>
<Slideshow>
 */

class Overview {
	private ArrayList<OverviewSlide> overviewSlides;
	private OverviewSlide movingSlide;

	public Overview() {
		this.overviewSlides = new ArrayList<OverviewSlide>();
		this.movingSlide = null;
	}
	/**/

	public OverviewSlide addSlide(String _slideUid) {
		OverviewSlide _slide = new OverviewSlide(_slideUid);
		this.overviewSlides.add( _slide);
		_slide.setPosition(100 + 20 * this.overviewSlides.size(), 40 + 15 * this.overviewSlides.size());
		return _slide;
	}
	/**/

	public void removeSlide(String _slideUid) {
		for (int i = 0; i < this.overviewSlides.size(); i++) {
			if (this.overviewSlides.get(i).slideUid.equals( _slideUid)) {
				this.overviewSlides.remove(this.overviewSlides.get(i));
				return;
			}
		}
	}
	/**/

	public OverviewSlide getSlide(String _slideUid) {
		for (int i = 0; i < this.overviewSlides.size(); i++) {
			if (this.overviewSlides.get(i).slideUid.equals( _slideUid)) {
				return this.overviewSlides.get(i);

			}
		}
		return null;
	}
	/**/

	public ArrayList<OverviewSlide> getOverviewSlides() {
		return this.overviewSlides;
	}
	/**/

	public String getMarkedSlide() {
		for (int i = 0; i < this.overviewSlides.size(); i++) {
			if (this.overviewSlides.get(i).isMarked()) {
				return this.overviewSlides.get(i).slideUid;
			}
		}
		return null;
	}
	/**/

	public OverviewSlide hitsOverviewSlide(int x, int y) {
		for (int i = 0; i < this.overviewSlides.size(); i++) {
			this.overviewSlides.get(i).setMarked(false);
		}
		for (int i = this.overviewSlides.size() - 1; i >= 0; i--) {
			//always catch the visible top
			if (this.overviewSlides.get(i).hit(x, y)) {
				this.overviewSlides.get(i).setMarked(true);
				return this.overviewSlides.get(i);
			}
		}
		return null;
	}

	/*
	Function: load
	
	Params: jsonstr
	 */
	public void load(JSONObject jso) throws Exception {
		this.overviewSlides = new ArrayList();
		/*for (int i = 0; i < jsonstr["overviewSlides").length(); i++) {
			var slide = new OverviewSlide(jsonstr["overviewSlides"].get(i)["slideUid"]);
			slide.load(jsonstr["overviewSlides"].get(i));
			this.overviewSlides.get(i) = slide;
		}*/
	}
}
/*
Class: OverviewSlide

the visual representation of an Slide

See:
<Slide>
 */

class OverviewSlide {
	String slideUid;
	private int posX;
	private int posY;
	private ArrayList<OverviewSelection> selections;
	private int width;
	private int height;
	boolean marked;

	public OverviewSlide(String _slideUid) {
		this.slideUid = _slideUid;
		this.posX = 100;
		this.posY = 100;
		this.selections = new ArrayList<OverviewSelection>();
		this.width = 150;
		this.height = 120;
		this.marked = true;
	}
	/**/

	public void setPosition(int _x, int _y) {
		this.posX = _x;
		this.posY = _y;
	}
	/**/

	public boolean hit(int _x, int _y) {
		return (this.posX < _x && this.posX + this.width > _x
			&& this.posY < _y && this.posY + this.height > _y);
	}
	/**/

	public OverviewSelection addSelection(String _uid) {
		OverviewSelection _sel = new OverviewSelection(_uid);
		this.selections.add(_sel);
		_sel.setPosition(100 + 20 * this.selections.size(), 40 + 15 * this.selections.size());
		return _sel;
	}
	/**/

	public void removeSelection(String _uid) {
		for (int i = 0; i < this.selections.size(); i++) {
			if (this.selections.get(i).equals( _uid)) {
				this.selections.remove(this.selections.get(i));
			}
		}
	}
	/**/

	public boolean isMarked() {
		return this.marked;
	}
	/**/

	public void setMarked(boolean _mark) {
		this.marked = _mark;
	}
	/**/

	public OverviewSelection hitsOverviewSelection(int x, int y) {
		for (int i = 0; i < this.selections.size(); i++) {
			this.selections.get(i).setMarked(false);
		}
		for (int i = this.selections.size() - 1; i >= 0; i--) {
			//always catch the visible top
			if (this.selections.get(i).hit(x, y)) {
				this.selections.get(i).setMarked(true);
				return this.selections.get(i);
			}
		}
		return null;
	}
	/*
	Function: load
	
	Params: jsonstr
	 */

	public void load(JSONObject jso) throws Exception {
		/*this.posX = jsonstr["posX"];
		this.posY = jsonstr["posY"];
		this.selections = new ArrayList();
		for (int i = 0; i < jsonstr["selections").length(); i++) {
			var sel = new OverviewSelection(jsonstr["selections"].get(i)["uid"]);
			sel.load(jsonstr["selections"].get(i));
			this.selections.get(i) = sel;
		}
		this.width = jsonstr["width"];
		this.height = jsonstr["height"];
		this.marked = jsonstr["marked"];*/
	}
}
/*
Function: SlideshowObject.prototype.getUid

the prototype of this function.

Returns: the uid of this object
 */

/*
Function: SlideshowObject.prototype.hasUid

the prototype of this function.

Params: _uid an unique identifier

Returns: true if the given uid is zhe uid of this object
 */
/*
Function: SlideshowObject.prototype.getUid

the prototype of this function.

Returns: the uid of this object
 */

/*
Function: SlideshowObject.prototype.hasUid

the prototype of this function.

Params: _uid an unique identifier

Returns: true if the given uid is zhe uid of this object
 */
/*
Function: SlideshowObject.prototype.getUid

the prototype of this function.

Returns: the uid of this object
 */

/*
Function: SlideshowObject.prototype.hasUid

the prototype of this function.

Params: _uid an unique identifier

Returns: true if the given uid is zhe uid of this object
 */
/*
Function: SlideshowObject.prototype.getUid

the prototype of this function.

Returns: the uid of this object
 */

/*
Function: SlideshowObject.prototype.hasUid

the prototype of this function.

Params: _uid an unique identifier

Returns: true if the given uid is zhe uid of this object
 */
/*
Function: SlideshowObject.prototype.getUid

the prototype of this function.

Returns: the uid of this object
 */

/*
Function: SlideshowObject.prototype.hasUid

the prototype of this function.

Params: _uid an unique identifier

Returns: true if the given uid is zhe uid of this object
 */
/*
Function: SlideshowObject.prototype.getUid

the prototype of this function.

Returns: the uid of this object
 */

/*
Function: SlideshowObject.prototype.hasUid

the prototype of this function.

Params: _uid an unique identifier

Returns: true if the given uid is zhe uid of this object
 */
/*
Class: OverviewSelection

the visual represantation of a selection/dialog, but also of an object.
Used in the anlyse mode too.

See:
<SlideSelection>
<SlideObject>

Params: _uid
 */

class OverviewSelection {
	 boolean marked;
	private int height;
	private int width;
	private int posY;
	private int posX;
	 String uid;

	public OverviewSelection(String _uid) {
		this.uid = _uid;
		this.posX = 50;
		this.posY = 50;
		this.width = 150;
		this.height = 120;
		this.marked = false;
		//this.type = "dialog";
	}
	/*
	Function: setPosition
	
	Params: _x, _y
	 */

	public void setPosition(int _x, int _y) {
		this.posX = _x;
		this.posY = _y;
	}
	/*
	Function: hit
	
	Params: _x, _y
	
	Returns: boolean true if x,y hits the bounds
	 */

	public boolean hit(int _x, int _y) {
		return (this.posX < _x && this.posX + this.width > _x
			&& this.posY < _y && this.posY + this.height > _y);
	}
	/*
	Function: isMarked
	
	Returns: true if is marked aka selected
	 */

	public boolean isMarked() {
		return this.marked;
	}
	/*
	Function: setMarked
	
	Params: _mark
	 */

	public void setMarked(boolean _mark) {
		this.marked = _mark;
	}
	/*
	Function: load
	
	Params: jsonstr
	 */

	public void load(JSONObject jso) throws Exception {
		/*this.posX = jsonstr["posX"];
		this.posY = jsonstr["posY"];
		this.width = jsonstr["width"];
		this.height = jsonstr["height"];
		//this.type = jsonstr["type"];
		if (jsonstr["marked"]) {
			this.marked = jsonstr["marked"];
		}
		log("loaded selection over " + this.uid);*/
	}
}
/*
Function: SlideshowObject.prototype.getUid

the prototype of this function.

Returns: the uid of this object
 */

/*
Function: SlideshowObject.prototype.hasUid

the prototype of this function.

Params: _uid an unique identifier

Returns: true if the given uid is zhe uid of this object
 */
/**
Class: KeyValue

used in the media manager and other classes like slideshow or slide

See:

<Slideshow><Slide>

Params: 
key the identifier.
value the value - boolean, number, string, object, etc.
 */
class KeyValue {
	String key;
	Object value;

	public KeyValue(String _key, Object _value) {
		this.key = _key;
		this.value = _value;
	}
}
