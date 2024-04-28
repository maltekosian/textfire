package com.hogventure.util;
/**
	GameThreadListener
	must have the methods
	timeElased(long t)
	int getFrequenceTime()
	boolean isRunning()

**/
public interface GameThreadListener {
    /**
     *
     * @param t
     */
    public void timeElapsed(long t);
    /**
     *
     * @return
     */
    public int getFrequenceTime();
    /**
     *
     * @return
     */
    public boolean isRunning();
}