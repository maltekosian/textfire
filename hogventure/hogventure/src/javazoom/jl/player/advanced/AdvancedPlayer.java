/*
 * 11/19/04		1.0 moved to LGPL. 
 *-----------------------------------------------------------------------
 *   This program is free software; you can redistribute it and/or modify
 *   it under the terms of the GNU Library General Public License as published
 *   by the Free Software Foundation; either version 2 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Library General Public License for more details.
 *
 *   You should have received a copy of the GNU Library General Public
 *   License along with this program; if not, write to the Free Software
 *   Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 *----------------------------------------------------------------------
 */

package javazoom.jl.player.advanced;

import java.io.ByteArrayInputStream;
import java.io.InputStream;

import javazoom.jl.decoder.Bitstream;
import javazoom.jl.decoder.BitstreamException;
import javazoom.jl.decoder.Decoder;
import javazoom.jl.decoder.Header;
import javazoom.jl.decoder.JavaLayerException;
import javazoom.jl.decoder.SampleBuffer;
import javazoom.jl.player.AudioDevice;
import javazoom.jl.player.FactoryRegistry;

/**
 * a hybrid of javazoom.jl.player.Player tweeked to include <code>play(startFrame, endFrame)</code>
 * hopefully this will be included in the api
 */
public class AdvancedPlayer
{
	/** The MPEG audio bitstream.*/
	private Bitstream bitstream;
	/** The MPEG audio decoder. */
	private Decoder decoder;
	/** The AudioDevice the audio samples are written to. */
	private AudioDevice audio;
	/** Has the player been closed? */
	private boolean closed = false;
	/** Has the player played back all frames from the stream? */
	private boolean complete = false;
	private int lastPosition = 0;
	/** Listener for the playback process */
	private PlaybackListener listener;
    
    public int currentFrame = 0;
    
    public final Object STATUS_SYNC = new Object();
    
    boolean isFading = false;
    double faderSpeed = 1.0;
    double faderPos = 0;
    double faderStart = 1.0;
    double faderEnd = 0;
    long lastFadeTime = 0;

	/**
	 * Creates a new <code>Player</code> instance.
	 */
	public AdvancedPlayer(InputStream stream) throws JavaLayerException
	{
		this(stream, null);
	}

	public AdvancedPlayer(InputStream stream, AudioDevice device) throws JavaLayerException
	{
		bitstream = new Bitstream(stream);

		if (device!=null) audio = device;
		else audio = FactoryRegistry.systemRegistry().createAudioDevice();
		audio.open(decoder = new Decoder());
	}

	public void play() throws JavaLayerException
	{
		play(Integer.MAX_VALUE);
	}

    public void playPerFrame() throws JavaLayerException
    {
        currentFrame = Integer.MAX_VALUE;
        playPerFrame(currentFrame);
    }
    
    public void playPerFrame(int frames) throws JavaLayerException
    {
        currentFrame = frames;
        
    }

	/**
	 * Plays a number of MPEG audio frames.
	 *
	 * @param frames	The number of frames to play.
	 * @return	true if the last frame was played, or false if there are
	 *			more frames.
	 */
	public boolean play(int frames) throws JavaLayerException
	{
		boolean ret = true;

		// report to listener
		if(listener != null) listener.playbackStarted(createEvent(PlaybackEvent.STARTED));

		while (frames-- > 0 && ret)
		{
			//System.out.println("starting mp3 frame");
            Thread.yield();
            ret = decodeFrame();
            Thread.yield();
//            try {
//                if(frames%2 == 0){
//                    Thread.sleep(40);
//                }
//            }
//            catch (Exception e) {}
//            try {
//                synchronized (this){
//                    wait();
//                }
//                
//            }
//            catch (InterruptedException e) {}
            //System.out.println("ending mp3 frame");
		}

//		if (!ret)
		{
			// last frame, ensure all data flushed to the audio device.
			AudioDevice out = audio;
			if (out != null)
			{
//				System.out.println(audio.getPosition());
				out.flush();
//				System.out.println(audio.getPosition());
				synchronized (this)
				{
					complete = (!closed);
					close();
				}

				// report to listener
				if(listener != null) listener.playbackFinished(createEvent(out, PlaybackEvent.STOPPED));
			}
		}
		return ret;
	}
    
    /**
     * Plays a number of MPEG audio frames.
     *
     * @param frames    The number of frames to play.
     * @return  true if the last frame was played, or false if there are
     *          more frames.
     */
    public boolean playOneFrame() throws JavaLayerException
    {
        boolean ret = true;

        // report to listener
        if(listener != null) listener.playbackStarted(createEvent(PlaybackEvent.STARTED));

        if (currentFrame-- > 0 && ret)
        {
            //System.out.println("starting mp3 frame");
            ret = decodeFrame();
            //System.out.println("ending mp3 frame");
        }
        
        if(currentFrame <= 0) ret = false;

        if (!ret)
        {
            // last frame, ensure all data flushed to the audio device.
            AudioDevice out = audio;
            if (out != null)
            {
//              System.out.println(audio.getPosition());
                out.flush();
//              System.out.println(audio.getPosition());
                synchronized (this)
                {
                    complete = (!closed);
                    close();
                }

                // report to listener
                if(listener != null) listener.playbackFinished(createEvent(out, PlaybackEvent.STOPPED));
            }
        }
        return ret;
    }

	/**
	 * Cloases this player. Any audio currently playing is stopped
	 * immediately.
	 */
	public void close()
	{
        synchronized(STATUS_SYNC){
            AudioDevice out = audio;
    		if (out != null)
    		{
    			closed = true;
    			audio = null;
    			// this may fail, so ensure object state is set up before
    			// calling this method.
    			out.close();
    			lastPosition = out.getPosition();
    			try
    			{
    				bitstream.close();
    			}
    			catch (BitstreamException ex)
    			{}
    		}
        }
	}

	/**
	 * Decodes a single frame.
	 *
	 * @return true if there are no more frames to decode, false otherwise.
	 */
	protected boolean decodeFrame() throws JavaLayerException
	{
		try
		{
			AudioDevice out = audio;
			if (out == null) return false;

			Header h = bitstream.readFrame();
			if (h == null) return false;
			//System.out.println(h.framesize);
            
			// sample buffer set when decoder constructed
            SampleBuffer output = (SampleBuffer) decoder.decodeFrame(h, bitstream);
            if(isFading)
            {
            	long currentFadeTime = System.nanoTime();
            	long timeElapsed = currentFadeTime - lastFadeTime;
            	if(timeElapsed > 0)
            	{
            		lastFadeTime = currentFadeTime;
	            	if(faderStart > faderEnd)
	            	{
	            		faderPos -= (double)timeElapsed/(1000.0*1000.0*1000.0) * faderSpeed;
	            		if(faderPos < faderEnd) 
	            			faderPos = faderEnd;
	            		else
	            			isFading = false;
	            	}
	            	else 
	            	{
	            		faderPos += (double)timeElapsed/(1000.0*1000.0*1000.0) * faderSpeed;
	            		if(faderPos > faderEnd) 
	            			faderPos = faderEnd;
	            		else 
	            			isFading = false;
	
	            	}
	            	
	            	System.out.println(faderPos);
	            	
	            	for(int i = 0; i < output.getBuffer().length; i++)
	            	{
		            	short oldValue = output.getBuffer()[i];
		            	short newValue = (short)Math.round((double)oldValue *  faderPos);
		            	output.getBuffer()[i] = newValue; 
	            	}
            	}
            }
            
            //System.out.println(output.getBufferLength());
			synchronized (this)
			{
				out = audio;
				if(out != null)
				{
					out.write(output.getBuffer(), 0, output.getBufferLength());
				}
			}
            
			bitstream.closeFrame();
		}
		catch (RuntimeException ex)
		{
			throw new JavaLayerException("Exception decoding audio frame", ex);
		}
		return true;
	}

	/**
	 * skips over a single frame
	 * @return false	if there are no more frames to decode, true otherwise.
	 */
	protected boolean skipFrame() throws JavaLayerException
	{
		Header h = bitstream.readFrame();
		if (h == null) return false;
		bitstream.closeFrame();
		return true;
	}

	/**
	 * Plays a range of MPEG audio frames
	 * @param start	The first frame to play
	 * @param end		The last frame to play
	 * @return true if the last frame was played, or false if there are more frames.
	 */
	public boolean play(final int start, final int end) throws JavaLayerException
	{
		boolean ret = true;
		int offset = start;
		while (offset-- > 0 && ret && !closed && !complete) {
            ret = skipFrame();
        }
		return play(end - start);
	}

	/**
	 * Constructs a <code>PlaybackEvent</code>
	 */
	private PlaybackEvent createEvent(int id)
	{
		return createEvent(audio, id);
	}

	/**
	 * Constructs a <code>PlaybackEvent</code>
	 */
	private PlaybackEvent createEvent(AudioDevice dev, int id)
	{
		return new PlaybackEvent(this, id, dev.getPosition());
	}

	/**
	 * sets the <code>PlaybackListener</code>
	 */
	public void setPlayBackListener(PlaybackListener listener)
	{
		this.listener = listener;
	}

	/**
	 * gets the <code>PlaybackListener</code>
	 */
	public PlaybackListener getPlayBackListener()
	{
		return listener;
	}

	/**
	 * closes the player and notifies <code>PlaybackListener</code>
	 */
	public void stop()
	{
        synchronized(STATUS_SYNC){
            if(listener!=null)listener.playbackFinished(createEvent(PlaybackEvent.STOPPED));
            close();
        }
	}
    
    /**
     * Returns the completed status of this player.
     * 
     * @return  true if all available MPEG audio frames have been
     *          decoded, or false otherwise. 
     */
    public boolean isComplete()
    {
        synchronized(STATUS_SYNC){
            return complete;
        }
    }
        
    /**
     * Returns the closed status of this player.
     * 
     * @return  true if closed, or false otherwise. 
     */
    public boolean isClosed()
    {
        synchronized(STATUS_SYNC){
            return closed;
        }
    }
    
    public void fadeOut(){
    	faderSpeed = 0.33;
    	faderStart = 1.0;
    	faderEnd = 0.0;
    	isFading = true;
    	lastFadeTime = System.nanoTime();
    	
    	faderPos = faderStart;
    }
    
    public void fadeIn(){
    	faderSpeed = 0.33;
    	faderStart = 0.0;
    	faderEnd = 1.0;
    	isFading = true;
    	lastFadeTime = System.nanoTime();
    	
    	faderPos = faderStart;
    }
    
    public void fadeReset(){
    	isFading = false;
    }
}