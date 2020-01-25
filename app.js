var express     = require('express'),  
    bodyParser  = require('body-parser'),  
    mongodb     = require('mongodb'),  
    MongoClient = mongodb.MongoClient,
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
    unirest     = require("unirest"),
	methodOverride= require("method-override"),
	reqd        = unirest("GET", "https://deezerdevs-deezer.p.rapidapi.com/search"),
	app         = express(),  
	flash       = require('connect-flash'),
	result,song,obj2,empty=null; 
const validator = require("validator")


var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);


app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public')); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.use(flash());

const port = 3000




// connecting to monggose server
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/playlist_app",{ useNewUrlParser: true,useUnifiedTopology: true });

// passport authentication setup
var UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

UserSchema.plugin(passportLocalMongoose)

var User = mongoose.model("User", UserSchema);

app.use(require("express-session")({
    secret: "playlist app",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   //console.log(1,res.locals.currentUser)
   next();
});


  //            //
 // ALL MODELS //
//            //   

var playlistSchema = new mongoose.Schema({
   name:   String,
   artist: String,
   audio:  String,
   image:  String,	
});

var Playlist = mongoose.model("Playlist", playlistSchema);

var playlistSCSchema = new mongoose.Schema({
   name:   String,
   author: String,	
   playlist: [playlistSchema]
});

var PlaylistSC = mongoose.model("PlaylistSC", playlistSCSchema);

var songSchema = new mongoose.Schema({
   name:   String,
   artist: String,
   audio:  String,
   image:  String,	
});

var Song = mongoose.model("Song", songSchema);

// const getdata = ()=>{
// 	console.log(32)
// 	var settings = {
// 		"async": true,
// 		"crossDomain": true,
// 		"url": "https://deezerdevs-deezer.p.rapidapi.com/search?q=eminem",
// 		"method": "GET",
// 		"headers": {
// 			"x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
// 			"x-rapidapi-key": "69fccf299amshb6e2f8cee3e4649p1e45f5jsn8ba7016e3003"
// 		}
// 	}
	
// 	$.ajax(settings).done(function (response) {
// 		console.log(response);
// 	});
// }
app.get("/", async function(req, res){
	console.log("back1")
	// await getdata()
	res.redirect("/back");

});

// app.post("/list",function(req,res){
// 	song=req.body.Search;
// 	//song="light it up";
// 	console.log(2,req.body)
// 	console.log(3,req.body.Search);
// 	// console.log(song);
// 			reqd.query({
// 			"q": "" +song+ ""
// 		});

// 		reqd.headers({
// 			"x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
// 			"x-rapidapi-key": "45eff3d17amsha881e5fec2254d6p1b4718jsn949ef4e06f56"
// 		});
		
// 	    reqd.end(function (resd) {
// 			 if (resd.error) 
// 			 {throw new Error(resd.error);}
// 				result= resd.body;
// 				//console.log(result["data"][0]);
// 				console.log(3,result)
// 				const data = result["data"]
				
// 				data.forEach(function(song){
					
// 					Song.create({
// 						   name:   song["title"],
// 						   artist: song["artist"]["name"],
// 					       audio:  song["preview"],
// 						   image:  song["album"]["cover_medium"]
// 						}, function(err, asong){
// 							if(err){
// 								console.log(err);
// 							} else {
								
// 								//console.log(asong);
// 							}
// 						});
					
// 				})
// 			});
// 	            res.redirect("/list_view");
// });

app.post("/list",function(req,res){
	song=req.body.Search;
	//song="light it up";
	console.log(2,req.body);
	console.log(3,song)
	// console.log(song);
			
	const urlopen = "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + song
	var settings = {
		"async": true,
		"crossDomain": true,
		"url": urlopen,
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
			"x-rapidapi-key": "69fccf299amshb6e2f8cee3e4649p1e45f5jsn8ba7016e3003"
		}
	}
	
	$.ajax(settings).done(function (response) {
		console.log(response);
		data= response.data;
				//console.log(result["data"][0]);
				
				data.forEach(function(song){
					
					Song.create({
						   name:   song["title"],
						   artist: song["artist"]["name"],
					       audio:  song["preview"],
						   image:  song["album"]["cover_medium"]
						}, function(err, asong){
							if(err){
								console.log(err);
							}
						});
					
				})
	});
	res.redirect("/list-view")
});

	
app.get("/list_view",function(req,res){
	
	Song.find({}, function(err, songs){
			if(err){
				console.log("ERROR!");
				console.log(err);
			} else {
				res.render("list",{Song: songs});
			}
		});
	
});

app.get("/addplaylist/:search/:id",isLoggedIn,function(req,res){
		var idp=req.params.id;
		var search= req.params.search
		//console.log(req.user.username);
		//console.log(5,req.user)
	     PlaylistSC.find({}, function(err, songs){
			if(err){
				console.log("ERROR!");
				console.log(err);
			} else {
			//	console.log(typeof songs)
			//	console.log(songs);
				res.render("playlist_sc",{playlists: songs,idp:idp,user:req.user.username,search: search});
			}
		});
	});


app.get("/newplaylist/:id",function(req,res){
	var idp= req.params.id;

	var name= req.query.plyname;
	console.log(name);
//	res.redirect("");
	PlaylistSC.create({
	   name:   name,
	   author: req.user.username,	
	}, function(err, asong){
		if(err){
			console.log(err);
		} else {
			console.log(req.user.username);
		}
	});
	
	res.redirect("/addplaylist/"+idp);
	
});

	
app.get("/showplay/:search/:ida/:idb", (req,res)=>{

		console.log(req.params.ida);
	    console.log(req.params.idb);
	    var plyid=req.params.idb;
	    var song = req.params.search
		
		PlaylistSC.findById(req.params.idb,function(err,foundPly){
			if(err){
				console.log(err);
			}
			else{
			   //    console.log(foundPly);
				//    Song.findById(req.params.ida,function(err,foundSong){
				// 	  if(err){
				// 		console.log(err);
				// 	   }
				// 	  else{
				// 		  console.log(foundSong);
				// 		  var currply=foundPly;
				// 		  currply.playlist.push({
				// 			 name:   foundSong["name"],
				// 			 artist: foundSong["artist"],
				// 			 audio:  foundSong["audio"],
				// 			 image:  foundSong["image"] 

				// 		});
				// 		  currply.save();
				// 	  }
			
		        //   });
			const urlopen = "https://deezerdevs-deezer.p.rapidapi.com/search?q=" + song
			
			var settings = {
		"async": true,
		"crossDomain": true,
		"url": urlopen,
		"method": "GET",
		"headers": {
			"x-rapidapi-host": "deezerdevs-deezer.p.rapidapi.com",
			"x-rapidapi-key": "69fccf299amshb6e2f8cee3e4649p1e45f5jsn8ba7016e3003"
		}
	}
	
	     $.ajax(settings).done(function (response) {
		data= response.data;
                console.log("data")
				for(var i=0;i<data.length;i++){
					console.log(1,data[i].id)
					console.log(2,req.params.ida)
					if(data[i].id == req.params.ida){
					     console.log("found")
						  var currply=foundPly;
						  currply.playlist.push({
							 name:   data[i].title,
							 artist: data[i].artist.name,
							 audio:  data[i].preview,
							 image:  data[i].album.cover_medium 

						});
						  currply.save().then(()=>{
							res.redirect("/playlist/"+plyid);
						  });
						  break;
						}
					}
				})
		}
		console.log(foundPly)
	});
			
			
	
		
		
});
	 

app.get("/playlist",isLoggedIn,function(req,res){
		PlaylistSC.find({}, function(err, playlists){
		if(err){
			console.log("ERROR!");
			console.log(err);
		} else {
		//	console.log(typeof songs)
			console.log(playlists);
			res.render("playlist_view",{playlists: playlists,user:req.user.username});
		}
	});
	
});

app.get("/playlist/:id",function(req,res){
	var id= req.params.id;
	PlaylistSC.findById( id, function(err, songs){
		if(err){
			console.log("ERROR!");
			console.log(err);
		} else {
		//	console.log(songs.playlist[0])
			if(songs.playlist[0]){
				console.log("yes");
			res.render("song_view",{Playlist: songs,play:songs.playlist[0]["audio"],user:req.user.username});
			}
			else{
				console.log("no");
				res.render("song_view",{Playlist: songs,play:null,user:req.user.username });
			}
		}
	});
	
});

app.get("/playsong/:ida/:idb",function(req,res){
	//console.log(req.params.idx)
	var ida= req.params.ida;
	var idb= req.params.idb;
		PlaylistSC.findById(req.params.ida,function(err,foundPly){
		if(err){
			console.log(err);
		}
		else{
		      console.log(foundPly);
					foundPly.playlist.forEach(function(foundSong){
					if(foundSong._id==idb){
					  console.log(foundSong);
					  return res.render("song_view",{Playlist: foundPly,play:foundSong["audio"]});
					}

			 });
		}
	});
});


	
// app.get("/playlistCV",function(req,res){
		
// 	Playlist.find({}, function(err, songs){
// 		if(err){
// 			console.log("ERROR!");
// 			console.log(err);
// 		} else {
// 			res.render("playlist",{Song: songs});
// 		}
// 		});
	
// });

app.delete("/playlist/:id",function(req,res){
	PlaylistSC.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
		}
		else{
			res.redirect("/playlist");
		}
	});
});

// app.delete("/playlist/:ida/:idb",function(req,res){
// 	console.log("------------------------");
// 	console.log(req.params.ida,req.params.idb);
// 	PlaylistSC.findById(req.params.ida,function(err,found){
// 	if(err){
// 			console.log(err);
// 		}
// 		else{
// 			console.log(found["playlist"]);
// 			var foundlist=found["playlist"];
// 			foundlist.findById(req.params.idb,function(err,found2){
// 				console.log(found2);
				
// 			})
// 		}
// 	});
// 	res.redirect("/playlist/"+req.params.ida);
	
// });

app.get("/back",(req,res)=>{
	res.render("landing");
})

app.post("/back",function(req,res){
	Song.deleteMany({}, function (err) {
	  if (err) return handleError(err);
	});
	res.redirect("/back");
});

app.post("/delete/:id",function(req,res){
	Playlist.deleteOne({id:req.params.id}, function(err){
	  if (err) console.log(err);
		
	});
	res.redirect("/playlist");
});



app.get("/register", function(req, res){
   res.render("signup",{errors:undefined}); 
});
//handle sign up logic
app.post("/register", function(req, res){


	const{password,confirmPassword}=req.body
    var errors =[]

	if(validator.isAlphanumeric(password))
	{
		errors.push("Password should contain at least one special character")
	}

	if(password.length<=8)
	{
		errors.push("Password should contain at least 8 characters")
	}

// 	console.log(4,req.body)
// 	const{password,confirmPassword}=req.body

	if(password===confirmPassword)
	{
		
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            
            //return res.render("signup");
			errors.push("Username already taken");
        }
         passport.authenticate("local")(req, res, function(){
		//	 res.send("successfully registered");
		console.log(errors)
		res.render('signup',{errors:errors}) 
        });
	});
}else{
	errors.push("Password confirmation does not match password")
	console.log(errors)
	res.render('signup',{errors:errors}) 
}

		
});

// show login form
app.get("/login",registerLOG, function(req, res){
   res.render("login"); 
});
// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/list_view",
        failureRedirect: "/login",
	    failureFlash: 'Invalid username or password.'
    }), function(req, res){
});

// logic route
app.get("/logout", function(req, res){
   req.logout();
   res.redirect("/login");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function registerLOG(req,res,next){
	if(req.isAuthenticated()){
		res.redirect("/")
		console.log("yes");
    }
	else{
		console.log("no");
		return next();	
		}
}

app.listen(port,function(){
	console.log("The app is active on ",port);
});
