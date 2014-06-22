Heatmap from MCE
----------------

This is a [visualisation](http://polidea.github.com/mce-heatmap) of people movement and thus generated "heat" ;)
during the [MCE 2014 conference](http://mceconf.com). 
Data for this visualisation was taken from WiFi routers (which our IT team had setup and controlled). 
The data is anonymous, and only reflects thenumber of people that were in every room and hall during the conference. 
The conference took place in [Kino Praha](http://www.kinopraha.pl/) and we took advantage of the fact that cinema rooms
were very well isolated from each other, and we know with very good accuracy how many people were connected to WiFi 
in each of the rooms and in the hall of the cinema separately.

You can see the conference video including the venue at our official 
[Conference Video](https://www.youtube.com/watch?v=o6nTonUoOfE&list=PL79il-55EZPs9RpNqHLmbN62i4qFWep3O) . You can also 
see the video of accompanying [Jitter hackathon](http://jitter.io)

Data interpolation
------------------

The data was gathered with 5 minutes resolution, but for the purpose of better animations, we interpolated the values
with 1 minute resolution. It's simple interpolation assuming linear change in the number of people during those
5 minutes. 

Exit adjustments
----------------

We only had data for the roooms, but since we see how many people left or entered one of the 3 rooms every minute, 
or how many people left or entered the cinema every minute (total number of people in the cinema). 
Therefore we adjusted the numbers and moved the people between the rooms/halls and appropriate exists. This is 
approximation of course, but it is good enough and it allowed for much smoother animation steps - almost showing how
people are flowing between rooms.

Video snapshots
---------------

We used the [publicly released](https://www.youtube.com/playlist?list=PL79il-55EZPvAXReeaFE5Hfo4p_3TfpvX) 
videos of all the talks to generate snapshots at approximate times when it happened - so that you can correlate
the "heat" with particular moment in particular presentation. From each snapshot you can (by clicking) navigate 
directly to the related moment in the video.

Navigation
----------
You can either navigate the time manually using the range slider, or hit the play button to let animation start


Enjoy! And see you at the [MCE 2015 conference](http://mceconf.com)!
