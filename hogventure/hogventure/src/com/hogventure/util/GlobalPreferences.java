package com.hogventure.util;

/**
 * @author aquila
 * slideshow
	-slides
	x globalAmbientMusic
	-player
	-globalPreferences	
	-utils:
		--mediaManager
		--dialogsUtil
slide
	-dialogs
	-title
	-backgroundImageRef
	x ambientMusic
	x objects
	x plugin

dialog
	-texts
	x iconImage
text
	-target

target -> leads to dialog or slide

player
	x figures
	x points
	x bag
	x visitedSlides
	x usedTargets

object
	-image
	-dimension w,h
	-position x,y
	x footPosition
	x footDimension

plugin
	<code>

utils:
	interfaceLoadable
		implementing load and save. all in one file
	interfaceDumpable
		implementing loadDump and saveDump
		multiple files  
	dumpHelper
	dumpParser
	dumpUtil

dialogUtil
		-dialogs
	
	mediaManager
		x slideSounds
		-globalSounds
		x slideImages
		-globalImages
		-iconImages
		x slideAnimations
		-globalAnimations

	connection
		for download, upload and chat

	connectionProtokoll

-is default
x is optional

the basic interface design

 */
public class GlobalPreferences {

	public static boolean showPoints = false;
	public static boolean showSlidesOverview = false;
	public static boolean showBag = false;
	public static boolean showFigureOverview = false;
	public static boolean showTitle = false;
	public static boolean showSlideTitle = false;
	public static boolean showBackgroundImage = false;
	public static boolean useSlideMedia = false;
	public static boolean useObjects = false;
	public static boolean useObjectFooters = false;
	public static boolean useSortObjects = false;
	public String fontFamily = "";
	public int fontWeight = 0;
	public int fontSize = 14;
	public int fontColor = 0xff000000;
	public static boolean useShadow = false;
	public int shadowColor = 0x66999999;
	public int boxColor = 0x99ffffff;
	public int boxBorderStroke = 1;
	public int roundRectSize = 10;
	public int boxBorderColor = 0xff000000;
	public int boxPadding = 5;
	
	/**
	 * @return the showPoints
	 */
	public boolean isShowPoints() {
		return showPoints;
	}

	/**
	 * @return the showSlidesOverview
	 */
	public boolean isShowSlidesOverview() {
		return showSlidesOverview;
	}

	/**
	 * @return the showBag
	 */
	public boolean isShowBag() {
		return showBag;
	}

	/**
	 * @return the showFigureOverview
	 */
	public boolean isShowFigureOverview() {
		return showFigureOverview;
	}

	/**
	 * @return the showTitle
	 */
	public boolean isShowTitle() {
		return showTitle;
	}

	/**
	 * @return the showSlideTitle
	 */
	public boolean isShowSlideTitle() {
		return showSlideTitle;
	}

	/**
	 * @return the showBackgroundImage
	 */
	public boolean isShowBackgroundImage() {
		return showBackgroundImage;
	}

	/**
	 * @param showPoints the showPoints to set
	 */
	public void setShowPoints(boolean showPoints) {
		this.showPoints = showPoints;
	}

	/**
	 * @param showSlidesOverview the showSlidesOverview to set
	 */
	public void setShowSlidesOverview(boolean showSlidesOverview) {
		this.showSlidesOverview = showSlidesOverview;
	}

	/**
	 * @param showBag the showBag to set
	 */
	public void setShowBag(boolean showBag) {
		this.showBag = showBag;
	}

	/**
	 * @param showFigureOverview the showFigureOverview to set
	 */
	public void setShowFigureOverview(boolean showFigureOverview) {
		this.showFigureOverview = showFigureOverview;
	}

	/**
	 * @param showTitle the showTitle to set
	 */
	public void setShowTitle(boolean showTitle) {
		this.showTitle = showTitle;
	}

	/**
	 * @param showSlideTitle the showSlideTitle to set
	 */
	public void setShowSlideTitle(boolean showSlideTitle) {
		this.showSlideTitle = showSlideTitle;
	}

	/**
	 * @param showBackgroundImage the showBackgroundImage to set
	 */
	public void setShowBackgroundImage(boolean showBackgroundImage) {
		this.showBackgroundImage = showBackgroundImage;
	}

	/**
	 * @param useSlideMedia the useSlideMedia to set
	 */
	public void setUseSlideMedia(boolean useSlideMedia) {
		this.useSlideMedia = useSlideMedia;
	}

	/**
	 * @param useObjects the useObjects to set
	 */
	public void setUseObjects(boolean useObjects) {
		this.useObjects = useObjects;
	}

	/**
	 * @param useObjectFooters the useObjectFooters to set
	 */
	public void setUseObjectFooters(boolean useObjectFooters) {
		this.useObjectFooters = useObjectFooters;
	}

	/**
	 * @param useSortObjects the useSortObjects to set
	 */
	public void setUseSortObjects(boolean useSortObjects) {
		this.useSortObjects = useSortObjects;
	}

	/**
	 * @return the useSlideMedia
	 */
	public boolean isUseSlideMedia() {
		return useSlideMedia;
	}

	/**
	 * @return the useObjects
	 */
	public boolean isUseObjects() {
		return useObjects;
	}

	/**
	 * @return the useObjectFooters
	 */
	public boolean isUseObjectFooters() {
		return useObjectFooters;
	}

	/**
	 * @return the useSortObjects
	 */
	public boolean isUseSortObjects() {
		return useSortObjects;
	}

	/**
	 * @return the fontFamily
	 */
	public String getFontFamily() {
		return fontFamily;
	}

	/**
	 * @param fontFamily the fontFamily to set
	 */
	public void setFontFamily(String fontFamily) {
		this.fontFamily = fontFamily;
	}

	/**
	 * @return the fontWeight
	 */
	public int getFontWeight() {
		return fontWeight;
	}

	/**
	 * @param fontWeight the fontWeight to set
	 */
	public void setFontWeight(int fontWeight) {
		this.fontWeight = fontWeight;
	}

	/**
	 * @return the fontSize
	 */
	public int getFontSize() {
		return fontSize;
	}

	/**
	 * @param fontSize the fontSize to set
	 */
	public void setFontSize(int fontSize) {
		this.fontSize = fontSize;
	}

	/**
	 * @return the fontColor
	 */
	public int getFontColor() {
		return fontColor;
	}

	/**
	 * @param fontColor the fontColor to set
	 */
	public void setFontColor(int fontColor) {
		this.fontColor = fontColor;
	}

	/**
	 * @return the useShadow
	 */
	public boolean isUseShadow() {
		return useShadow;
	}

	/**
	 * @param useShadow the useShadow to set
	 */
	public void setUseShadow(boolean useShadow) {
		this.useShadow = useShadow;
	}

	/**
	 * @return the shadowColor
	 */
	public int getShadowColor() {
		return shadowColor;
	}

	/**
	 * @param shadowColor the shadowColor to set
	 */
	public void setShadowColor(int shadowColor) {
		this.shadowColor = shadowColor;
	}

	/**
	 * @return the boxColor
	 */
	public int getBoxColor() {
		return boxColor;
	}

	/**
	 * @param boxColor the boxColor to set
	 */
	public void setBoxColor(int boxColor) {
		this.boxColor = boxColor;
	}

	/**
	 * @return the boxBorderStroke
	 */
	public int getBoxBorderStroke() {
		return boxBorderStroke;
	}

	/**
	 * @param boxBorderStroke the boxBorderStroke to set
	 */
	public void setBoxBorderStroke(int boxBorderSize) {
		this.boxBorderStroke = boxBorderSize;
	}
}
