<template>
  <a-form :form="form" ref="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
    <a-form-item label="Key" style="margin-bottom: 10px">
      <a-input placeholder="Key" v-decorator="['key', validatorRules.string ]"/>
    </a-form-item>
    <a-form-item label="Op" style="margin-bottom: 10px">
      <a-input placeholder="Op" v-decorator="['op', validatorRules.string ]"/>
    </a-form-item>
    <a-form-item label="Value" style="margin-bottom: 0">
      <a-input placeholder="Value" v-decorator="['value', validatorRules.string ]"/>
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
      validatorRules:{
        string: [
          { required: true, whitespace: true, message: 'Place input' },
        ]
      }
    }
  },
  mounted() {
    this.form.setFieldsValue(this.formData)
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
  }
}
</script>

<style>

</style>