<template>
  <div class="wk workout">
    <div class="wh wk-head">
      <h1>健身菜單</h1>
      <div>
        <label for="muscle">肌群</label>
        <input type="text" class="js-wh-ipMuscle-c" id="js-wh-ipMuscle" 
            name="muscle" v-model="ipMuscle">
        <button @click="whAddMuscle">新增</button>
      </div>
      <div class="wh-sub">
        <select id="js-wh-slecMuscle">
          <option v-for="muscle in dbMuscles" :value="muscle">
            {{ muscle }}
          </option>
        </select>
        <input type="text" id="js-wh-ipSubMuscle" v-model="ipSubMuscle">
        <button @click="whAddSubMuscle">新增</button>
      </div>
    </div>    
    <div class="wm wk-main">  
      <ul>
        <li v-for="muscle in dbMuscles">
          <div @mouseenter="wmHovered(1)"
          @mouseleave="wmHovered(0)">
            <span>{{ muscle }}</span>
          </div>
          <ul>
            <li v-for="allMuscles in dbAllMuscles[muscle]">
              <div @mouseenter="wmHovered(1, muscle)"
                @mouseleave="wmHovered(0, muscle)">
                <input type="checkbox" :value="`${muscle} - ${allMuscles}`"
                v-model="subMuscles">
                <span>{{ allMuscles }}</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>  
    </div> 
    <div class="wv mk-view">
      <div>{{ today }}</div>
      <ul>
        <li v-for="subMuscle in subMuscles">
          <span class="muscle">{{ subMuscle }}</span>
          <input name="muscleSet" type="text"> <span class="unit">kg/lbs</span>
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
      currentHover: '',
      ipMuscle: '',
      ipSubMuscle: '',
      dbMuscles: '',
      dbAllMuscles: {},
      subMuscles: [],
      mainMuscles: [],
      allMuscles: {},
      today: ''
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
      var wh_slecMuscle = document.getElementById('js-wh-slecMuscle').value;
      if(!this.ipSubMuscle) return console.log('no value');
      
      if(!this.dbAllMuscles[wh_slecMuscle]) {
        this.dbAllMuscles[wh_slecMuscle] = [this.ipSubMuscle];        
      } else {
        this.dbAllMuscles[wh_slecMuscle].push(this.ipSubMuscle);
      }
      
      db.ref(`/muscles/${wh_slecMuscle}`).set(
        this.dbAllMuscles[wh_slecMuscle]
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
      this.dbMuscles.splice(index, 1);
      //db.ref('/muscle').set(this.dbMuscles);
    },    
    wmHovered(bool, pos) {
      if(!pos) return;
      var el = document.getElementById('js-wm-del');
      if(el) {
        el.remove();
        if(!bool) return; 
      }
      var element = event.target;
      var span = document.createElement('span');      
      span.id = "js-wm-del";
      span.innerHTML = 'X';       
      element.appendChild(span);
      
      var del = document.getElementById('js-wm-del');
      del.addEventListener('click', (e) => {
        var v = e.target.previousSibling.innerHTML;     
        if(pos) {
          this.wmDel(this.dbAllMuscles[pos].indexOf(v), pos);
        }        
        console.log('wmHovered closed');       
        //this.wmDel( this.dbMuscles.indexOf(v) );    
      });
    },
    wmPairMuscle(muscle) {
      this.mainMuscles.push(muscle);
    },
    wmAddTraining() {
      var muscleSet = [...document.getElementsByName('muscleSet')];
      var muscleSetArray = muscleSet.map(x => x.value);
      var obj = {};

      for (let i = 0; i < this.subMuscles.length; i++) {
        obj[this.subMuscles[i]] = muscleSetArray.slice(i * 4, 4 * (i + 1)).join('-');        
      }

      db.ref(`/training/${this.today}`).set(obj);
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
    var wh_ipMuscle = document.getElementById('js-wh-ipMuscle');
    wh_ipMuscle.addEventListener('keyup', (e) => {
      e.preventDefault();
      if (e.keyCode === 13) this.whAddMuscle();
    }); 
    var wh_ipSubMuscle = document.getElementById('js-wh-ipSubMuscle');
    wh_ipSubMuscle.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) this.whAddSubMuscle();
    });    
  },
  beforeUpdated() {
    
  },
  updated() {
    if(this.subMuscles.length)
      this.today = moment().format().slice(0, 10);
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
@import url(//fonts.googleapis.com/earlyaccess/notosanstc.css);
@import '@/assets/css/workout.scss';
</style>

