import React, { Component } from 'react'
import * as d3 from "d3";

class Starfield extends Component {
   // see: https://medium.com/@Elijah_Meeks/interactive-applications-with-react-d3-f76f7b3ebc71
   constructor(props){
      super(props);
      this.myRef = React.createRef();
      this.state = {};
      this.state.animateStarfield = false;
      this.state.flying = false;
      this.state.maxHeight = 400;
      this.state.numStars = 1000;
      this.state.distance = -50000; // max project distance from viewer
      this.state.initZValMax = 500; // largest initial poroximity of generated stars
      this.state.alphaScale = d3.scaleLinear().domain([0, this.state.initZValMax]).range([.1, 1]);
      this.state.starList = ["acamar", "achernar", "achird", "acrux", "acubens", "adara", "adhafera", "adhil", "agena", "ain al rami", "ain", "al anz", "al kalb al rai", "al minliar al asad", "al minliar al shuja", "aladfar", "alathfar", "albaldah", "albali", "albireo", "alchiba", "alcor", "alcyone", "aldebaran", "alderamin", "aldhibah", "alfecca meridiana", "alfirk", "algenib", "algieba", "algol", "algorab", "alhena", "alioth", "alkaid", "alkalurops", "alkes", "alkurhah", "almaak", "alnair", "alnath", "alnilam", "alnitak", "alniyat", "alniyat", "alphard", "alphekka", "alpheratz", "alrai", "alrisha", "alsafi", "alsciaukat", "alshain", "alshat", "alsuhail", "altair", "altarf", "alterf", "aludra", "alula australis", "alula borealis", "alya", "alzirr", "ancha", "angetenar", "ankaa", "anser", "antares", "arcturus", "arkab posterior", "arkab prior", "arneb", "arrakis", "ascella", "asellus australis", "asellus borealis", "asellus primus", "asellus secondus", "asellus tertius", "asterope", "atik", "atlas", "auva", "avior", "azelfafage", "azha", "azmidiske", "baham", "baten kaitos", "becrux", "beid", "bellatrix", "betelgeuse", "botein", "brachium", "canopus", "capella", "caph", "castor", "cebalrai", "celaeno", "chara", "chort", "cor caroli", "cursa", "dabih", "deneb algedi", "deneb dulfim", "deneb el okab", "deneb el okab", "deneb kaitos shemali", "deneb", "denebola", "dheneb", "diadem", "diphda", "double double (7051)", "double double (7052)", "double double (7053)", "double double (7054)", "dschubba", "dsiban", "dubhe", "ed asich", "electra", "elnath", "enif", "etamin", "fomalhaut", "fornacis", "fum al samakah", "furud", "gacrux", "gianfar", "gienah cygni", "gienah ghurab", "gomeisa", "gorgonea quarta", "gorgonea secunda", "gorgonea tertia", "graffias", "grafias", "grumium", "hadar", "haedi", "hamal", "hassaleh", "head of hydrus", "herschel's 'garnet star'", "heze", "hoedus ii", "homam", "hyadum i", "hyadum ii", "izar", "jabbah", "kaffaljidhma", "kajam", "kaus australis", "kaus borealis", "kaus meridionalis", "keid", "kitalpha", "kocab", "kornephoros", "kraz", "kuma", "lesath", "maasym", "maia", "marfak", "marfak", "marfic", "marfik", "markab", "matar", "mebsuta", "megrez", "meissa", "mekbuda", "menkalinan", "menkar", "menkar", "menkent", "menkib", "merak", "merga", "merope", "mesarthim", "metallah", "miaplacidus", "minkar", "mintaka", "mira", "mirach", "miram", "mirphak", "mizar", "mufrid", "muliphen", "murzim", "muscida", "muscida", "muscida", "nair al saif", "naos", "nash", "nashira", "nekkar", "nihal", "nodus secundus", "nunki", "nusakan", "peacock", "phad", "phaet", "pherkad minor", "pherkad", "pleione", "polaris australis", "polaris", "pollux", "porrima", "praecipua", "prima giedi", "procyon", "propus", "propus", "propus", "rana", "ras elased australis", "ras elased borealis", "rasalgethi", "rasalhague", "rastaban", "regulus", "rigel kentaurus", "rigel", "rijl al awwa", "rotanev", "ruchba", "ruchbah", "rukbat", "sabik", "sadalachbia", "sadalmelik", "sadalsuud", "sadr", "saiph", "salm", "sargas", "sarin", "sceptrum", "scheat", "secunda giedi", "segin", "seginus", "sham", "sharatan", "shaula", "shedir", "sheliak", "sirius", "situla", "skat", "spica", "sterope ii", "sualocin", "subra", "suhail al muhlif", "sulafat", "syrma", "tabit (1543)", "tabit (1544)", "tabit (1552)", "tabit (1570)", "talitha", "tania australis", "tania borealis", "tarazed", "taygeta", "tegmen", "tejat posterior", "terebellum", "terebellum", "terebellum", "terebellum", "thabit", "theemim", "thuban", "torcularis septentrionalis", "turais", "tyl", "unukalhai", "vega", "vindemiatrix", "wasat", "wezen", "wezn", "yed posterior", "yed prior", "yildun", "zaniah", "zaurak", "zavijah", "zibal", "zosma", "zuben elakrab", "zuben elakribi", "zuben elgenubi", "zuben elschemali"]
      this.state.rMax = 2 // maximum star radius
      this.state.zIncrement = 1; 
      this.state.labelPct = .005 // % of stars that are labeled
      this.state.strokeColorRGB = "94, 255, 137"; // TODO move this to global style component
      this.state.stars = [];
      this.state.rotate = 0;
   }

   componentDidMount() {
    const component = this;
    
    component.setState(() => {
            // initialize the starfield. returns animateStarfield = true;
            return {animateStarfield: component.initStarfieldCanvas()};
          },
          // callback1
          function() {
            return component.setState(
              {
                animateStarfield: false,
                flying: true
              },
            // callback2
            function() {
              if (component.animateStarfield) {
                  return component.animateStarfield();  
              }
            })
          });
      }


   componentDidUpdate() {

      
   }

   initStarfieldCanvas() {
      const height = this.myRef.current.parentNode.clientHeight;

      this.setState(
        {
          width: this.myRef.current.parentNode.clientWidth,
          height: height < this.state.maxHeight ? height : this.state.maxHeight
        },
        function() {
          return this.initStarfield();
      });
   }

   initStarfield() {
      let component = this;
      const width = component.state.width;
      const height = component.state.height;
      const numStars = component.state.numStars;
      
      const canvas = d3.select(component.myRef.current)
        .attr("width", width)
        .attr("height", height);
   
      component.setState(
        function(){
          return {
            stars: component.starArray(numStars)
          }
        },
        function() { 
            return true;
        });
  
   }
   
   animateStarfield() {
      let stars = this.state.stars;
      const component = this;
      const canvas = d3.select(component.myRef.current);
      const context = canvas.node().getContext("2d");
      const width = component.state.width;
      const height = component.state.height;
      const strokeColorRGB = component.state.strokeColorRGB;
      
      // context.translate(0,0);
      // context.clearRect(0, 0, width, height);

      // if (Math.random() > .9) {
      //   this.setState({rotate: this.state.rotate + 0.001}, function(){
      //             // translate context to center of canvas
      //   context.translate(width / 2, height / 2);
      //   // rotate 45 degrees clockwise
      //   context.rotate(this.state.rotate);
      //   context.translate(width / -2, height / -2);
      //   });

      // }

      context.clearRect(0, 0, width, height);

      stars = component.adjustStars(stars, width, height);

      for (var i = 0; i < stars.length; i++) {
        
        let offset = component.applyOffset(stars[i], width/2, height/2); 
        
        if (stars[i].r > 1) {
            // coordinates are stored as if on a plane w/ center origin (0,0)
            // we adjust them here for a plane whose origin is top left with (minWidth, minHeight)
            
            context.fillStyle = "rgba(" + strokeColorRGB + ", " + stars[i].a + ")";
            context.beginPath();
            context.arc(offset.x, offset.y, stars[i].r, 0, 2 * Math.PI);
            context.fill();
        } else {
            // save some cpu and traw tiny rects instead of tiny circles
            context.fillStyle = "rgba(" + strokeColorRGB + ", " + stars[i].a + ")";
            context.fillRect(offset.x, offset.y ,1 ,1);    
        }

        if (stars[i].label !== undefined) { component.drawLabel(context, offset.x, offset.y, stars[i].label)};

      }
      
      if (!component.state.flying) {

         return component.setState({doRotate: false});

      } else {

        setTimeout( function() {
              return component.animateStarfield();
        }, 32);

      }

   }

   starArray(numStars, starList) {
      let stars = new Array(numStars);
      for (let i = 0; i < numStars; i++) {
        stars[i] = this.randomPoint();
        stars[i].z = Math.random() * this.state.initZValMax; // we set a large random swath of z vals on the init (otherwise it would take a while for stars to come into view)
        stars[i].i = i;
      }
      return stars;  
   }

   adjustStars(stars, width, height) {
      const component = this;

      return stars.map(function(star, i) {

         let newStar;

         if (Math.abs(star.x) > width/2  || Math.abs(star.y) > height/2) {
            //  remove stars that have moved offscreen and replace with a new random one
            newStar = component.randomPoint();
            star.r = newStar.r;
            star.z = newStar.z;
            star.label = newStar.label;
            star.id = i;

         } else {
            newStar = component.reProject(star);
            star.z += component.state.zIncrement;
         }
            
         star.x = newStar.x;
         star.y = newStar.y;
         star.a = component.state.alphaScale(star.z);
            
         return star;    
      });
   }

   randomPoint() {
       const xMult = this.plusOrMinus();
       const yMult = this.plusOrMinus();
       const x = Math.floor(Math.random() * (this.state.width/2)) * xMult;
       const y = Math.floor(Math.random() * (this.state.height/2)) * yMult;
       const r = Math.random() * this.state.rMax;
       const z = 0;
       const label = Math.random() < this.state.labelPct ? this.state.starList[Math.floor(Math.random() * this.state.starList.length)] : undefined;
       return {"x" : x, "y" : y, "r" : r, "label" : label, "z" : z };
   }

   applyOffset(star, xOffset, yOffset) {
      return { "x" : star.x + xOffset, "y" : yOffset - star.y };
   }

   drawLabel(context, x, y, label) {
       const edge = 8;
       context.lineWidth = 1;
       context.strokeStyle = "#eb4034";
       context.fillStyle = "#eb4034";
       context.strokeRect(x - edge/2, y - edge/2 ,edge ,edge);    
       context.font = "18px Major Mono Display";
       context.fillText(label, x + edge, y);
   }
  
  reProject(star, rotate=false) {
    // see: https://math.stackexchange.com/questions/2337183/one-point-perspective-formula
    const x = star.x * (this.state.distance/(star.z + this.state.distance));
    const y = star.y * (this.state.distance/(star.z + this.state.distance))
    return {x: x, y: y};
  }

   plusOrMinus() {
   // return 1 or -1
      return Math.random() < 0.5 ? -1 : 1;
   }

   render() {
      
         return (
            <canvas ref={this.myRef}></canvas>
         );
      }

   // end component
   }

export default Starfield; 