/**
 * 
 */
package com.hogventure.basic;

import java.util.ArrayList;

import com.hogventure.util.DialogsUtil;
import com.hogventure.util.GlobalPreferences;
import com.hogventure.util.MediaManager;
import com.hogventure.util.UidCounter;

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
 */
public class Slideshow {
	String uid;
	String title;
	ArrayList<Slide>slides;
	//static MediaManager mediaManger;
	//static DialogsUtil dialogsUtil;
	String globalAmbientMusicRef;
	SlideshowPlayer player;
	//static GlobalPreferences globalPreferences;
	static UidCounter counter;
	Slide currentSlide;
	/**
	 * @return the currentSlide
	 */
	public Slide getCurrentSlide() {
		return currentSlide;
	}
	/**
	 * @param currentSlide the currentSlide to set
	 */
	public void setCurrentSlide(Slide currentSlide) {
		this.currentSlide = currentSlide;
	}
	/**
	 * default constructor
	 */
	public Slideshow() {
		slides = new ArrayList<Slide>();
		//globalPreferences = new GlobalPreferences();
		//mediaManger = new MediaManager();
		//dialogsUtil = new DialogsUtil();
		counter = new UidCounter();
	}
	/**
	 * @param uid
	 */
	public Slideshow(String uid) {
		super();
		this.uid = uid;
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
	 * @return the slides
	 */
	public ArrayList<Slide> getSlides() {
		return slides;
	}
	/**
	 * @param slides the slides to set
	 */
	public void setSlides(ArrayList<Slide> slides) {
		this.slides = slides;
	}
	/*
	 * @return the mediaManger
	 *
	public static MediaManager getMediaManger() {
		return mediaManger;
	}
	/*
	 * @param mediaManger the mediaManger to set
	 *
	public static void setMediaManger(MediaManager mediaManger) {
		Slideshow.mediaManger = mediaManger;
	}
	/**
	 * @return the dialogsUtil
	 *
	public static DialogsUtil getDialogsUtil() {
		return dialogsUtil;
	}
	/**
	 * @param dialogsUtil the dialogsUtil to set
	 *
	public static void setDialogsUtil(DialogsUtil dialogsUtil) {
		Slideshow.dialogsUtil = dialogsUtil;
	}*/
	/**
	 * @return the globalAmbientMusicRef
	 */
	public String getGlobalAmbientMusicRef() {
		return globalAmbientMusicRef;
	}
	/**
	 * @param globalAmbientMusicRef the globalAmbientMusicRef to set
	 */
	public void setGlobalAmbientMusicRef(String globalAmbientMusicRef) {
		this.globalAmbientMusicRef = globalAmbientMusicRef;
	}
	/**
	 * @return the player
	 */
	public SlideshowPlayer getPlayer() {
		return player;
	}
	/**
	 * @param player the player to set
	 */
	public void setPlayer(SlideshowPlayer player) {
		this.player = player;
	}
	/*
	 * @return the globalPreferences
	 *
	public static GlobalPreferences getGlobalPreferences() {
		return globalPreferences;
	}
	/*
	 * @param globalPreferences the globalPreferences to set
	 *
	public static void setGlobalPreferences(GlobalPreferences globalPreferences) {
		Slideshow.globalPreferences = globalPreferences;
	}*/
	/**
	 * @return the uid
	 */
	public String getUid() {
		return uid;
	}
}
