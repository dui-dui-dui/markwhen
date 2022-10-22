<template>
  <a-modal
    title="Rule Config"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model :model="form" ref="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="Name">
        <a-input v-model="form.name" placeholder="Rule Name" />
      </a-form-model-item>
      <a-form-model-item label="Role">
        <a-select v-model="form.region" placeholder="please select role">
          <a-select-option value="leader">
            leader
          </a-select-option>
          <a-select-option value="follower">
            follower
          </a-select-option>
          <a-select-option value="voter">
            voter
          </a-select-option>
          <a-select-option value="learner">
            learner
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="Count">
        <a-input v-model="form.name" placeholder="Count" />
      </a-form-model-item>
      <a-form-model-item label="Override">
        <a-switch v-model="form.delivery" />
      </a-form-model-item>
      <a-form-model-item label="">
        <div class="subtitle">Label Constraints</div>
      </a-form-model-item>
      <div class="LabelConstraints">
        <a-form-model-item label="Key" style="margin-bottom: 10px">
          <a-input v-model="form.name" placeholder="Key" />
        </a-form-model-item>
        <a-form-model-item label="Op" style="margin-bottom: 10px">
          <a-input v-model="form.name" placeholder="Op" />
        </a-form-model-item>
        <a-form-model-item label="Value" style="margin: 0">
          <a-input v-model="form.name" placeholder="value" />
        </a-form-model-item>
      </div>
      <div class="AddField">
        <a-button class="button" type="dashed" style="width: 60%" @click="addDomain">
          <a-icon type="plus" /> Add field
        </a-button>
      </div>
    </a-form-model>
  </a-modal>
</template>
<script>
export default {
  components: {
  },
  data() {
    return {
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      form: {
        name: '',
        region: undefined,
        date1: undefined,
        delivery: false,
        type: [],
        resource: '',
        desc: '',
      },
    }
  },
  methods: {
    showModal() {
      console.log('我被调用了')
      this.visible = true
    },
    handleCancel() {
      this.visible = false
      this.$refs.form.resetFields();
    },
    handleOk() {},
    addDomain() {
      this.$message.info('Not yet open！')
    }
  }
}
</script>
<style scoped>
.colorTags {
  display: flex;
  padding-top: 10px;
  align-items: center;
}
.colorTag {
  background: pink;
  width: 24px;
  height: 24px;
  display: block;
}
.LabelConstraints {
  border: 1px dashed rgb(192, 191, 191);
  border-radius: 5px;
  padding: 10px 0;
  margin: 0 30px;
}
.AddField {
  margin-top: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.button {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>