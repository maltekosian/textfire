/**
 * 
 */
package com.hogventure.game;

import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;

import javax.swing.JComponent;

import com.hogventure.basic.Slide;
import com.hogventure.basic.Slideshow;
import com.hogventure.util.DialogsUtil;
import com.hogventure.util.GlobalPreferences;
import com.hogventure.util.MediaManager;

/**
 * @author aquila
 *
 */
public class GamePane 
	extends JComponent 
{
	Slideshow slideshow;
	Slide currentSlide;
	static GlobalPreferences globalPreferences;
	static MediaManager mediaManger;
	static DialogsUtil dialogsUtil;
	
	
	public GamePane() {
		setPreferredSize(new Dimension(800, 480));
		globalPreferences = new GlobalPreferences();
		mediaManger = new MediaManager();
		dialogsUtil = new DialogsUtil();
	}
	/* (non-Javadoc)
	 * @see javax.swing.JComponent#paintComponent(java.awt.Graphics)
	 */
	public void paintComponent(Graphics _g) {
		Graphics2D g = (Graphics2D) _g;
		g.fillRect(0, 0, getWidth(), getHeight());
		if (currentSlide != null) {
			if (currentSlide.hasPlugin()) {
				currentSlide.getPlugin().draw(g);
			} else {
				//mediamanger, backgroundmageRef
				//globalPreferences
				if (globalPreferences.isShowBackgroundImage() && mediaManger.hasImage(currentSlide.getBackgroundImageRef())) {
					g.drawImage(mediaManger.getImage(currentSlide.getBackgroundImageRef())
							, 0, 0, getWidth(), getHeight(), null);
				}
				//player != null
				//draw slides
				//draw bag
				if (globalPreferences.isShowSlidesOverview()) {
					//show visited slides on the left
				}
				if (globalPreferences.isShowBag()) {
					if (globalPreferences.isShowFigureOverview()) {
						//show bag overview and the figure overview
						//zero or one figure
					} else {
						//shows only the bag overview on the right
						//at least one figure or more
					}
				} else if (globalPreferences.isShowFigureOverview()) {
					//shows only the figure overview in the bottom right corner
					//do not use the bag
				}
				
				if (globalPreferences.isShowTitle()) {
					if (globalPreferences.isShowPoints()) {
						//draw the points
					}
					if (globalPreferences.isShowSlideTitle()) {
						//draw the slide title
					} else {
						//draw the slideshow title
					} 
					
				} else if (globalPreferences.isShowPoints()) {
					//draw the points without a title
				}
				//draw currentDialog
				//globalPreferences
				//fontFamily fontWeight fontSize fontColor
				//hasShadow ShadowColor
				//boxColor boxBorder 
			}
		}
	}
}
