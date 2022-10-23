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
      <a-form-model-item label="Group name" prop="name">
        <a-input v-model="form.name" />
      </a-form-model-item>
      <a-form-model-item label="Rule name" prop="eventName">
        <a-input v-model="form.eventName" />
      </a-form-model-item>
      <a-form-model-item label="Override" prop="override">
        <a-switch v-model="form.override" />
      </a-form-model-item>
      <!-- <a-form-model-item label="schemas">
        <a-select v-model="form.region" placeholder="please select your schemas">
          <a-select-option value="schemas1">
            schemas1
          </a-select-option>
          <a-select-option value="schemas2">
            schemas2
          </a-select-option>
        </a-select>
      </a-form-model-item> -->
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
import { mapState, mapGetters } from "vuex";
import { OffsetRange } from "~/store";
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
        tag: 'primary',
      },
      mouseLeft: 0,
      startEventCreationRange: ''
    }
  },
  
  computed: {
    ...mapGetters(["tags","rangeFromOffsetLeft"]),
    ...mapState({
      eventsString: (state) => state.eventsString,
      groups: (state) => state.groups
    }),
    newEventPosition() {
      return this.rangeFromOffsetLeft(this.mouseLeft);
    },
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
    handleOk() {
      const groupInfo = {
        range: this.newEventPosition,
        ...this.form
      }
      const group = {
        "group_id": this.form.name,
        "group_index": this.groups.length + 1,
        "group_override": this.form.override,
        "rules": [
          {
            "group_id": this.form.name,
            "id": this.form.eventName,
            "index": 0,
            "override": false,
            "start_key": "",
            "end_key": "",
            "role": "",
            "count": 1
          }
        ]
      }
      let groups = JSON.parse(JSON.stringify(this.groups))
      groups.push(group)
      console.log(groups, 'groups')
      this.$store.commit("setGroups", groups)
      this.$store.dispatch("createNewGroup", groupInfo);
      this.handleCancel()
      // console.log(this.newEventPosition, 'newEventPosition')
      // 
      // let josn = `[{"eventString":"2022-01/2022-03: Sub task #John","ranges":{"date":{"fromDateTime":"2022-01-01T00:00:00.000+08:00","toDateTime":"0004-01-01T00:00:00.000+08:05","originalString":"01/2022-03","dateRangeInText":{"type":"dateRange","from":104,"to":115}},"event":{"from":104,"to":131,"type":"event"}},"event":{"tags":["John"],"locations":[],"eventDescription":"Sub task","supplemental":[]}},{"eventString":"2022-03/2022-06: Sub task 2 #Michelle","ranges":{"date":{"fromDateTime":"2022-03-01T00:00:00.000+08:00","toDateTime":"0007-01-01T00:00:00.000+08:05","originalString":"03/2022-06","dateRangeInText":{"type":"dateRange","from":136,"to":147}},"event":{"from":136,"to":268,"type":"event"}},"event":{"tags":["Michelle"],"locations":[],"eventDescription":"Sub task 2","supplemental":["More info about sub task 2","- [ ] We need to get this done","- [x] And this","- [ ] This one is extra"]}},{"eventString":"2022-07: Yearly planning","ranges":{"date":{"fromDateTime":"2022-01-01T00:00:00.000+08:00","toDateTime":"0008-01-01T00:00:00.000+08:05","originalString":"2022-07","dateRangeInText":{"type":"dateRange","from":268,"to":276}},"event":{"from":268,"to":294,"type":"event"}},"event":{"tags":[],"locations":[],"eventDescription":"Yearly planning","supplemental":[]}}]`
      // console.log(JSON.parse(josn), 'josnjosn')
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
</style>