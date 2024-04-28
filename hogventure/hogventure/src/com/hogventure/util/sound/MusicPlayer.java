package com.hogventure.util.sound;

import java.io.ByteArrayInputStream;

import javazoom.jl.decoder.Bitstream;
import javazoom.jl.decoder.Header;
import javazoom.jl.player.advanced.AdvancedPlayer;

public class MusicPlayer implements Runnable{
    
    AdvancedPlayer streamingPlayer;
    
    Object musicIntro;
    Object music;
    Object musicExtro;
    
    boolean playIntro = false;
    boolean playExtro = false;
    boolean doLoop = false;
    
    boolean isPlaying = false;

    boolean isPlayingIntro = false;
    boolean isPlayingMusic = false;
    boolean isPlayingExtro = false;
    
    public String currentMusic = "nothing";
    
    public MusicPlayer()  {
    }
    
    public MusicPlayer(Object music)  {
        this.music = music;
    }
    
    public void setMusic(Object musicIntro, Object music, Object musicExtro){
        this.musicIntro = musicIntro;
        this.music = music;
        this.musicExtro = musicExtro;
    }

    public Object getMusic() {
        return music;
    }
    
    public void play(boolean playIntro, boolean playExtro, boolean doLoop){
        this.playIntro = playIntro;
        this.playExtro = playExtro;
        this.doLoop = doLoop;
        
        if(isPlaying) stop();
        
        isPlaying = true;
        Thread t = new Thread(this,"MP3-Music-Player");
        t.setPriority(Thread.MIN_PRIORITY);
        t.start();
    }
    
    public void play() {
        this.playIntro = false;
        this.playExtro = false;
        this.doLoop = false;
        //eigentlich für musik

        if(isPlaying) stop();
        
        isPlaying = true;
        Thread t = new Thread(this,"MP3-Music-Player");
        t.setPriority(Thread.MIN_PRIORITY);
        t.start();
    }
    
    public void loop() {
        this.playIntro = false;
        this.playExtro = false;
        this.doLoop = true;
        
        if(isPlaying) stop();
        
        isPlaying = true;
        Thread t = new Thread(this,"MP3-Music-Player");
        t.setPriority(Thread.MIN_PRIORITY);
        t.start();
    }
    
    public void playPerFrame(boolean playIntro, boolean playExtro, boolean doLoop){
        this.playIntro = playIntro;
        this.playExtro = playExtro;
        this.doLoop = doLoop;
        
        if(isPlaying) stop();
        
        isPlaying = true;
        runOnce();
    }

    public void run(){
        try {
            while(isPlaying){
                if((streamingPlayer == null) || streamingPlayer.isComplete() || streamingPlayer.isClosed()) {
                    Object myMusic = null;
                    if(playIntro){
                        playIntro = false;
                        myMusic = musicIntro;
                    }
                    else {
                        myMusic = music;
                    }
                    
                    playMusic(myMusic);
                    
                    if(isPlayingIntro) {
                        isPlayingIntro = false;
                        myMusic = music;
                        playMusic(myMusic);
                        
                    }
                    
                    if(!doLoop) break;
                }
                
            }
            stop();
        }
        catch (Exception e) {
            e.printStackTrace();
            stop();
        }
    }
    
    protected void runOnce(){
        try {
            
            if(isPlaying){
                if(isPlayingIntro && playIntro){
                    playMusic(musicIntro);
                }
                else if(playExtro){
                    playMusic(musicExtro);
                }
                else {
                    playMusic(music);
                }
                
                
            }
           
        }
        catch (Exception e) {
            e.printStackTrace();
            stop();
        }
    }
    
    private void playMusic(Object myMusic) throws Exception{
        
        if(myMusic == null) return;
        
        if (myMusic instanceof byte[]) {
            playMP3((byte[])myMusic);
        }
//        else if (myMusic instanceof Audio) {
//            playAudio((Audio)myMusic);
//        }
//        else if (myMusic instanceof AudioClip) {
//            playAudioClip((AudioClip)myMusic);
//        }
    }
    
    private void playMP3(byte[] data) throws Exception{
        System.out.println("Music length: "+getMusicLength(data));
        streamingPlayer = new AdvancedPlayer(new ByteArrayInputStream(data));
        streamingPlayer.play();   
    }
    
//    private void playAudioClip(AudioClip clip){
//        if(isPlayingIntro || isPlayingExtro){
//            clip.play();
//        }
//        else {
//            clip.loop();
//        }
//    }
//    
//    private void playAudio(Audio audio){
//        if(isPlayingIntro || isPlayingExtro){
//            audio.play();
//        }
//        else {
//            audio.loop();
//        }
//    }
    
    public synchronized void  stop() {
        
        isPlaying = false;
        
        isPlayingIntro = false;
        isPlayingMusic = false;
        isPlayingExtro = false;
        
        if(streamingPlayer!=null) {
            streamingPlayer.stop();
            streamingPlayer.close();
        }
    }
    
    public synchronized void  destroy(){
        stop();
        streamingPlayer = null;
        musicIntro = null;
        music = null;
        musicExtro = null;
        
    }
    
    public int getMusicLength(byte[] data) throws Exception{
        Bitstream m_bitstream = new Bitstream(new ByteArrayInputStream(data));
        Header m_header = m_bitstream.readFrame();
        int mediaLength = data.length;

        int nTotalMS = 0; 
        if (mediaLength >= 0) {
            nTotalMS = Math.round(m_header.total_ms(mediaLength));
        }
        //System.out.println("Length in ms: " + nTotalMS);
        
        return nTotalMS;
    }

    public String getCurrentMusic() {
        return currentMusic;
    }

    public void setCurrentMusic(String currentMusic) {
        this.currentMusic = currentMusic;
    }
    
    public boolean isStopped(){
        return (streamingPlayer == null) || (streamingPlayer.isComplete());
    }
    
    public synchronized void playNextFrame() throws Exception{
        if(streamingPlayer!=null){
            synchronized(streamingPlayer){
                //streamingPlayer.notify();
                streamingPlayer.playOneFrame();
                //System.out.println("playOneFrame");
                if(streamingPlayer.isComplete()){
                    stop();
                    if(doLoop){
                        isPlaying = true;
                        runOnce();
                    }
                }
            }
        }
    }
    
    public void fadeOut()
    {
    	if(streamingPlayer != null)
    		((AdvancedPlayer)streamingPlayer).fadeOut();
    }
    
    public void fadeIn()
    {
    	if(streamingPlayer != null)
    		((AdvancedPlayer)streamingPlayer).fadeIn();
    }
    
    public void fadeReset()
    {
    	if(streamingPlayer != null)
    		((AdvancedPlayer)streamingPlayer).fadeReset();
    }
}
