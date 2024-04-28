package com.hogventure.basic;

import java.awt.Graphics2D;

import com.hogventure.util.Dumpable;

public interface SlidePlugin 
	extends Dumpable
{
	public String getUid();
	public void draw(Graphics2D g);
	public void mousePressed(int x, int y);
	public void mouseReleased(int x, int y);
	public void mouseMoved(int x, int y);
}
