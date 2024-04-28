/**
 * 
 */
package com.hogventure.basic;

import java.util.Properties;

import com.hogventure.util.Dumpable;

/**
 * @author aquila
 *
 */
public class SlideText 
	implements Dumpable
{
	String uid;
	SlideTarget target;
	String text;
	
	/**
	 * @param uid
	 */
	public SlideText(String uid) {
		this.uid = uid;
	}
	/**
	 * @return the target
	 */
	public SlideTarget getTarget() {
		return target;
	}
	/**
	 * @param target the target to set
	 */
	public void setTarget(SlideTarget target) {
		this.target = target;
	}
	/**
	 * @return the text
	 */
	public String getText() {
		return text;
	}
	/**
	 * @param text the text to set
	 */
	public void setText(String text) {
		this.text = text;
	}
	/* (non-Javadoc)
	 * @see com.hogventure.util.Dumpable#loadDump(com.hogventure.basic.Slideshow, java.lang.String, java.lang.String)
	 */
	@Override
	public Object loadDump(Slideshow slideshow, String path, String filename) {
		// TODO Auto-generated method stub
		return null;
	}
	/* (non-Javadoc)
	 * @see com.hogventure.util.Dumpable#saveDump(java.lang.String)
	 */
	@Override
	public void saveDump(String path) {
		// TODO Auto-generated method stub
		
	}
	/* (non-Javadoc)
	 * @see com.hogventure.util.Loadable#getUid()
	 */
	@Override
	public String getUid() {
		// TODO Auto-generated method stub
		return null;
	}
	/* (non-Javadoc)
	 * @see com.hogventure.util.Loadable#hasUid(java.lang.String)
	 */
	@Override
	public boolean hasUid(String uid) {
		// TODO Auto-generated method stub
		return false;
	}
	/* (non-Javadoc)
	 * @see com.hogventure.util.Loadable#load(java.util.Properties)
	 */
	@Override
	public void load(Properties p) {
		// TODO Auto-generated method stub
		
	}
	/* (non-Javadoc)
	 * @see com.hogventure.util.Loadable#store(java.util.Properties)
	 */
	@Override
	public Properties store(Properties p) {
		// TODO Auto-generated method stub
		return null;
	}
}
