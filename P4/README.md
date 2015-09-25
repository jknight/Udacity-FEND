
Udacity Front End Developer NanoDegree (FEND)
===

Project #4
---

- Jeffrey Knight <jeffrey.knight@gmail.com>

README requirement
---
"A README file is included detailing all setps required to 
successfully run the application and outlines the optimizations that the student
made in views/js/main.js for pizza.html

All steps required to run the application
---
In your favorite browser which surely isn't IE, browse to:
- http://jknight.github.io/P4/dest/index.html
- http://jknight.github.io/P4/dest/views/pizza.html
These are all that is required to run the application.

To review the source code, please see the code in git under 
- [https://github.com/jknight/jknight.github.io/tree/master/P4](P4 on git)

Please note that the code is in two directories: src/ contains the original code and dest/ is the output
of the front-end gulp build (minification, etc.)

Optimizations made in views/js/main.js
---
1) the 'pizza site' is included in the front-end build pipeline. Please see Gulpfile.js
2) keep pizzas in an array so we don't have to go back and pull them out of the DOM each time
3) pulled various repetitive tasks out of loops ("Do it once")
4) code cleanup in updatePositions code

Comments in Submission
---
I am aiming for "Exceeds Specifications" here. I'd appreciate it if you could fail this submission if it's not "Exceeds" !

- All code crunched with Gruntfile.js. I spent some time tweaking my gruntfile so you can selectively disable steps and still get a working output
- Code separated into src/ and des/ (grunt output) folders
- All code checked for FPS and speed. 
- Solicited additional feedback in forums: https://discussions.udacity.com/t/not-clear-on-frames-per-second-rate-is-60-fps-or-higher-requirement/32794/2
- PageSpeed insights reports speed of 94 on index.html desktop. Unfortunately, it's clocking 87 on mobile but I hope this gets me to Exceeds (https://developers.google.com/speed/pagespeed/insights/?url=http%3A%2F%2Fjknight.github.io%2FP4%2Fdest%2Findex.html%3Fasdfdsa&tab=desktop)
- Lots of comments and README.md
- Adding weird voodoo css hacks to get GPU involved in rendering (transform: translateZ(0) /  backface-visibility)
- Use document.getElementById instead of document.querySelector
- Use document.getElementsByClassName instead of document.querySelectorAll 
- Added inline task to Grunt to get above 90 speed threshold (mobile: 93 / 100, desktop: 95 / 100)) 
- Changed to document.getElementById() wherever possible
- Set pizzas offscreen visibility to hidden. Does this help? Needs more benchmarking to tell...

TODOs
---
- Could improve comments
