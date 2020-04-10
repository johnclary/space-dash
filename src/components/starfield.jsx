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
      this.state.maxHeight = 500;
      this.state.numStars = 1000;
      this.state.distance = -50000; // max project distance from viewer
      this.state.initZValMax = 500; // largest initial poroximity of generated stars
      this.state.alphaScale = d3.scaleLinear().domain([0, this.state.initZValMax]).range([.1, 1]);
      this.state.starList = ["ACAMAR", "ACHERNAR", "Achird", "ACRUX", "Acubens", "ADARA", "Adhafera", "Adhil", "AGENA", "Ain al Rami", "Ain", "Al Anz", "Al Kalb al Rai", "Al Minliar al Asad", "Al Minliar al Shuja", "Aladfar", "Alathfar", "Albaldah", "Albali", "ALBIREO", "Alchiba", "ALCOR", "ALCYONE", "ALDEBARAN", "ALDERAMIN", "Aldhibah", "Alfecca Meridiana", "Alfirk", "ALGENIB", "ALGIEBA", "ALGOL", "Algorab", "ALHENA", "ALIOTH", "ALKAID", "Alkalurops", "Alkes", "Alkurhah", "ALMAAK", "ALNAIR", "ALNATH", "ALNILAM", "ALNITAK", "Alniyat", "Alniyat", "ALPHARD", "ALPHEKKA", "ALPHERATZ", "Alrai", "Alrisha", "Alsafi", "Alsciaukat", "ALSHAIN", "Alshat", "Alsuhail", "ALTAIR", "Altarf", "Alterf", "Aludra", "Alula Australis", "Alula Borealis", "Alya", "Alzirr", "Ancha", "Angetenar", "ANKAA", "Anser", "ANTARES", "ARCTURUS", "Arkab Posterior", "Arkab Prior", "ARNEB", "Arrakis", "Ascella", "Asellus Australis", "Asellus Borealis", "Asellus Primus", "Asellus Secondus", "Asellus Tertius", "Asterope", "Atik", "Atlas", "Auva", "Avior", "Azelfafage", "Azha", "Azmidiske", "Baham", "Baten Kaitos", "Becrux", "Beid", "BELLATRIX", "BETELGEUSE", "Botein", "Brachium", "CANOPUS", "CAPELLA", "Caph", "CASTOR", "Cebalrai", "Celaeno", "Chara", "Chort", "COR CAROLI", "Cursa", "Dabih", "Deneb Algedi", "Deneb Dulfim", "Deneb el Okab", "Deneb el Okab", "Deneb Kaitos Shemali", "DENEB", "DENEBOLA", "Dheneb", "Diadem", "DIPHDA", "Double Double (7051)", "Double Double (7052)", "Double Double (7053)", "Double Double (7054)", "Dschubba", "Dsiban", "DUBHE", "Ed Asich", "Electra", "ELNATH", "ENIF", "ETAMIN", "FOMALHAUT", "Fornacis", "Fum al Samakah", "Furud", "Gacrux", "Gianfar", "Gienah Cygni", "Gienah Ghurab", "Gomeisa", "Gorgonea Quarta", "Gorgonea Secunda", "Gorgonea Tertia", "Graffias", "Grafias", "Grumium", "HADAR", "Haedi", "HAMAL", "Hassaleh", "Head of Hydrus", "Herschel's 'Garnet Star'", "Heze", "Hoedus II", "Homam", "Hyadum I", "Hyadum II", "IZAR", "Jabbah", "Kaffaljidhma", "Kajam", "KAUS AUSTRALIS", "Kaus Borealis", "Kaus Meridionalis", "Keid", "Kitalpha", "KOCAB", "Kornephoros", "Kraz", "Kuma", "Lesath", "Maasym", "Maia", "Marfak", "Marfak", "Marfic", "Marfik", "MARKAB", "Matar", "Mebsuta", "MEGREZ", "Meissa", "Mekbuda", "Menkalinan", "MENKAR", "Menkar", "Menkent", "Menkib", "MERAK", "Merga", "Merope", "Mesarthim", "Metallah", "Miaplacidus", "Minkar", "MINTAKA", "MIRA", "MIRACH", "Miram", "MIRPHAK", "MIZAR", "Mufrid", "Muliphen", "Murzim", "Muscida", "Muscida", "Muscida", "Nair al Saif", "Naos", "Nash", "Nashira", "Nekkar", "NIHAL", "Nodus Secundus", "NUNKI", "Nusakan", "Peacock", "PHAD", "Phaet", "Pherkad Minor", "Pherkad", "Pleione", "Polaris Australis", "POLARIS", "POLLUX", "Porrima", "Praecipua", "Prima Giedi", "PROCYON", "Propus", "Propus", "Propus", "Rana", "Ras Elased Australis", "Ras Elased Borealis", "RASALGETHI", "RASALHAGUE", "Rastaban", "REGULUS", "Rigel Kentaurus", "RIGEL", "Rijl al Awwa", "Rotanev", "Ruchba", "Ruchbah", "Rukbat", "Sabik", "Sadalachbia", "SADALMELIK", "Sadalsuud", "Sadr", "SAIPH", "Salm", "Sargas", "Sarin", "Sceptrum", "SCHEAT", "Secunda Giedi", "Segin", "Seginus", "Sham", "Sharatan", "SHAULA", "SHEDIR", "Sheliak", "SIRIUS", "Situla", "Skat", "SPICA", "Sterope II", "Sualocin", "Subra", "Suhail al Muhlif", "Sulafat", "Syrma", "Tabit (1543)", "Tabit (1544)", "Tabit (1552)", "Tabit (1570)", "Talitha", "Tania Australis", "Tania Borealis", "TARAZED", "Taygeta", "Tegmen", "Tejat Posterior", "Terebellum", "Terebellum", "Terebellum", "Terebellum", "Thabit", "Theemim", "THUBAN", "Torcularis Septentrionalis", "Turais", "Tyl", "UNUKALHAI", "VEGA", "VINDEMIATRIX", "Wasat", "Wezen", "Wezn", "Yed Posterior", "Yed Prior", "Yildun", "Zaniah", "Zaurak", "Zavijah", "Zibal", "Zosma", "Zuben Elakrab", "Zuben Elakribi", "Zuben Elgenubi", "Zuben Elschemali"]
      this.state.rMax = 2 // maximum star radius
      this.state.zIncrement = 1; 
      this.state.labelPct = .005 // % of stars that are labeled
      this.state.strokeColorRGB = "94, 255, 137"; // TODO move this to global style component
      this.state.stars = [];
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

      stars = component.adjustStars(stars, width, height);

      context.clearRect(0, 0, width, height);

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
       context.font = "18px Jura";
       context.fillText(label, x + edge, y);
   }
  
  reProject(star) { //TODO use constant
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