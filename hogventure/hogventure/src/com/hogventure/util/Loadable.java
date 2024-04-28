package com.hogventure.util;

import java.util.Properties;

/**
 * @author aquila
 *
 */
public interface Loadable {
	/**
	 * @param p
	 * @return
	 */
	public Properties store(Properties p);
	/**
	 * @param p
	 */
	public void load(Properties p);
	/**
	 * @return
	 */
	public String getUid();
	/**
	 * @param _uid
	 * @return
	 */
	public boolean hasUid(String _uid);
}
