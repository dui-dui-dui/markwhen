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
      <a-form-model-item label="Name" prop="id">
        <a-input v-model="form.id" readonly placeholder="Rule Name" />
      </a-form-model-item>
      <a-form-model-item label="Role" prop="role">
        <a-select v-model="form.role" placeholder="please select role">
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
      <a-form-model-item label="Count" prop="count">
        <a-input-number v-model="form.count" placeholder="Count" />
      </a-form-model-item>
      <a-form-model-item label="Override" prop="override">
        <a-switch v-model="form.override" />
      </a-form-model-item>
      <a-form-model-item label="">
        <div class="subtitle">Label Constraints</div>
      </a-form-model-item>
      <div class="LabelConstraints" v-if="subFormList.length > 0">
        <!-- <a-form-model-item label="Key" style="margin-bottom: 10px">
          <a-input v-model="form.name" placeholder="Key" />
        </a-form-model-item>
        <a-form-model-item label="Op" style="margin-bottom: 10px">
          <a-input v-model="form.name" placeholder="Op" />
        </a-form-model-item>
        <a-form-model-item label="Value" style="margin: 0">
          <a-input v-model="form.name" placeholder="value" />
        </a-form-model-item> -->
        <SubFormModal ref="subForm" v-for="txt in subFormList" :formData="txt" :txt="txt.id" :key="txt.id" @delete="delDomain" />
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
import { mapState } from "vuex";
import SubFormModal from './SubFormModal.vue'
export default {
  components: {
    SubFormModal
  },
  data() {
    return {
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false,
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
      form: {
        id: '', // name
        override: false,
        role: '',
        count: 0
      },
      title: '',
      rowName: '',
      subFormList:[],
    }
  },
  computed: {
    ...mapState({groups: (state) => state.groups }),
  },
  methods: {
    showModal(record, title) {
      let groups = JSON.parse(JSON.stringify(this.groups))
      const group = groups.filter(item => item.group_id == title)[0]
      const rule = group.rules.filter(item => item.id == record.event.eventDescription)
      console.log(rule, 'group', record.event.eventDescription)
      this.title = title
      this.rowName = record.event.eventDescription
      this.form = rule[0] || {}
      if (rule[0].subForm) {
        this.subFormList = rule[0].subForm.map((item, index) => {
          return {
            ...item,
            id: 'subForm_'+ index +'_' + new Date().valueOf()
          }
        })
      }
      this.visible = true
    },
    handleCancel() {
      this.visible = false
      this.$refs.form.resetFields();
    },
    handleOk() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const data = {
            ...this.form,
          }
          if (this.$refs.subForm) {
            const validTask = this.$refs.subForm.map(form=>form.onValid())
            Promise.all(validTask).then(subFormData=> {
              let subForm = subFormData.map(item => {
                return {
                  key: item.key,
                  op: item.op,
                  value: item.value
                }
              })
              data.subForm = subForm
            })
          }
          let groups = JSON.parse(JSON.stringify(this.groups))
          let newGroups = groups.map(item => {
            if (item => item.group_id == this.title) {
              item.rules = item.rules.map(ele => {
                if (ele.id == this.rowName) {
                  return data
                } else {
                  return ele
                }
              })
            }
            return item
          })
          console.log(newGroups, 'newGroupsnewGroups')
          this.$store.commit("setGroups", newGroups)
          this.handleCancel()
        } 
      });
      
    },
    addDomain() {
      this.subFormList.push(
        {
          id: 'subForm_'+ this.subFormList.length +'_'+new Date().valueOf(),
          // key: 
        }
      )
    },
    delDomain(key){
      this.subFormList = this.subFormList.filter(txt=>txt.id!==key)
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
  max-height: 410px;
  overflow-y: auto;
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