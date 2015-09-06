var HTMLheaderName = '<h1 id="name">%data%</h1><hr/>';
//var HTMLheaderRole = '<span>%data%</span><hr/>'; //not un use

//Merged these together and used named variables - much easier to manage then separate entries for each <li>
var HTMLcontactTemplate = '<li class="flex-item"><span class="orange-text">mobile</span><span class="white-text">%mobile%</span></li>' + 
		'<li class="flex-item"><span class="orange-text">email</span><span class="white-text">%email%</span></li>' + 
		'<li class="flex-item"><span class="orange-text">twitter</span><span class="white-text">%twitter%</span></li>' + 
		'<li class="flex-item"><span class="orange-text">github</span><span class="white-text">%github%</span></li>' + 
		'<li class="flex-item"><span class="orange-text">location</span><span class="white-text">%location%</span></li>';

var HTMLbioPic = '<img src="%data%" class="biopic">';
var HTMLwelcomeMsg = '<span class="welcome-message">%data%</span>';

var HTMLskillsStart = '<h3 id="skills-h3">Skills at a Glance:</h3><ul id="skills" class="flex-box"></ul>';
var HTMLskills = '<li class="flex-item skills-list"><span class="white-text">%data%</span></li>';

var HTMLworkStart = '<div class="work"></div>';
var HTMLworkTemplate = '<div class="work-entry"><a href="%employerUrl%">%employer%</a></div>' + 
                       '<span class="location-text">%location%</span>' + 
                       '<br/><b>%title%</b><span class="date-text">(%dates%)</span>' + 
                       '<p>%description%</p><br/>';


var HTMLprojectStart = '<div class="projects"></div>';
var HTMLprojectTemplate = '<div class="project-entry"><a href="#">%title%</a></div>' + 
                          '<div class="date-text">%dates%</div>' + 
                          '<p><br>%description%</p>';
var HTMLprojectTemplateImage = '<img class="projectImage" src="%image%">';

var HTMLschoolStart = '<div class="education"></div><h3>Schools & Degrees</h3>';
var HTMLschoolTemplate = '<div class="education-entry"><a href="#">%name% - %degree%</a></div>' + 
                         '<div class="location-text">%location%</div>' + 
                         '<ul class="majors"><b>%majors%</b></ul>' + 
                         '<span class="date-text">(%dates%)</span>';
var HTMLschoolTemplateMajor = '<li>%major%</li>';

var HTMLonlineClassesStart = '<div class="education"></div><h3>Online Classes</h3>';
var HTMLonlineClassesTemplate = '<div class="education-entry">%title% - %school%</div>' + 
                                '<div class="date-text">%date%</div>' + 
                                '<a href="#">%url%</a>';

var internationalizeButton = '<button>Internationalize</button>';

//NOTE: can't see any good reason to load this from json ? moving it directly into html
//var googleMap = '<div id="map"></div>';

