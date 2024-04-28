/**
 * 
 */
package com.hogventure.game;

import java.awt.BorderLayout;
import java.awt.Dimension;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;

import javax.swing.JFrame;
import javax.swing.JPanel;

import com.hogventure.util.GameThread;
import com.hogventure.util.GameThreadListener;

/**
 * @author aquila
 *
 */
public class SlideshowGame 
		extends JPanel
		implements GameThreadListener
{
	JFrame jframe;
	private boolean standalone = true;
	private boolean isApplet = false;
	private boolean running = false;
	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub
		new SlideshowGame(true, false);
	}
	
	public SlideshowGame(boolean standalone, boolean isApplet) {
		this.standalone = standalone;
		this.isApplet = isApplet;
		jframe = new JFrame();
		if (standalone) {
			jframe.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
		} else {
			jframe.addWindowListener(new WindowAdapter(){
				public void windowClosing(WindowEvent we) {
					kill();
				}
			}); 
		}
		
		setLayout(new BorderLayout());
		add(new GamePane(), BorderLayout.CENTER);
		jframe.add(this);
		jframe.pack();
		jframe.setVisible(true);
		jframe.setResizable(false);
		GameThread.addGameThreadListener(this, getFrequenceTime());
		running = true;
	}
	
	public void kill() {
		running = false;
		jframe.dispose();
		GameThread.removeGameThreadListener(this);
	}

	@Override
	public int getFrequenceTime() {
		return 25;
	}

	@Override
	public boolean isRunning() {
		return running;
	}

	@Override
	public void timeElapsed(long t) {
		if (running)
			repaint();
	}
}
