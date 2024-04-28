package com.hogventure.util;

import java.lang.reflect.Field;
import java.util.Hashtable;
import java.util.List;
import java.util.Vector;

import org.xml.sax.Attributes;
import org.xml.sax.helpers.DefaultHandler;

import com.hogventure.basic.Slideshow;

/**
 * @author aquila
 *
 */
public class DumpHandler
        extends DefaultHandler {

    Vector<Object> objects = new Vector<Object>();
    Vector<Dumpable> dumpobjects = new Vector<Dumpable>();
    Slideshow slideshow;
    Object original = null;
    Object obj = null;
    boolean isVector = false;
    boolean isHash = false;
    Vector<List<Object>> helpvector = new Vector<List<Object>>();
    Hashtable<Object, Object> helphashtable = null;
    /**
     * @param slideshow
     */
    public DumpHandler(Slideshow slideshow) {
        this.slideshow = slideshow;
    }

    /* (non-Javadoc)
     * @see org.xml.sax.helpers.DefaultHandler#startElement(java.lang.String, java.lang.String, java.lang.String, org.xml.sax.Attributes)
     */
    @Override
    public void startElement(String uri, String localName, String qName, Attributes attributes) {
        if (qName.equals("class")) {
            try {
                if (attributes.getValue("key").equals("funkfish.basic.Slideshow")) {
                    original = slideshow;
                } else {
                    original = Class.forName(attributes.getValue("key")).newInstance();
                }
                if (this.obj == null) {
                    this.obj = original;
                }
                objects.add(original);
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            if (qName.equals("vector")) {
                System.out.println("helpvector.size -> " + helpvector.size());
            }
            resolveAttributes(original, qName, attributes);
        }
    }

    /**
     * @param dumpableObject
     * @return
     */
    Dumpable addDumpable(Dumpable dumpableObject) {
        for (int i = 0; i < dumpobjects.size(); i++) {
            if (dumpobjects.get(i).hasUid(dumpableObject.getUid()) ||
                    dumpobjects.get(i).toString().equals(dumpableObject.toString())) {
                return dumpobjects.get(i);
            }
        }
        dumpobjects.add(dumpableObject);
        return dumpableObject;
    }
    /**
     * @return
     */
    public Object getObject() {
        return obj;
    }
    /**
     * @param obje
     * @param qName
     * @param attributes
     */
    public void resolveAttributes(Object obje, String qName, Attributes attributes) {

        try {
            if (obje != null) {

                Field f = null;
                /*
                if (obje.getClass().getDeclaredField(attributes.getValue("key")) != null) {
                f = obje.getClass().getDeclaredField(attributes.getValue("key"));
                } else if (obje.getClass().getSuperclass().getDeclaredField(attributes.getValue("key")) != null) {
                f = obje.getClass().getSuperclass().getDeclaredField(attributes.getValue("key"));
                } else if (obje instanceof Dumpable) {
                obje = ((Dumpable) obje).load( attributes.getValue("path"), attributes.getValue("value"));
                obje = addDumpable((Dumpable) obje);
                helpvector.lastElement().add(obje);
                return;
                }*/

                try {
                    f = obje.getClass().getDeclaredField(attributes.getValue("key"));
                } catch (NoSuchFieldException ex) {
                    try {
                        f = obje.getClass().getSuperclass().getDeclaredField(attributes.getValue("key"));
                    } catch (NoSuchFieldException e) {
                        if (obje instanceof Dumpable) {
                            obje = ((Dumpable) obje).loadDump(slideshow, attributes.getValue("path"), attributes.getValue("value"));
                            obje = addDumpable((Dumpable) obje);
                            helpvector.lastElement().add(obje);
                            return;
                        } else if (obje instanceof Integer) {
                            obje = new Integer(attributes.getValue("value"));
                            helpvector.lastElement().add(obje);
                            return;
                        } else if (obje instanceof String) {
                            obje = attributes.getValue("value");
                            helpvector.lastElement().add(obje);
                            return;
                        } else if (obje instanceof Boolean) {
                            obje = new Boolean(attributes.getValue("value"));
                            helpvector.lastElement().add(obje);
                            return;
                        }
                    }
                }

                if (f.get(obje) instanceof Integer) {
                    f.set(obje, new Integer(attributes.getValue("value")));
                } else if (f.get(obje) instanceof List) {
                    List<Object> hv = (List) f.get(obje);
                    hv.removeAll(hv);
                    helpvector.add(hv);
                    f.set(obje, hv);
                    System.out.println("vector->obj " + obje.getClass().getName());
                } else if (f.get(obje) instanceof Hashtable) {
                    helphashtable = new Hashtable<Object, Object>();
                    f.set(obje, helphashtable);
                    isHash = true;
                /*} else if (f.get(obje) instanceof SlideTarget) { 
                    Object d = ((SlideTarget) f.get(obje)).load(slideshow, attributes.getValue("path"), attributes.getValue("value"));
                    d = addDumpable((SlideTarget) d);
                    ((SlideTarget) d).setSlideshow(slideshow);
                    f.set(obje, (SlideTarget) d);
                } else if (f.get(obje) instanceof SlideCondition) {
                    Object d = ((SlideCondition) f.get(obje)).load(slideshow, attributes.getValue("path"), attributes.getValue("value"));
                    d = addDumpable((SlideCondition) d);
                    ((SlideCondition) d).setSlideshow(slideshow);
                    f.set(obje, (SlideCondition) d);*/
                } else if (f.get(obje) instanceof Dumpable) {
                    Object d = ((Dumpable) f.get(obje)).loadDump(slideshow, attributes.getValue("path"), attributes.getValue("value"));
                    d = addDumpable((Dumpable) d);
                    f.set(obje, (Dumpable) d);
                } else if (f.get(obje).getClass().isArray()) {
                    String[] s = attributes.getValue("value").split("#");
                    Object[] obs = new Object[s.length / 2];
                    System.out.println(s.length + " >>> objectarray -> " + obs.length);
                    for (int i = 0; i < s.length; i += 2) {
                        //class value
                        // this combination would always build a new instance of the given object
                        //except that the object is an instance of dumpable. Than we check if this dumpable is already member
                        System.out.println(s[i] + "," + s[i + 1]);
                        if (s[i].equals("Integer")) {
                            obs[i / 2] = new Integer(s[i + 1]);
                        } else if (s[i].equals("Boolean")) {
                            obs[i / 2] = new Boolean(s[i + 1]);
                        } else if (s[i].equals("String")) {
                            obs[i / 2] = s[i + 1].replace("\\n", "\n");
                        } else {
                            /*	try {
                            String[] _s = s[i].split("==");
                            obs[i/2] = Class.forName(_s[1]).newInstance();
                            if (obs[i/2] instanceof Dumpable) {
                            obs[i/2] = addDumpable((Dumpable) ((Dumpable) obs[i/2]).load(_s[0], s[1]) );
                            }
                            } catch (Exception _ex) {
                            _ex.printStackTrace();
                            obs[i/2] = null;
                            System.exit(0);
                            }
                            //obs[i/2] = s[i] + "==" + s[i+1];
                             */
                        }
                    }
                    f.set(obje, obs);
                } else if (f.get(obje) instanceof Boolean) {
                    f.set(obje, new Boolean(attributes.getValue("value")));
                } else if (f.get(obje) instanceof Double) {
                    f.set(obje, new Double(attributes.getValue("value")));
                } else if (f.get(obje) instanceof Float) {
                    f.set(obje, new Float(attributes.getValue("value")));
                } else if (f.get(obje) instanceof String) {
                    f.set(obje, attributes.getValue("value").replace("\\n", "\n"));
                }
            }
        } catch (Exception ex) {
            System.out.println(qName + "<<<" + attributes.getValue("key") + " <<< " + attributes.getValue("value") + " - " + ex);
        }

    }

    /* (non-Javadoc)
     * @see org.xml.sax.helpers.DefaultHandler#endElement(java.lang.String, java.lang.String, java.lang.String)
     */
    @Override
    public void endElement(String uri, String localName, String qName) {
        if (qName.equals("class")) {
            System.out.println("objects.size -> " + objects.size());
            if (helpvector.size() > 0) {
                System.out.println("helpvector.size -> " + helpvector.size());
                helpvector.lastElement().add(objects.lastElement());
            } else if (isHash) {
                helphashtable.put("" + ((Dumpable) objects.lastElement()).toString(), objects.lastElement());
            }
            objects.remove(objects.lastElement());
            if (objects.size() > 0) {
                original = objects.lastElement();
            }
        } else if (qName.equals("vector")) {
            if (helpvector.size() > 0) {
                helpvector.remove(helpvector.lastElement());
                System.out.println("//helpvector.size -> " + helpvector.size());
            }
        } else if (qName.equals("hashtable")) {
            isHash = false;
        }
    }

    /* (non-Javadoc)
     * @see org.xml.sax.helpers.DefaultHandler#characters(char[], int, int)
     */
    @Override
    public void characters(char buf[], int offset, int len) {
        String s = new String(buf, offset, len);
    }

    /**
     * @param slideshow
     */
    void setSlideshow(Slideshow slideshow) {
        this.slideshow = slideshow;
    }
}