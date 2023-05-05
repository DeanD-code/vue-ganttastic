<template>
  <div class="modal-mask-row" v-show="show" transition="modal">
    <div class="modal-wrapper-row">
      <div class="modal-container-row">

        <div class="modal-header-row">
          {{ "Row Options" }}
        </div>

        <div class="modal-body-row">
          <div class="row-select">
            <div>Location ID: </div>
            <select v-model="inputLocationid">
              <option v-for="location in locations" :key="location.locationid" :value="location.locationid">
                {{ location.locationid }}
              </option>
            </select>
          </div>

          <div class="row-label">
            <div>Location Name: </div>
            <div>
              <input v-model="inputValue" type="text" :style="`width: 100%`">
            </div>
          </div>
        </div>
        <div class="modal-footer-row">
          <button @click="okcallback({
            inputValue,
            inputLocationid,
            label,
            locationid
          })">Save</button>
          <button @click="cancelcallback">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
export default {
  name: 'Modal',
  props: {
    show: {
      type: Boolean,
      required: true,
      // twoWay: true,
      default: false
    },
    showok: {
      type: Boolean,
      required: true,
      // twoWay: true,
      default: true
    },
    showcancel: {
      type: Boolean,
      required: true,
      // twoWay: true,
      default: true
    },
    header: {
      type: String,
      default: 'Tips'
    },
    body: {
      type: String,
      default: ''
    },
    oktext: {
      type: String,
      default: 'OK'
    },
    canceltext: {
      type: String,
      default: 'Cancel'
    },
    okcallback: {
      type: Function,
      default: function () {
        // this.show = false
      }
    },
    cancelcallback: {
      type: Function,
      default: function () {
        // this.show = false
      }
    },
    duration: {
      type: Number,
      default: 0
    },
    locationid: {
      type: String,
      required: true,
      default: -1
    },
    label: {
      type: String,
      required: true,
      default: 'what'
    },
    rowCount: {
      type: Number,
      default: 1
    }
  },
  setup() {
    return {
      inputValue: '',
      inputLocationid: '-1',
    }
  },
  beforeUpdate() {
    // console.log('before updated')
    this.inputValue = this.label
    this.inputLocationid = this.locationid
  },
  computed: {
    locations: {
      get() {
        let arr = [];
        for (let i = 1; i <= this.rowCount; i++) {
          arr.push({ locationid: i.toString() })
        }
        console.log('computed', arr)
        return arr;
      }
    }
  }
}
</script>
  
  
<style>
.modal-mask-row {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper-row {
  display: table-cell;
  vertical-align: middle;
}

.modal-container-row {
  width: 450px;
  margin: 0px auto;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
  max-width: 100%;
  box-sizing: border-box;
}

.modal-container-row:after {
  content: '';
  display: block;
  height: 0;
  width: 0;
  clear: both;
}

.modal-header-row {
  padding: 20px 20px 20px 20px;
  text-align: center;
  font-size: 16px;
  border-bottom: 1px solid sandybrown;
}

.modal-body-row {
  padding: 20px;
  text-align: center;
  font-size: 14px;
}

.modal-footer-row {
  border-top: 1px solid #cdc7c7;
  /* display: -webkit-box; */
  /* display: -moz-box; */
  /* display: box; */
  display: flex;
  justify-content: center;
  width: 100%;
}

.modal-footer-row button {
  -moz-box-flex: 1;
  box-flex: 1;
  -webkit-box-flex: 1;
  display: block;
  color: #999;
  text-align: center;
  padding: 15px 15px;
  text-decoration: none;
  border: none;
  width: 100%;
}

.modal-footer-row button:first-child {
  color: #ff8903;
  border-right: 1px solid #cdc7c7;
}

.border-none {
  border: none !important;
}

/*
   * the following styles are auto-applied to elements with
   * v-transition="modal" when their visiblity is toggled
   * by Vue.js.
   *
   * You can easily play with the modal transition by editing
   * these styles.
   */
.modal-enter,
.modal-leave {
  opacity: 0;
}

.modal-enter .modal-container-row,
.modal-leave .modal-container-row {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.row-select {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}
.row-select select {
  width: 50%;
}
.row-label {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-top: 1px solid sandybrown;
}
</style>