<template>
  <a-form :form="form" ref="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
    <a-form-item label="Key" style="margin-bottom: 10px">
      <a-select placeholder="please select Key" @change="handleChange" v-decorator="['key', validatorRules.string ]">
        <a-select-option value="zone">
          zone
        </a-select-option>
        <a-select-option value="disk">
          disk
        </a-select-option>
        <a-select-option value="engine">
          engine
        </a-select-option>
      </a-select>
      <!-- <a-input placeholder="Key" /> -->
    </a-form-item>
    <a-form-item label="Op" style="margin-bottom: 10px">
      <a-select placeholder="please select Op" v-decorator="['op', validatorRules.string ]">
        <a-select-option value="in">
          in
        </a-select-option>
        <a-select-option value="notIn">
          notIn
        </a-select-option>
        <a-select-option value="exists">
          exists
        </a-select-option>
        <a-select-option value="notExists">
          notExists
        </a-select-option>
      </a-select>
      <!-- <a-input placeholder="Op" v-decorator="['op', validatorRules.string ]"/> -->
    </a-form-item>
    <a-form-item label="Value" style="margin-bottom: 0">
      <a-select placeholder="please select Value" mode="multiple" v-decorator="['values', validatorRules.string ]">
        <a-select-option :value="item" v-for="item in options" :key="item">
          {{ item }}
        </a-select-option>
      </a-select>
      <!-- <a-input placeholder="Value" v-decorator="['value', validatorRules.string ]"/> -->
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 12, offset: 5 }" style="margin-bottom: 10px">
      <a-button type="danger" size="small" @click="$emit('delete', txt)">Delete</a-button>
    </a-form-item>
  </a-form>
</template>

<script>
export default {
  name:"subFormTable",
  props: ["txt", "formData"],
  data(){
    return {
      form: this.$form.createForm(this),
      options: [],
      diskOptions: ['hdd', 'ssd'],
      zoneOptions: ['zone-1', 'zone-2', 'zone-3'],
      engineOptions: ['tikv', 'tiflash'],
      validatorRules:{
        string: [
          { required: true, whitespace: true, message: 'Place input' },
        ]
      }
    }
  },
  mounted() {
    this.form.setFieldsValue({ key: this.formData.key, op: this.formData.op, values: this.formData.values})
  },
  methods:{
    onValid(){
      return new Promise((resolve,reject)=>{
        this.form.validateFields((err, values) => {
          if (!err) {
            resolve(values)
          } else {
            reject()
          }
        });
      })
    },
    handleChange(val) {
      if (val == 'zone') {
        this.options = this.zoneOptions
      } else if(val == 'disk') {
        this.options = this.diskOptions
      } else if(val == 'engine') {
        this.options = this.engineOptions
      }
    }
  }
}
</script>

<style>

</style>