let util = require('../../../utils/util');
let http = require('../../../utils/request');
let API = require('../../../utils/config.js');
let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden_date: false,
    option_type: [{
      text: '身份证',
      value: '身份证'
    }, {
      text: '护照',
      value: '护照'
    }, {
      text: '其他',
      value: '其他'
    }],
    option_type1: [{
        text: '队员',
        value: '队员',
        disable: true,
      }, {
        text: '领队',
        value: '领队',
        disable: false,
      }, {
        text: '领队兼队员',
        value: '领队兼队员',
        disable: false,
      },
      {
        text: '教练',
        value: '教练',
        disable: false,
      },
      {
        text: '教练兼队员',
        value: '教练兼队员',
        disable: false,
      },

    ],
    edits:-1,

    hidden_date: true,
    currentDate: new Date().getTime(),
    minDate: (new Date().getTime() - 80 * 365 * 24 * 3600 * 1000),
    form: {
      name: '',
      idCardVal: '',
      birthdayName: '',
      birthday: '',
      phone: '',
      gender: '1',
      idCardType: '身份证',
      otherMsg: {},
      role: '队员',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let otherMsg = JSON.parse(options.otherMsg);
    let needCoach = options.needCoach;
    let needLead = options.needLead;
    let eid = options.eid;
    let edits = -1;
    if(!App.isNull(options.edits)){
      edits = options.edits
    }
    let {
      option_type1
    } = this.data;
    otherMsg.forEach(item => {
      let key = item.information;
      item[key] = '';
    });
    console.log(otherMsg)
    if (needCoach == 'false') {
      option_type1.splice(3, 2)
    }
    if (needLead == 'false') {
      option_type1.splice(1, 2)
    }
    console.log(needCoach, needLead);
    console.log(option_type1)

    this.setData({
      ['form.otherMsg']: otherMsg,
      needLead,
      needCoach,
      option_type1,
      eid,
      edits
    })
    console.log(this.data.edits)
    if( this.data.edits != -1){
      wx.setNavigationBarTitle({
        title: '编辑团体赛队员'
      })
      this.getDetail();
    }
    console.log(this.data.form)
  },
  getDetail: function () {
    let self = this;
    let {
      id
    } = this.data;
    http.get('/competition/team/queryAppliedMember', {
      id: self.data.edits
    }).then(function (res) {
      console.log(res);
      // return;
      let message = res.data.message;
      message.textVos.forEach(item =>{
        item.information = item.name;
        item[item.name] = item.val
      })
      self.setData({
        form:{...message,otherMsg:message.textVos}
      })
      console.log(self.data.form)
    })

  },
  submit: function () {
    let self = this;
    let {
      form,
      eid
    } = this.data;

    let isvalid = this.isvalid(form);
    if (!isvalid) {
      return wx.showToast({
        title: '报名人信息不完整',
        icon: 'none'
      })
    }
    let params = {
      ...form,
      value: '',
      eid
    }
    let otherMsgobj = {};
    params.otherMsg.forEach(item =>{
      otherMsgobj = {...otherMsgobj,...item};
    })
    delete otherMsgobj.cid;
    delete otherMsgobj.createTime;
    delete otherMsgobj.id;
    delete otherMsgobj.information;
    delete otherMsgobj.type;
    delete otherMsgobj.uid;
    delete otherMsgobj.name;
    delete otherMsgobj.val;
    params = {...params,otherMsg:JSON.stringify(otherMsgobj)}
    console.log(otherMsgobj);
    console.log(params);
    delete params.textVos;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let member = prevPage.data.form.member;
    let memberIds = prevPage.data.form.memberIds;
    console.log(params);

    let url = '/competition/team/addNewTeamMember'
    if(self.data.edits != -1){
      url = '/competition/team/updateTeamMember'
    }
    http.creat(url, params).then(function (res) {
      console.log(res);
      if (res.data.status != 200) {
        return wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration: 1000
        });
      };


      let indexof = memberIds.indexOf(res.data.message.id);
      if(indexof != -1){
        member.splice(indexof,1)
        memberIds.splice(indexof,1)
      }

      member.push(form)
      memberIds.push(res.data.message.id)
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        ['form.member']: member,
        ['form.memberIds']: memberIds
      })
      wx.navigateBack({
        delta: 1, // 回退前 delta(默认为1) 页面
      })
    })

  },

  changeSex: function (e) {
    let key = e.currentTarget.dataset.key;
    let ks = 'form.gender'
    this.setData({
      [ks]: key
    })
  },
  bindDate: function (e) {
    // console.log(e);
    let key = e.currentTarget.dataset.key;
    // console.log(key);
    let value = e.detail;
    if (key == 'idCardVal' || key == 'phone') {
      value = this.validateNumber(value);
    }
    let ks = 'form.' + key;
    // console.log(ks);
    this.setData({
      [ks]: value
    })
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  onInput: function (event) {
    this.setData({
      currentDate: event.detail
    });
  },
  showDate: function (e) {
    let hidden_date = this.data.hidden_date;
    this.setData({
      hidden_date: !hidden_date
    });
    if (hidden_date) {
      let key = e.currentTarget.dataset.key;
      let ks = 'form.' + key
      this.setData({
        currentKey: ks
      })
    }
  },
  confirm: function (e) {
    this.showDate();
    let currentKey = this.data.currentKey;
    let value = (util.formatStamp(e.detail)).date;
    this.setData({
      [currentKey]: e.detail,
      [currentKey + 'Name']: value,
    })

  },


  isvalid: function (data) {
    let newobj = {
      ...data,
      ...data.otherMsg
    };
     console.log(newobj);
    data.value = [];
    delete newobj.expand;
    delete newobj.textVos;
    if (newobj.idCardType == '身份证') {
      this.data.form.birthday = '';
      delete newobj.birthdayName;
      delete newobj.birthday;
    }
    delete newobj.otherMsg;
    // console.log(newobj);
    for (let it in newobj) {
      //  console.log(it);
      data.value.push(newobj[it])
    }
    console.log(data.value)
    return data.value.every(key => {
      //  console.log(key)
      let isnull = App.isNull(key);
      // console.log(isnull)
      return isnull != true;
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})