package com.hogventure.util;

import com.hogventure.basic.Slideshow;

public interface Dumpable
	extends Loadable
{ 
	/**
	* dump the dumpable obejct via dumputil to a xml-file
	* <br /> the file-name is "[toString()].xml"
	* <br /> default implementation:
	* <br /> public void save(String path) {
	* <br /> &nbsp;&nbsp;&nbsp;DumpUtil.save(this, path);
	* <br /> }
	*/
	public void saveDump(String path);
	/**
	* enables the dumpable to be loaded from a xml-file
	* <br /> default implementation:
	* <br /> public Object load(String path, String filename) {
	* <br /> &nbsp;&nbsp;&nbsp;return DumpUtil.load(path, filename);
	* <br /> }
	*/
	public Object loadDump(Slideshow slideshow, String path, String filename);
	/**
	* the string representation of the dumpable object
	* <br />should be unique 
	* <br /> normaly build as a sting concatation of uid and the name or a simular value 
	*/
	public String toString();
	/**
	* returns the qualified unique id or -1
	
	public boolean hasUID(String id);

    public String getUID();*/
}