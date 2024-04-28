var GameThread = (
	function (gt) {
		var GameThread = gt;
		GameThread.listeners = [];
		GameThread.intervalId = null;
		GameThread.oldTime = 0;
		GameThread.counter = 0;

		GameThread.addListener = function (listener) {

			if (typeof listener == 'GameThread.GameThreadListener')
			{
				GameThread.counter ++;
				GameThread.listener.id = GameThread.counter;
				GameThread.listeners.push(listener);
				if (GameThread.intervalId == null)
				{
					GameThread.intervalId = setInterval('GameThread.run()', 10);
				}
			}
		};

		GameThread.removeListener = function (listener) {
			for (var i = GameThread.listeners.length - 1; i >= 0; i--)
			{
				if (GameThread.listeners[i].id == listener.id)
				{
					GameThread.listeners[i] = listener = null;
				}
			}
		}

		GameThread.deleteListener = function (listener) {
			for (var i = GameThread.listeners.length - 1; i >= 0; i--)
			{
				if (GameThread.listeners[i].id == listener.id)
				{
					GameThread.listeners.splice(i, 0);
				}
			}
			if (GameThread.listeners.length == 0)
			{
				clearInterval(GameThread.intervalId);
				GameThread.intervalId = null;
			}
		};

		window.GameThreadListener = function (_co, _t) {
			this.id = null;
			this.callObject = _co;
			this.time = _t;
			this.lastTime = 0;
		};

		GameThread.run = function () {
			var current_time = Date.now();
			var _t = current_time - GameThread.oldTime;
			for (var i = GameThread.listeners.length - 1; i >= 0; i--)
			{
				if (GameThread.listeners[i] != null)
				{
					if (GameThread.listeners[i].lastTime +
					 	GameThread.listeners[i].time <= currentTime) {
						if (GameThread.listeners[i].callObject != null)
						{
							try
							{
								GameThread.listeners[i].callObject.update(_t);
								GameThread.listeners[i].lastTime = currentTime;
							}
							catch (e)
							{
								GameThread.listeners.splice(i, 0);
							}
						} else {
							GameThread.listeners.splice(i, 0);
						}
					}
				} else {
					GameThread.listeners.splice(i, 0);
				}
			}
			GameThread.oldTime = current_time;

			if (GameThread.listeners.length == 0)
			{
				clearInterval(GameThread.intervalId);
				GameThread.intervalId = null;
			}
		};
	}
)(GameThread || {});
