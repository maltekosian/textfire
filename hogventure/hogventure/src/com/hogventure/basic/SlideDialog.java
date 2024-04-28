package com.hogventure.basic;

import java.util.ArrayList;
import java.util.Properties;

import com.hogventure.util.DumpUtil;
import com.hogventure.util.Dumpable;

/**
 * @author aquila
 * 
 */
public class SlideDialog
	implements Dumpable
{
	ArrayList<SlideText> texts;
	String uid;
	String iconRef;
	/**
	 * @param uid
	 */
	public SlideDialog(String uid) {
		this.uid = uid;
	}
	/**
	 * @return the texts
	 */
	public ArrayList<SlideText> getTexts() {
		return texts;
	}
	/**
	 * @param texts the texts to set
	 */
	public void setTexts(ArrayList<SlideText> texts) {
		this.texts = texts;
	}
	/* (non-Javadoc)
	 * @see com.hogventure.util.Dumpable#loadDump(com.hogventure.basic.Slideshow, java.lang.String, java.lang.String)
	 */
	@Override
	public Object loadDump(Slideshow slideshow, String path, String filename) {
		//System.out.println("load dump ::: " + path + " : " + filename);
        return DumpUtil.load(slideshow, path, filename);
	}
	/* (non-Javadoc)
	 * @see com.hogventure.util.Dumpable#saveDump(java.lang.String)
	 */
	@Override
	public void saveDump(String path) {
		//UidCounter.register(uid);
        DumpUtil.save(this, path);		
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
