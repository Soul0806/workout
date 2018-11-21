<template>
  <div class="wk workout">
    <div class="header">
      <h1>健身菜單</h1>
      <div class="main">
        <label for="muscle">肌群</label>
        <input type="text" name="muscle"
            @keyup.enter="whAddMuscle" v-model="ipMuscle">
        <button @click="whAddMuscle">新增</button>
      </div>
      <div class="sub">
        <select v-model="seleSubMuscle">
          <option v-for="muscle in dbMuscles" :value="muscle">
            {{ muscle }}
          </option>
        </select>
        <input type="text" @keyup.enter="whAddSubMuscle" v-model="ipSubMuscle">
        <button @click="whAddSubMuscle">新增</button>
      </div>
    </div>    
    <div class="main">  
      <ul>
        <li v-for="muscle in dbMuscles">
          <div @mouseenter="wmHovered(1)"
          @mouseleave="wmHovered(0)">
            <span>{{ muscle }}</span>
          </div>
          <ul>
            <li v-for="allMuscles in dbAllMuscles[muscle]">
              <div class="sub"
                @mouseenter="wmHovered(0, muscle)"
                @mouseleave="wmHovered(1, muscle)">
                <input type="checkbox" :value="`${muscle} - ${allMuscles}`"
                v-model="subMuscles">
                <span>{{ allMuscles }}</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>  
    </div> 
    <div class="view">
      <div>日期：<input type="text" v-model="date"></div>
      <ul>
        <li v-for="subMuscle,key in subMuscles">
          <span class="muscle">{{ subMuscle }}</span>
          <input name="muscleSet" type="text">
          <input type="radio" :name="`unit-${key}`" value="kg" checked>kg
          <input type="radio" :name="`unit-${key}`" value="lbs">lbs
          <!--  <span class="unit">kg/lbs</span> -->
          <input name="muscleSet" type="number" value="10">
          <input name="muscleSet" type="number" value="10">
          <input name="muscleSet" type="number" value="10">
        </li>
      </ul>
      <button v-if="subMuscles.length" @click="wmAddTraining">確定</button>
    </div>  
  </div>
</template>

<script>
import { db, db_muscle, db_muscles } from '@/db.js';
import draggable from 'vuedraggable'
var moment = require('moment');
export default {
  components: {
    draggable,
  },
  name: 'Workout',
  data () {
    return {
      seleSubMuscle: '胸',
      currentHover: '',
      ipMuscle: '',
      ipSubMuscle: '',
      dbMuscles: '',
      dbAllMuscles: {},
      subMuscles: [],
      mainMuscles: [],
      allMuscles: {},
      date: ''
    }
  },
  methods: {
    whAddMuscle() {
      if (!this.ipMuscle) return console.log('no value');
      if (this.dbMuscles.includes(this.ipMuscle)) return console.log('Exists');

      this.dbMuscles.push(this.ipMuscle);
      db.ref('/muscle').set(this.dbMuscles);
      this.ipMuscle = '';
    },
    whAddSubMuscle() {
      if(!this.ipSubMuscle) return console.log('no value');
      var seleSubMuscle = this.seleSubMuscle;
      
      this.dbAllMuscles[seleSubMuscle] 
        ? this.dbAllMuscles[seleSubMuscle].push(this.ipSubMuscle) 
        : this.dbAllMuscles[seleSubMuscle] = [this.ipSubMuscle]   
      
      db.ref(`/muscles/${seleSubMuscle}`).set(
        this.dbAllMuscles[seleSubMuscle]
      );
      this.ipSubMuscle = '';
    },
    wmDel(index, pos) {
      var check = confirm('Are you sure to delete ?');
      if(!check) return;
      if(pos) {
        this.dbAllMuscles[pos].splice(index, 1);      
        db.ref(`/muscles/${pos}`).set(this.dbAllMuscles[pos]);
        return; 
      }
      //this.dbMuscles.splice(index, 1);
      //db.ref('/muscle').set(this.dbMuscles);
    },    
    wmHovered(bool, pos) {
      if(!pos) return;
      if(bool) {
        var el = document.getElementById('js-wm-del');
        el.remove();
        return;        
      }

      var element = event.target;
      var span = document.createElement('span');      
      span.id = "js-wm-del";
      span.innerHTML = 'X';       
      span.addEventListener('click', (e) => {
        var v = e.target.previousSibling.innerHTML;     
        if(pos) {
          this.wmDel(this.dbAllMuscles[pos].indexOf(v), pos);
        }        
        //this.wmDel( this.dbMuscles.indexOf(v) );    
      });
      element.appendChild(span);
    },
    wmPairMuscle(muscle) {
      this.mainMuscles.push(muscle);
    },
    wmAddTraining() {
      var muscleSet = [...document.getElementsByName('muscleSet')];
      var muscleSetArray = muscleSet.map(x => x.value);
      var obj = {};
      for (let i = 0; i < this.subMuscles.length; i++) {
        let els = document.getElementsByName(`unit-${i}`);
        let unit = (els[0].checked ? els[0].value : els[1].value);
        var muscleSetSlice = muscleSetArray.slice(i * 4, 4 * (i + 1));
        var muscleSetOne = muscleSetSlice.shift();
        obj[this.subMuscles[i]] = {
          weight: `${muscleSetOne}${unit}`,
          times: muscleSetSlice.join('-')
        }      
      }
      
      db.ref(`/training/${this.date}`).set(obj);
    },
    getSiblings(elem) {
      var siblings = [];
      var sibling = elem.parentNode.firstChild;
      var skipMe = elem;
      for (; sibling; sibling = sibling.nextSibling)
        if (sibling.nodeType == 1 && sibling != elem)
          siblings.push(sibling);
      return siblings;
    }
  },
  mounted() {
    db_muscle.once('value', e => {
      this.dbMuscles = (!e.val() ? [] : e.val());
    });
    db_muscles.on('value', e => {      
      if( e.val() ) this.dbAllMuscles = e.val()     
      //this.dbAllMuscles = (!e.val() ? {} : e.val());
    })
    /* var wh_ipMuscle = document.getElementById('js-wh-ipMuscle');
    wh_ipMuscle.addEventListener('keyup', (e) => {
      e.preventDefault();
      if (e.keyCode === 13) this.whAddMuscle();
    });  */
    /* var wh_ipSubMuscle = document.getElementById('js-wh-ipSubMuscle');
    wh_ipSubMuscle.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) this.whAddSubMuscle();
    });  */   
  },
  beforeUpdated() {
  },
  updated() {
    //if(this.subMuscles.length)
      //this.today = moment().format().slice(0, 10);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import url(//fonts.googleapis.com/earlyaccess/notosanstc.css);
@import '@/assets/css/workout.scss';
</style>

