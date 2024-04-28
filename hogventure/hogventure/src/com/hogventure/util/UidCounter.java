package com.hogventure.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.ArrayList;
import java.util.Properties;
import java.util.Random;

/**
 * @author aquila
 *
 */
public class UidCounter {
	static ArrayList<String>counters = new ArrayList<String>();

    String abc = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    Random rnd = new Random();

    /**
     * 
     */
    public void clear() {
        counters.clear();
    }

    /**
     * @return
     */
    public String getNewUid() {
        String counter = "";
        while (counter.length() < 5) {
            counter = counter + abc.charAt(Math.abs(rnd.nextInt() % abc.length()));
            if (counters.contains(counter)) {
                counter = "";
            }
        }
        counters.add(counter);
        return counter;
    }

     /**
     * @param filepath
     */
    public void load(String filepath) {
        Properties p = new Properties();
        File f = new File(filepath+".uid_counter.xml");//
        if (!f.exists()) return;
        try {
            p.loadFromXML(new FileInputStream(f));
            counters = new ArrayList<String>();
            int i = 0;
            while (p.containsKey(""+i)) {
                counters.add(p.getProperty(""+i));
                i++;
            }
        } catch (Exception ex) {}
    }

    /**
     * @param filepath
     * @param filename
     */
    public void save(String filepath, String filename) {
        File dir = new File(filepath);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        try {
            File f = new File(filepath+filename+".uid_counter.xml");//
            Properties p = new Properties();

            for (int i = 0; i < counters.size(); i++) {
                p.setProperty(""+i, counters.get(i));
            }
            p.storeToXML(new FileOutputStream(f), "", "UTF-8");
        } catch (Exception ex) {

        }
    }
    
    /**
     * @param id
     */
    public static void register(String id) {
        if (!counters.contains(id)) {
            counters.add(id);
        }
    }
}
