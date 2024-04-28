/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

package com.hogventure.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.util.Properties;

/**
 *
 * @author aquila
 */
public class DialogUtil {

    private Properties dialogs = new Properties();
    private String language = "default";

    public DialogUtil(String language) {
        this.language = language;
    }

    public String addDialog(String key, String value) {
        dialogs.setProperty(key, value);
        return key;
    }

    public String getDialog(String key) {
        if (key == null) return null;
        if (!dialogs.containsKey(key)) return "";
        return dialogs.getProperty(key);
    }

    public void removeDialog(String key) {
        dialogs.remove(key);
    }

    public String getLanguage() {
        return language;
    }

    public boolean load(String projectTitle) {
        Properties _dialogs = null;
        try {
            _dialogs = new Properties();
            File dir = new File("projects/"+projectTitle);
            if (!dir.exists()) return false;
            _dialogs.loadFromXML(new FileInputStream(new File("projects/"+projectTitle+"/"+
                projectTitle+"."+language+".xml")));
        } catch (Exception ex ) {
            return false;
        }
        dialogs.clear();
        dialogs = _dialogs;
        return true;
    }

    public void save(String projectTitle, String language) {
        File dir = new File("projects/"+projectTitle);
        if (!dir.exists()) {
            dir.mkdirs();
        }
        try {
            dialogs.storeToXML(new FileOutputStream(new File("projects/"+projectTitle+"/"+
                                    projectTitle+"."+language+".xml")), "", "UTF-8");
        } catch(Exception ex) {
        }
    }
}
