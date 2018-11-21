<template>
  <div class="train">
    <ul>
      <li v-for="(dbTraining, key) in dbTrainings">
        <div>
          <h1> {{ key }} </h1>
          <ul>
            <li v-for="(value, subKey) in dbTraining">
              <div>
                <span> {{ subKey }} </span>
                <span>{{ value.weight }}</span>
                <span>{{ value.times }}</span>
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
import { db_trainings } from '@/db.js'
export default {
  name: 'Train',
  data() {
    return {
      dbTrainings: ''
    }
  },
  mounted() {
    db_trainings.on('value', v => {
      var dbTrainings = this.dbTrainings = v.val();
    });
  }
}
</script>
<style lang="scss">
@import '@/assets/css/train.scss';
</style>

