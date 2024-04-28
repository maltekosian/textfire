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
public class SlideTarget 
	implements Dumpable
{
	String uid;
	String targetUid;
	int points;
	/**
	 * @param uid
	 */
	public SlideTarget(String uid) {
		this.uid = uid;
	}
	/**
	 * @return the targetUid
	 */
	public String getTargetUid() {
		return targetUid;
	}
	/**
	 * @param targetUid the targetUid to set
	 */
	public void setTargetUid(String targetUid) {
		this.targetUid = targetUid;
	}
	/**
	 * @return the points
	 */
	public int getPoints() {
		return points;
	}
	/**
	 * @param points the points to set
	 */
	public void setPoints(int points) {
		this.points = points;
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
