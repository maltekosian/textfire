package com.hogventure.basic;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Properties;

import com.hogventure.util.DumpUtil;
import com.hogventure.util.Dumpable;
import com.hogventure.util.GlobalPreferences;

/**
 * @author aquila
 * slide
	-dialogs
	-title
	-backgroundImageRef
	x ambientMusic
	x objects
	x plugin
 */
public class Slide 
	implements Dumpable
{
	ArrayList<SlideDialog>dialogs;
	String title;
	String backgroundImageRef;
	String uid;
	String ambientMusicRef;
	ArrayList<SlideObject>objects;
	ArrayList<SlideObject>hiddenObjects;
	SlidePlugin plugin;
	SlideDialog currentDialog;
	/**
	 * @return the currentDialog
	 */
	public SlideDialog getCurrentDialog() {
		return currentDialog;
	}
	/**
	 * @param currentDialog the currentDialog to set
	 */
	public void setCurrentDialog(SlideDialog currentDialog) {
		this.currentDialog = currentDialog;
	}
	/**
	 * @param uid
	 */
	public Slide(String uid) {
		this.uid = uid;
	}
	/**
	 * @return the dialogs
	 */
	public ArrayList<SlideDialog> getDialogs() {
		return dialogs;
	}
	/**
	 * @param dialogs the dialogs to set
	 */
	public void setDialogs(ArrayList<SlideDialog> dialogs) {
		this.dialogs = dialogs;
	}
	/**
	 * @return the title
	 */
	public String getTitle() {
		return title;
	}
	/**
	 * @param title the title to set
	 */
	public void setTitle(String title) {
		this.title = title;
	}
	/**
	 * @return the backgroundImageRef
	 */
	public String getBackgroundImageRef() {
		return backgroundImageRef;
	}
	/**
	 * @param backgroundImageRef the backgroundImageRef to set
	 */
	public void setBackgroundImageRef(String backgroundImage) {
		this.backgroundImageRef = backgroundImage;
	}
	/**
	 * @return the ambientMusicRef
	 */
	public String getAmbientMusicRef() {
		return ambientMusicRef;
	}
	/**
	 * @param ambientMusicRef the ambientMusicRef to set
	 */
	public void setAmbientMusicRef(String ambientMusicRef) {
		this.ambientMusicRef = ambientMusicRef;
	}
	/**
	 * @return the objects
	 */
	public ArrayList<SlideObject> getObjects() {
		return objects;
	}
	/**
	 * @param objects the objects to set
	 */
	public void setObjects(ArrayList<SlideObject> objects) {
		this.objects = objects;
	}
	/**
	 * @return the hiddenObjects
	 */
	public ArrayList<SlideObject> getHiddenObjects() {
		return hiddenObjects;
	}
	/**
	 * @param hiddenObjects the hiddenObjects to set
	 */
	public void setHiddenObjects(ArrayList<SlideObject> hiddenObjects) {
		this.hiddenObjects = hiddenObjects;
	}
	/**
	 * @return the plugin
	 */
	public SlidePlugin getPlugin() {
		return plugin;
	}
	/**
	 * @param plugin the plugin to set
	 */
	public void setPlugin(SlidePlugin plugin) {
		this.plugin = plugin;
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
		DumpUtil.save(this, path, "slide_"+uid);
	}
	/**
	 * @return
	 */
	public boolean hasPlugin() {
		return (plugin != null);
	}
	
	public void sort() {
		if (GlobalPreferences.useSortObjects) {
			Comparator<SlideObject>comp = null;
			SlideObject[] objs = objects.toArray(new SlideObject[objects.size()]);
			if (GlobalPreferences.useObjectFooters) {
				comp = new Comparator<SlideObject>() {
					public int compare(SlideObject so1, SlideObject so2) {
						if (so1.getFootPosY() + so1.getFootPosHeight() >
								so2.getFootPosY() + so2.getFootPosHeight()) return 1;
						if (so1.getFootPosY() + so1.getFootPosHeight() <
								so2.getFootPosY() + so2.getFootPosHeight()) return -1;
						if (so1.getFootPosX() + so1.getFootPosWidth() >
								so2.getFootPosX() + so2.getFootPosWidth()) return 1;
						if (so1.getFootPosX() + so1.getFootPosWidth() < 
								so2.getFootPosX() + so2.getFootPosWidth()) return -1;
						return 0;
					}
				};
			} else {
				comp = new Comparator<SlideObject>() {
					public int compare(SlideObject so1, SlideObject so2) {
						if (so1.getPosY() + so1.getHeight() >
								so2.getPosY() + so2.getHeight()) return 1;
						if (so1.getPosY() + so1.getHeight() <
								so2.getPosY() + so2.getHeight()) return -1;
						if (so1.getPosX() + so1.getWidth() >
								so2.getPosX() + so2.getWidth()) return 1;
						if (so1.getPosX() + so1.getWidth() < 
								so2.getPosX() + so2.getWidth()) return -1;
						return 0;
					}
				};
			}
			Arrays.sort(objs, comp);
			objects.clear();
			for (SlideObject so : objs) {
				objects.add(so);
			}
		}
	}
}
