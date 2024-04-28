package com.hogventure.util;

import java.io.File;
import java.io.FileOutputStream;
import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.util.Enumeration;
import java.util.Hashtable;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Vector;

import com.hogventure.basic.Slideshow;

/**
 * @author aquila
 *
 */
public class DumpUtil {

    /**
     * @param obj
     * @param path
     */
    public static void save(Object obj, String path) {
        try {
            File f = new File(path);
            if (!f.exists()) {
                f.mkdirs();
            }
            String filename = ((Dumpable) obj).getUid();
            FileOutputStream fos = new FileOutputStream(new File(path + "/" + filename + ".xml"));
            fos.write(("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n").getBytes());
            fos.write(toXML(obj, path).getBytes());
            fos.flush();
            fos.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    /**
     * method used by savegames
     * @param obj
     * @param path
     * @param filename
     */
    public static void save(Object obj, String path, String filename) {
        try {
            File f = new File(path);
            if (!f.exists()) {
                f.mkdirs();
            }
            //FileOutputStream fos = new FileOutputStream(new File(path+"/"+filename+"/"+filename+".xml"));
            FileOutputStream fos = new FileOutputStream(new File(path + "/" + filename + ".xml"));
            fos.write(("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n").getBytes());
            fos.write(toXML(obj, path).getBytes());
            fos.flush();
            fos.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
    
    /**
     * @param slideshow
     * @param path
     * @param filename
     * @return
     */
    public static Object load(Slideshow slideshow, String path, String filename) {
        DumpParser dp = new DumpParser();
        dp.load(slideshow, path + "/" + filename + ".xml");
        System.out.println("dp.load -> " + path + "/" + filename + ".xml");
        return dp.getObject();
    }

    /**
     * @param obj
     * @param path
     * @return
     */
    public static String toXML(Object obj, String path) {
        String xml = "";
        Class clazz = obj.getClass();
        String clazzname = clazz.getCanonicalName();
        xml = xml + "<class key=\"" + clazzname + "\" path=\"" + path + "\" " + "value=\"" + obj.toString() + "\">\n";
        Field[] fields = null;
        if (clazz.getSuperclass() != null) {
            fields = clazz.getSuperclass().getDeclaredFields();
        }
        Vector<Field> vf = new Vector<Field>();
        for (int i = 0; i < fields.length; i++) {
            vf.add(fields[i]);
        }
        fields = clazz.getDeclaredFields();
        for (int i = 0; i < fields.length; i++) {
            vf.add(fields[i]);
        }
        fields = new Field[vf.size()];
        for (int i = 0; i < vf.size(); i++) {
            fields[i] = vf.get(i);
        }

        for (int i = 0; i < fields.length; i++) {
            try {
                if (fields[i].get(obj) instanceof List) {
                    List v = (List) fields[i].get(obj);
                    if (v.size() > 0) {
                        xml = xml.concat("<list key=\"" + fields[i].getName() + "\">\n");
                        for (int j = 0; j < v.size(); j++) {
                            if (v.get(j) instanceof Dumpable) {
                                xml = dumpDumpable((Dumpable) v.get(j), xml, path);
                            } else {
                                xml = xml.concat(toXML(v.get(j), path));
                            }
                        }
                        xml = xml.concat("</list>\n");
                    }
                } else if (fields[i].get(obj) instanceof Map) {
                    Map h = (Map) fields[i].get(obj);
                    xml = xml.concat("<map key=\"" + fields[i].getName() + "\">\n");
                    //Enumeration e = h.keys();
                    Set set = h.keySet();//
                    Integer key = null;
                    for (Object o: set) {
                    	key = (Integer) o;
                        xml = xml.concat(toXML(h.get(key), path));
                    }
                    /*
                    while (e.hasMoreElements()) {
                    	key = (Integer) e.nextElement();
                        xml = xml.concat(toXML(h.get(key), path));
                    }*/
                    xml = xml.concat("</map>\n");
                } else if (fields[i].get(obj).getClass().isArray()) {
                    Object[] obs = (Object[]) fields[i].get(obj);
                    if (Array.getLength(obs) > 0) {
                        xml = xml.concat("<objectarray key=\"" + fields[i].getName() + "\" value=\"");
                        for (int j = 0; j < Array.getLength(obs); j++) {
                            Object o = Array.get(obs, j);
                            if (j > 0) {
                                xml = xml.concat("#");
                            }
                            String scl = "";
                            if (o instanceof Integer) {
                                scl = "Integer";
                            } else if (o instanceof Boolean) {
                                scl = "Boolean";
                            } else if (o instanceof String) {
                                scl = "String";
                            } else if (o != null) {
                                try {
                                    scl = path + "==" + o.getClass().getName();
                                } catch (Exception _ex) {
                                    System.out.println("path = > " + path);
                                    _ex.printStackTrace();
                                    System.exit(0);
                                }
                            }
                            xml = xml.concat(scl + "#" + parseForXML(o.toString()));
                        }
                        xml = xml.concat("\" />\n");
                    }
                } else if (fields[i].get(obj) instanceof String) {
                    String s = parseForXML(fields[i].get(obj).toString());
                    xml = xml + "<field key=\"" + fields[i].getName() + "\" value=\"" + s + "\" />\n";
                } else if (fields[i].getType().isPrimitive()) {
                    xml = xml + "<field key=\"" + fields[i].getName() + "\" value=\"" + fields[i].get(obj).toString() + "\" />\n";
                } else if (fields[i].get(obj) == null) {
                    //do nothing
                } else if (fields[i].get(obj) instanceof Dumpable) {
                    //xml = xml.concat( ((Dumpable) fields[i].get(obj)).toXML(fields[i].get(obj)) );
                    xml = xml.concat("<dumpable key=\"" + fields[i].getName() + "\" path=\"" + path + "\" " +
                            "value=\"" + fields[i].get(obj).toString() + "\" />\n");
                    ((Dumpable) fields[i].get(obj)).saveDump(path);
                }
            } catch (Exception ex) {
            }

        }
        xml = xml.concat("</class>\n");
        return xml;
    }

    /**
     * @param o
     * @param xml
     * @param path
     * @return
     */
    static String dumpDumpable(Dumpable o, String xml, String path) {
        xml = xml.concat("<dumpable key=\"" + o.toString() + "\" path=\"" + path + "\" " +
                "value=\"" + o.toString() + "\" />\n");
        ((Dumpable) o).saveDump(path);
        return xml;
    }

    /**
     * @param s
     * @return
     */
    static String parseForXML(String s) {
        s = s.replace("\n", "\\n");
        s = s.replace("\t", "\\t");
        return s;
    }
}
