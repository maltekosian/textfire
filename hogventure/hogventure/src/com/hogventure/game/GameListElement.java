/**
 * 
 */
package com.hogventure.game;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics2D;
import java.util.ArrayList;

/**
 * @author aquila
 *
 */
public class GameListElement {
    
	int width = 600;
	int height = 0;
	int posX = 0;
	int posY = 0;
	ArrayList<String> texts;
	String iconRef;
	
	/**
	 * @param text
	 * @param g
	 */
	public GameListElement(String text, Graphics2D g) {
		this.texts = formatedText(text, this.width, g);
	}
	
	/**
	 * @param text
	 * @param iconRef
	 * @param g
	 */
	public GameListElement(String text, String iconRef, Graphics2D g) {
		this.texts = formatedText(text, this.width, g);
		this.iconRef = iconRef;
	}
	/**
	 * iconRef ...
	 * @param g
	 */
	public void draw(Graphics2D g) {
		g.setColor(new Color(GamePane.globalPreferences.boxColor ,true));
		g.fillRoundRect(posX, posY, width, height, 
			GamePane.globalPreferences.roundRectSize, GamePane.globalPreferences.roundRectSize);
		g.setColor(new Color(GamePane.globalPreferences.boxBorderColor ,true));
		g.setStroke(new BasicStroke(GamePane.globalPreferences.boxBorderStroke));
		g.drawRoundRect(posX, posY, width, height, 
			GamePane.globalPreferences.roundRectSize, GamePane.globalPreferences.roundRectSize);
		
		g.setColor(new Color(GamePane.globalPreferences.fontColor ,true));
		g.setFont(new Font(GamePane.globalPreferences.fontFamily, 
				GamePane.globalPreferences.fontWeight, GamePane.globalPreferences.fontSize));
		int i = 0;
		int h = height / texts.size();
		if (texts != null) 
		for (String txt: texts ) {
			i++; 
			if ( i == 1 && iconRef != null) {
				if (GamePane.globalPreferences.useShadow) {
					g.setColor(new Color(GamePane.globalPreferences.shadowColor ,true));
					g.drawString(txt, posX  + 64 + GamePane.globalPreferences.boxPadding + 1,
							posY + 1 + i * (h-2) );
					g.setColor(new Color(GamePane.globalPreferences.fontColor ,true));
				}   
				g.drawString(txt, posX + 64 + GamePane.globalPreferences.boxPadding,
						posY + i * (h-2) );
			} else {
				if (GamePane.globalPreferences.useShadow) {
					g.setColor(new Color(GamePane.globalPreferences.shadowColor ,true));
					g.drawString(txt, posX + 1, posY + 1 + i * (h-2) );
					g.setColor(new Color(GamePane.globalPreferences.fontColor ,true));
				}   
				g.drawString(txt, posX, posY + i * (h-2) );
			}			
		}
	}
	/**
	 * poor and not realy right ... iconRef missing
	 * using globalPrefences.roundRectSize, globalPrefences.boxPadding
	 * @param text
	 * @param width
	 * @return
	 */
	public ArrayList<String> formatedText(String text, int width, Graphics2D g) {
		//Graphics g = this.getGraphics();
		ArrayList<String> alString = new ArrayList<String>();
		int _width = width - 2 * GamePane.globalPreferences.roundRectSize 
							- 2 * GamePane.globalPreferences.boxPadding;
		int w = 0;
		String[] _txt = text.split(" ");
		String s  = null;
		int i = 0;
		int h = g.getFontMetrics().getLeading() +
				g.getFontMetrics().getAscent() + 
				g.getFontMetrics().getDescent() + 2;
		while (i < _txt.length) {
		     
			w = g.getFontMetrics().stringWidth(s+" "+_txt[i]);
			if (w < width) {
			    alString.add(s);
				s = _txt[i];
				w = g.getFontMetrics().stringWidth(s);
				height = height + h;
			} else {
				s = s+" "+_txt[i];    
			}
			
			i++;
		}
		height = height + h;
		alString.add(s);
		return alString;
	}
	/**
	 * 	may set a mouseclick effect or a mouseover effect or will cause a game event
	 * @param x
	 * @param y
	 * @return
	 */
	public boolean isHit(int x, int y) {
		return (posX < x && x < posX + width && posY < y && y < posY + height);
	}
}