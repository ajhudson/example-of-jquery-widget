var Timer
var Now						  
function CountDown() {
	var el = document.getElementById("countdown-timer");

	if (el == null) {
		return;
	}

	//Parse out the minutes and seconds.
	var Mins = Now.substr(0, 2);
	var Seconds = Now.substr(3, 2);    						    
	if (Seconds == 0) {
		//Decrement the minutes.
		Mins--;						      
		//Make sure the minutes are in the right format: ##
		var Minutes = new String(Mins);
		if (Minutes.length == 1) Minutes = "0" + Minutes;
		Mins = Minutes;							      
		//Reset the seconds.
		Seconds = "59";
	} else {
		//Decrement the seconds
		Seconds--;						      
		//Make sure the seconds are in the right format: ##
		var Secs = new String(Seconds);
		if (Secs.length == 1) Secs = "0" + Secs;
		Seconds = Secs;
	}							    
	//Set the new form value				        						    
	//Stop the timer if we've got to 00:00
	if ((Mins == "00") && (Seconds == "00")) {
		el.innerHTML = "00:00";
		clearInterval(Timer);		
		location.href = "http://dev.web-cruit.com/logout.cfm";		
	} else {
		Now = Mins + ":" + Seconds;
		el.innerHTML = Mins + ":" + Seconds;
	}
}						  
Now = new String("60:00");
Timer = setInterval("CountDown()", 1000);