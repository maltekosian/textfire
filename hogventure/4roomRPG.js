/*
WHERE THE WILD THINGS GO

Let us create a mordern styled old fashiond storytelling RPG now.

entry point
decide what to play
a girl or a boy
YOU

EX your invious EX-BOY-OR-GIRL-FRIEND depending on your first choice
PARENT your mother or father (RANDOM CHOICE), who wants you to mary and get
children as soon as possible
FRIEND your hetero/homo girl/boy-friend (RANDOM CHOICES)
FOUR ROOMS linked like in the wumpus: each room has three choces to go to

a--b
|\/|
|/\|
d--c

a kitchen
b livingroom
c bathroom
d your room

After your first choice you will be placed in anyone of the four rooms
FRIEND - in one room, where not your PARENT or your EX are.
EX - in one room, where not your PARENT or your FRIEND are.
PARENT - in one room, where not your FRIEND or your EX are.

you might find yourself to be alone or with your friend, your parent or your ex.
Now survive the day and don't get pregnant and married. Your are just fifteen!
*/
function ScriptObject() {
	this.name = '';
	this.status = 0;
	this.type = 'object'; //other possible values player, character
}

function Room() {
	this.name = '';
	this.status = 0;
	this.objects = [];
}

function Game() {
	this.rooms =  [];

	this.init = function() {

	}
}
