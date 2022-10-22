<template>
  <a-modal
    title="Create Group"
    :visible="visible"
    :confirm-loading="confirmLoading"
    :maskClosable="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form-model :model="form" ref="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-model-item label="Group name">
        <a-input v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item label="schemas">
        <a-select v-model="form.region" placeholder="please select your schemas">
          <a-select-option value="schemas1">
            schemas1
          </a-select-option>
          <a-select-option value="schemas2">
            schemas2
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="color tag">
        <div class="colorTags">
          <ColorTag v-for="tag in Object.keys(tags)" :key="tag" :tag="tag" :current="form.tag" @filterTag="filterTag"></ColorTag>
          <!-- <span v-for="tag in Object.keys(tags)" :key="tag" class="colorTag">{{ tag }}</span> -->
        </div>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>
<script>
import ColorTag from "./ColorTag.vue";
import { mapGetters } from "vuex";
export default {
  components: {
    ColorTag
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
        tag: '',
      },
    }
  },
  computed: {
    ...mapGetters(["tags"]),
  },
  methods: {
    showModal() {
      this.visible = true
    },
    filterTag(data) {
      console.log(data, '我是什么')
      this.form.tag = data
    },
    handleCancel() {
      this.visible = false
      this.$refs.form.resetFields();
    },
    handleOk() {}
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
</style>