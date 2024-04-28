package com.hogventure.util;

import javax.xml.parsers.SAXParser;
import javax.xml.parsers.SAXParserFactory;

import com.hogventure.basic.Slideshow;

/**
 * @author aquila
 *
 */
public class DumpParser
{

	DumpHandler dumphandler;	

	/**
	 * @param slideshow
	 * @param filename
	 * @return
	 */
	public Object load(Slideshow slideshow, String filename) {
            if (dumphandler == null) { dumphandler = new DumpHandler(slideshow); }
		try {     
			if (filename == null) {
				filename = "Main.xml";
			}
                        /*
                        File f = new File(filename);
                        if (f.exists() ) {
                            filename = f.getAbsolutePath() ; //+"/"+f.getName();
                            filename = filename.replace("/./","/");
                        }*/
                        dumphandler.setSlideshow(slideshow);
			System.out.println("Try to load XML-File: "+filename);
                        SAXParser saxParser = SAXParserFactory.newInstance().newSAXParser();
			saxParser.parse( getClass().getClassLoader().getResourceAsStream(filename) , dumphandler );
			return dumphandler.getObject();
        } catch (Throwable t) {
			System.out.println("Exception @ DumpParser -> "+filename);
			t.printStackTrace();
                        //System.exit(0);
		}
		return null;
	}

	/**
	 * @return
	 */
	public Object getObject() {
		return dumphandler.getObject();
	}
}