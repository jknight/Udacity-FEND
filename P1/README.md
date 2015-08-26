Udacity::Front End Web Developer Nanodegree:P1
===

Author: Jeffrey Knight <jeffrey.knight@gmail.com>
Date: Wed Aug 26 08:16:12 EDT 2015

About
---
This project is for P1 - implementing a HTML version of a PDF mockup

Notes / TODOs
---
* I'm writing this on the airplane and don't have access to any online materials so was bit of trial and error.
* Since I'm working offline, I installed bootstrap with npm before the flight. I'm not sure if it's bad form to reference bootstrap under
> node_modules/bootstrap/dist/css/bootstrap.min.css
as opposed to copying just bootstrap.css into the css/ folder? But since the npm install included a lot of other stuff I don't know about yet, I'll leave it for now.
* I'm not very happy with the left column being 2 wide. It's wider than I'd like.
* If I make it 1 (col-md-1) then it's too narrow. I'm not sure how to make a column a very specific width with using bootstrap, 
without just hard coding it in pixels (or percents).
* I sized the images to fit and need to see how they'll scale on other resolutions. I'm suspecting not well, so I need to 
look into responsive design a bit more.
* I'm not sure what the function of <main>, <section>, and <footer> are. Maybe just nice for search engines? Need to look into this more.
* I'm using medium columns ("col-md") somewhat randomly. Need to learn more about col-sm / col-md / col-lg

