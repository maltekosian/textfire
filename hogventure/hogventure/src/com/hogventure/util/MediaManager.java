package com.hogventure.util;

import com.hogventure.util.sound.MusicPlayer;
import java.awt.*;
import java.awt.image.*;
import java.util.*;
import java.io.*;

/**
 * @author aquila
 *
 */
public class MediaManager
        extends Component
        implements ImageObserver {

    /***/
    private static Hashtable<String, Image> gameImages;
    /***/
    private static Hashtable<String, MusicPlayer> gameSounds;
    /***/
    //private static Hashtable<String, SlideAnimation> gameAnimations;
    /***/
    private Toolkit toolkit = Toolkit.getDefaultToolkit();
    /**
     * 
     */
    //private static Hashtable<String, SlideAnimation> slideAnimations;
    /***/
    private static Hashtable<String, Image> slideImages;
    /***/
    private static Hashtable<String, MusicPlayer> slideSounds;
    /**
     * 
     */
    public MediaManager() {
    	gameImages = new Hashtable<String, Image>();
        gameSounds = new Hashtable<String, MusicPlayer>();
        //gameAnimations = new Hashtable<String, SlideAnimation>();
        slideImages = new Hashtable<String, Image>();
        slideSounds = new Hashtable<String, MusicPlayer>();
        //mp3player = new MusicPlayer();
    }

    /**
     * @param path
     * @param key 
     */
    public void loadSound(String path, String key) {
        try {
            InputStream stream = getClass().getClassLoader().getResourceAsStream(path);//toolkit.getAudioClip(getClass().getClassLoader().getResource(path));
            //System.out.println("ImageLoader.loadSound->" + path);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int len;
            while ((len = stream.read(buffer)) >= 0) {
                baos.write(buffer, 0, len);
            }
            byte[] entrydata = baos.toByteArray();
            gameSounds.put(key, new MusicPlayer(entrydata));
        } catch (Exception ex) {
            ex.printStackTrace();
            //System.out.println("ImageLoader.loadSound:catchex->" + path);
        }
    }

    /**
     * @param filepath
     * @param key 
     */
    public void loadImage(String filepath, String key) {
        try {
            boolean load = false;
            System.out.println("ImageLoader.loadImage->" + filepath);
            MediaTracker mt = new MediaTracker(this);
            Image image = null;
            if (getClass().getClassLoader().getResource(filepath) == null) {
                image = toolkit.getImage(filepath);
            } else {
                image = toolkit.createImage(getClass().getClassLoader().getResource(filepath));
            }
           
            mt.addImage(image, 0);
            while (!load) {
                //if (!imageUpdate(image, this.ALLBITS, 0, 0, w, h)) {
                try {
                    mt.waitForID(0);
                    mt.waitForAll();
                    if (mt.checkID(0) && !mt.isErrorID(0)) {
                        load = true;
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            //}
            }
            gameImages.put(key, image);
            //System.out.println("ImageLoader.loadImage !!!->" + filepath);
            //animations.put(key, new SlideAnimation(key, true));
        } catch (Exception ex) {
            ex.printStackTrace();
            //System.out.println("ImageLoader.loadImage:catchex->" + filepath);
        }
    }

    /**
     * @return 
     */
    public Hashtable<String, Image> getAllImages() {
        return gameImages;
    }

    /**
     * 
     * @return
     */
    public ArrayList<String> getAllKeys() {
        ArrayList<String> al = new ArrayList<String>();
        al.addAll(gameImages.keySet());
        al.addAll(gameSounds.keySet());
        /*Enumeration e = animations.keys();
        while (e.hasMoreElements()) {
            String key = (String) e.nextElement();
            if (key.endsWith(".ani.xml")) {
                al.add(key);
            }
        }*/
        return al;
    }

    /**
     * @return 
     */
    public Hashtable<String, MusicPlayer> getAllSounds() {
        return gameSounds;
    }

    /**
     * @param key
     * @return 
     */
    public static Image getImage(String key) {
        //if(gameimages.get(key) == null) //System.out.println(key);
        return gameImages.get(key);
    }

    /**
     * @param key
     * @return
     */
    public static boolean hasImage(String key) {
        if (key == null || key.trim().equals("")) return false;
        return gameImages.containsKey(key);
    }

    /**
     * @param key
     * @return 
     *//*
    public static SlideAnimation getAnimation(String key) {
        return animations.get(key);
    }*/


    /**
     * @param key 
     */
    public static void playSound(String key) {
        if (gameSounds.containsKey(key)) {
            if (!gameSounds.get(key).isStopped()) {
                MusicPlayer mp3 = new MusicPlayer(gameSounds.get(key).getMusic());
                mp3.play();
            } else {
                gameSounds.get(key).play();
            }
        }
    }

    /**
     * @param key 
     */
    public static void stopSound(String key) {
        if (gameSounds.containsKey(key)) {
            gameSounds.get(key).stop();
        }
    }

    public static boolean hasSound(String key) {
        if (key == null || key.trim().equals("")) return false;
        return gameSounds.containsKey(key);
    }
    /**
     * @param key 
     */
    public static void loopSound(String key) {
        if (gameSounds.containsKey(key)) {
            gameSounds.get(key).loop();
        }
    }

    /**
     * gets all Filenames in the folder images that ends with .jpg
     * future releases:
     * show up all files of [propertiesname].slideshow
     * put any entry to the imageloader
     * @param path 
     * @param filename
     */
    public void load(String path, String filename) {
        //System.out.println("MediaManager.load -> " + path + "" + path + "/" + filename + "/" + filename + ".images.xml");
        
            gameImages = new Hashtable<String, Image>();
            gameSounds = new Hashtable<String, MusicPlayer>();
            //gameAnimations = new Hashtable<String, SlideAnimation>();
            Properties p = new Properties();
            try {
                try {
                    p.loadFromXML(getClass().getClassLoader().getResourceAsStream("" + path + "/" + filename + "/" + filename + ".media.xml"));
                } catch(Exception ex) {
                    p.loadFromXML(new FileInputStream("./" + path + "/" + filename + "/" + filename + ".media.xml"));
                }
                int MAX_amount = new Integer(p.getProperty("MAX_amount"));
                String key = null;
                for (int i = 0; i < MAX_amount; i++) {
                    key = p.getProperty("" + i);
                    String t = null;
                    try {
                        t = p.getProperty(i + "_type");
                    } catch (Exception _ex) {
                        //t is still null
                        t = "image";
                    }
                    if (t == null || t.equals("image")) {
                        loadImage(p.getProperty(key), key);
                    } else if (t.equals("sound")) {
                        loadSound(p.getProperty(key), key);
                    } else if (t.equals("animation")) {
                        //this path already contains the key.

                        //loadAnimation(p.getProperty(key), key);
                    }
                }
            } catch (Exception ex) {
                ex.printStackTrace();
            }
        
    }

    /**
     * asks for the name of the file and 
     * saves the current slideshow to toolkit xml-properties file
     * every slideshow is saved to it's own folder in the slideshow folder
     * including the images
     * @param path
     * @param filename 
     */
    public void save(String path, String filename) {
        Properties p = new Properties();
        p.setProperty("MAX_amount", "" + (gameImages.size() + gameSounds.size() ) );//+ animations.size()));
        int maxAmount = 0;
        Enumeration e = gameImages.keys();
        while (e.hasMoreElements()) {
            String key = (String) e.nextElement();
            p.setProperty("" + maxAmount, key);
            p.setProperty(key, "./" + path + "/" + filename + "/media/" + key);
            p.setProperty(maxAmount + "_type", "image");
            maxAmount++;
        }
        e = gameSounds.keys();
        while (e.hasMoreElements()) {
            String key = (String) e.nextElement();
            p.setProperty("" + maxAmount, key);
            p.setProperty(key, "./" + path + "/" + filename + "/media/" + key);
            p.setProperty(maxAmount + "_type", "sound");
            maxAmount++;
        }
        //e = animations.keys();
        File f = new File("./" + path + "/" + filename + "/");
        if (!f.exists()) {
            f.mkdirs();
        }
        /*
        while (e.hasMoreElements()) {
            String key = (String) e.nextElement();
            if (key.endsWith(".ani.xml")) {
                p.setProperty("" + maxAmount, key);
                p.setProperty(key, "./" + path + "/" + filename + "/media/" + key);
                p.setProperty(maxAmount + "_type", "animation");
                gameAnimations.get(key).save("./" + path + "/" + filename + "/media/"+key, key);
                maxAmount++;
            }
        }*/
        p.setProperty("MAX_amount", "" + maxAmount);
        f = new File("./" + path + "/" + filename + "/" + filename + ".media.xml");
        try {
            p.storeToXML(new FileOutputStream(f), "name is " + filename, "UTF-8");
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    /**
     * this is used by the mediamanger to load known old animations (properties)
     * and unknown new animations request via SlideAnimationPane
     * @param path
     * @param key 
     *//*
    public void loadAnimation(String path, String key) {
        SlideAnimation sani = new SlideAnimation();
        sani.load(path, key);
        animations.put(key, sani);
    }*/
}

