package com.hogventure.basic;

import java.util.HashMap;
import java.util.Properties;

import com.hogventure.util.Dumpable;

/**
 * @author aquila
 * -image
	-dimension w,h
	-position x,y
	x footPosition
	x footDimension
 */
public class SlideObject 
	implements Dumpable
{
	String name;
	String uid;
	String imageRef;
	String iconRef;
	int width;
	int height;
	int posX;
	int posY;
	int footPosWidth;
	int footPosHeight;
	int footPosX;
	int footPosY;
	SlideTarget target;
	
    int indexX;
    int indexY;
    int insetX;
    int insetY;

    int oldPosX;
    int oldPosY;

    int color;
    int ani;
    boolean removeable;
    boolean moveable;
    boolean selected;
	/**
	 * @param uid
	 */
	public SlideObject(String uid) {
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
	 * @return the indexX
	 */
	public int getIndexX() {
		return indexX;
	}
	/**
	 * @param indexX the indexX to set
	 */
	public void setIndexX(int indexX) {
		this.indexX = indexX;
	}
	/**
	 * @return the indexY
	 */
	public int getIndexY() {
		return indexY;
	}
	/**
	 * @param indexY the indexY to set
	 */
	public void setIndexY(int indexY) {
		this.indexY = indexY;
	}
	/**
	 * @return the insetX
	 */
	public int getInsetX() {
		return insetX;
	}
	/**
	 * @param insetX the insetX to set
	 */
	public void setInsetX(int insetX) {
		this.insetX = insetX;
	}
	/**
	 * @return the insetY
	 */
	public int getInsetY() {
		return insetY;
	}
	/**
	 * @param insetY the insetY to set
	 */
	public void setInsetY(int insetY) {
		this.insetY = insetY;
	}
	/**
	 * @return the oldPosX
	 */
	public int getOldPosX() {
		return oldPosX;
	}
	/**
	 * @param oldPosX the oldPosX to set
	 */
	public void setOldPosX(int oldPosX) {
		this.oldPosX = oldPosX;
	}
	/**
	 * @return the oldPosY
	 */
	public int getOldPosY() {
		return oldPosY;
	}
	/**
	 * @param oldPosY the oldPosY to set
	 */
	public void setOldPosY(int oldPosY) {
		this.oldPosY = oldPosY;
	}
	/**
	 * @return the color
	 */
	public int getColor() {
		return color;
	}
	/**
	 * @param color the color to set
	 */
	public void setColor(int color) {
		this.color = color;
	}
	/**
	 * @return the ani
	 */
	public int getAni() {
		return ani;
	}
	/**
	 * @param ani the ani to set
	 */
	public void setAni(int ani) {
		this.ani = ani;
	}
	/**
	 * @return the removeable
	 */
	public boolean isRemoveable() {
		return removeable;
	}
	/**
	 * @param removeable the removeable to set
	 */
	public void setRemoveable(boolean removeable) {
		this.removeable = removeable;
	}
	/**
	 * @return the moveable
	 */
	public boolean isMoveable() {
		return moveable;
	}
	/**
	 * @param moveable the moveable to set
	 */
	public void setMoveable(boolean moveable) {
		this.moveable = moveable;
	}
	/**
	 * @return the selected
	 */
	public boolean isSelected() {
		return selected;
	}
	/**
	 * @param selected the selected to set
	 */
	public void setSelected(boolean selected) {
		this.selected = selected;
	}
	/**
	 * @return the objectVars
	 */
	public HashMap<String, Object> getObjectVars() {
		return objectVars;
	}
	/**
	 * @param objectVars the objectVars to set
	 */
	public void setObjectVars(HashMap<String, Object> objectVars) {
		this.objectVars = objectVars;
	}
	HashMap<String, Object> objectVars = new HashMap<String, Object>();
	/* (non-Javadoc)
	 * @see com.hogventure.util.Dumpable#load(com.hogventure.basic.Slideshow, java.lang.String, java.lang.String)
	 */
	@Override
	public Object loadDump(Slideshow slideshow, String path, String filename) {
		// TODO Auto-generated method stub
		return null;
	}
	/* (non-Javadoc)
	 * @see com.hogventure.util.Dumpable#save(java.lang.String)
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
	/**
	 * @return the name
	 */
	public String getName() {
		return name;
	}
	/**
	 * @param name the name to set
	 */
	public void setName(String name) {
		this.name = name;
	}
	/**
	 * @return the imageRef
	 */
	public String getImageRef() {
		return imageRef;
	}
	/**
	 * @param imageRef the imageRef to set
	 */
	public void setImageRef(String imageRef) {
		this.imageRef = imageRef;
	}
	/**
	 * @return the iconRef
	 */
	public String getIconRef() {
		return iconRef;
	}
	/**
	 * @param iconRef the iconRef to set
	 */
	public void setIconRef(String iconRef) {
		this.iconRef = iconRef;
	}
	/**
	 * @return the width
	 */
	public int getWidth() {
		return width;
	}
	/**
	 * @param width the width to set
	 */
	public void setWidth(int width) {
		this.width = width;
	}
	/**
	 * @return the height
	 */
	public int getHeight() {
		return height;
	}
	/**
	 * @param height the height to set
	 */
	public void setHeight(int height) {
		this.height = height;
	}
	/**
	 * @return the posX
	 */
	public int getPosX() {
		return posX;
	}
	/**
	 * @param posX the posX to set
	 */
	public void setPosX(int posX) {
		this.posX = posX;
	}
	/**
	 * @return the posY
	 */
	public int getPosY() {
		return posY;
	}
	/**
	 * @param posY the posY to set
	 */
	public void setPosY(int posY) {
		this.posY = posY;
	}
	/**
	 * @return the footPosWidth
	 */
	public int getFootPosWidth() {
		return footPosWidth;
	}
	/**
	 * @param footPosWidth the footPosWidth to set
	 */
	public void setFootPosWidth(int footPosWidth) {
		this.footPosWidth = footPosWidth;
	}
	/**
	 * @return the footPosHeight
	 */
	public int getFootPosHeight() {
		return footPosHeight;
	}
	/**
	 * @param footPosHeight the footPosHeight to set
	 */
	public void setFootPosHeight(int footPosHeight) {
		this.footPosHeight = footPosHeight;
	}
	/**
	 * @return the footPosX
	 */
	public int getFootPosX() {
		return footPosX;
	}
	/**
	 * @param footPosX the footPosX to set
	 */
	public void setFootPosX(int footPosX) {
		this.footPosX = footPosX;
	}
	/**
	 * @return the footPosY
	 */
	public int getFootPosY() {
		return footPosY;
	}
	/**
	 * @param footPosY the footPosY to set
	 */
	public void setFootPosY(int footPosY) {
		this.footPosY = footPosY;
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
		return p;
	}
	
}
