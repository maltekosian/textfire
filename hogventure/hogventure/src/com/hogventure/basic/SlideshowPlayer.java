package com.hogventure.basic;

import java.util.ArrayList;
import java.util.Properties;

import com.hogventure.util.Dumpable;

/**
 * @author aquila
 * player
	x figures
	x points
	x bag
	x visitedSlides
	x usedTargets
 */
public class SlideshowPlayer
	implements Dumpable
{
	String uid;
	ArrayList<SlideObject>figures;
	int points;
	ArrayList<SlideObject> bag;
	ArrayList<Slide> visitedSlides;
	ArrayList<String> usedTargets;
	/**
	 * @param uid
	 */
	public SlideshowPlayer(String uid) {
		this.uid = uid;
	}
	/**
	 * @return the figures
	 */
	public ArrayList<SlideObject> getFigures() {
		return figures;
	}
	/**
	 * @param figures the figures to set
	 */
	public void setFigures(ArrayList<SlideObject> figures) {
		this.figures = figures;
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
	/**
	 * @return the bag
	 */
	public ArrayList<SlideObject> getBag() {
		return bag;
	}
	/**
	 * @param bag the bag to set
	 */
	public void setBag(ArrayList<SlideObject> bag) {
		this.bag = bag;
	}
	/**
	 * @return the visitedSlides
	 */
	public ArrayList<Slide> getVisitedSlides() {
		return visitedSlides;
	}
	/**
	 * @param visitedSlides the visitedSlides to set
	 */
	public void setVisitedSlides(ArrayList<Slide> visitedSlides) {
		this.visitedSlides = visitedSlides;
	}
	/**
	 * @return the usedTargets
	 */
	public ArrayList<String> getUsedTargets() {
		return usedTargets;
	}
	/**
	 * @param usedTargets the usedTargets to set
	 */
	public void setUsedTargets(ArrayList<String> usedTargets) {
		this.usedTargets = usedTargets;
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
		return uid;
	}
	/* (non-Javadoc)
	 * @see com.hogventure.util.Loadable#hasUid(java.lang.String)
	 */
	@Override
	public boolean hasUid(String _uid) {
		return this.uid.equals(_uid);
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
