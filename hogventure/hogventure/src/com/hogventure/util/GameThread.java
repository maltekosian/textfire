package com.hogventure.util;

import java.util.Vector;
import java.util.Enumeration;


/** GameThread<br>
If you want to synchronize another thread to this thread, put the code in
a synchronized block like this:
<pre>
synchronized(GameThread.class) {
&lt;your code goes here&gt;
}
</pre> */
public class GameThread extends Thread {

    private static Vector<ThreadConsumer> listeners = new Vector<ThreadConsumer>();
    private static Chronometer chrono;
    private static GameThread gamethread;
    private static boolean runner = false;

    /**
     *
     */
    public static void kill() {
        synchronized (GameThread.class)  {
            runner = false;
            listeners.removeAll(listeners);
            Thread.yield();
            gamethread = null;
            chrono = null;
        }

    }

    /** Cant be directly instatiated... */
    private GameThread() {
        super("GameThread");
        runner = true;
        chrono = new Chronometer();
        start();
    }

    /** Adds the given threadlistener if its not already registered. 
     * @param listener
     * @param	frequenceTime	Minimum number of milliseconds that must pass between
    consecutive timeElapsed calls. Pass 0 for the highest
    frequency (which are currently 10 ms due to VM constraints). */
    public static void addGameThreadListener(GameThreadListener listener, long frequenceTime) {
//AntiDeadlock.update();
        synchronized (listeners) {
            // Is the listener already registered?
            ThreadConsumer tc = null;
            for (int i = 0; i < listeners.size(); i++) {
                tc = listeners.get(i);
                if (tc.listener == listener) {
                    return;
                }
            }

            // No, then add him...
            listeners.add(new ThreadConsumer(listener, frequenceTime));

            // Start thread if necessary
            if (gamethread == null) {
                gamethread = new GameThread();
            } else if (!gamethread.isAlive()) {
                gamethread = new GameThread();
            }
        }
    }

    /** This is a NOOP if the given listener is not registered.
     * @param listener
     */
    public static void removeGameThreadListener(GameThreadListener listener) {
//AntiDeadlock.update();
        synchronized (listeners) {
            // The listener wont be removed immediately, because the thread could just walk the vector!
            // Instead the thread will remove itself when it notices that tc.listener is null.
            for (int i = 0; i < listeners.size(); i++) {
                ThreadConsumer tc = listeners.get(i);
                if (tc.listener != listener) {
                    continue;
                }
                tc.listener = null;
            }
        }
    }

    @Override
    public void run() {
        long elapsed_time = 0;

        while (runner) {
            synchronized (GameThread.class) {
                // How much time has elapsed?
                if (chrono == null) {
                    chrono = new Chronometer();
                }
                try {
                    if (chrono != null) 
                    elapsed_time = chrono.getElapsedMillis();
                } catch (Exception e) {
                    System.out.println("GameThread throws Exception:");
                    e.printStackTrace();
                    
                    return;
                }

                // Call all the listeners whose time has elapsed...
                for (int i = 0; i < listeners.size(); i++) {
                    boolean remove = false;
                    ThreadConsumer tc = listeners.get(i);
                    if (tc.listener == null) {
                        remove = true;                    // Time elapsed?
                    }
                    tc.elapsed_time += elapsed_time;
                    if (!remove && tc.elapsed_time >= tc.frequenceTime) {
                        try {
                            // Notify the listener
                            tc.listener.timeElapsed(tc.elapsed_time);
                            tc.elapsed_time = 0;

                            // Did the listener remove itself?
                            if (tc.listener == null) {
                                remove = true;
                            }
                        } catch (Exception e) {
                            // An exception was thrown - remove 'im
                            System.err.println("Removing ThreadListener " +
                                    tc.listener + " because of Exception:");
                            e.printStackTrace();
                            remove = true;
                        }
                    }
                    // Remove this listener? This is done here because timeElapsed() could 
                    // call removeThreadListener()
                    if (remove) {
                        listeners.remove(i--);
                        continue;
                    }
                }
                if (listeners.size()== 0) {
                    runner = false;
                    break;
                }
            }
            // Let other threads run (mouse listener, key listener and so on)
            Thread.yield();
        }
    }

    /** There is one ThreadConsumer instance for every GameThread listener */
    static class ThreadConsumer {

        ThreadConsumer(GameThreadListener listener, long frequenceTime) {
            this.listener = listener;
            this.frequenceTime = frequenceTime;
        }
        public GameThreadListener listener;
        public long frequenceTime = 0;
        public long elapsed_time = 0;
    }

    
}
class Chronometer extends Thread
{
    private long last_time = System.nanoTime();

    //public synchronized long getElapsedMillis() throws Exception
    public long getElapsedMillis() throws Exception
    {
        Thread.sleep(10);
        //Thread.yield();
        long now = System.nanoTime();
        long elapsed_time = (now - last_time) / 1000000;
        last_time += elapsed_time * 1000000;	// last_time = now is a bug, because you drop the nanos
        return elapsed_time;
    }
    
    public void quit()
    {
    	// No-op
    }        
}