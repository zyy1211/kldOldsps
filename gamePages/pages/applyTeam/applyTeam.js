// gamePages/pages/test/test.js

let util = require('../../../utils/util');
let http = require('../../../utils/request');
let API = require('../../../utils/config.js');
let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      teamName: '',
      name: '',
      phone: '',
      leadName: '',
      leadPhone: '',
      coachName: '',
      coachPhone: '',
      memberIds: [],
      member: [],

    },
    prolenght:0,
    disabled:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log('fsfs')
    this.setData({
      id: options.id,
      type: options.type,
      edits: options.edits
    })
    if (options.edits == '1') {
      wx.setNavigationBarTitle({
        title: '团体赛修改报名'
      })
      this.getDetail();
    } 
    this.getForm();

  },
  getDetail: function () {
    let self = this;
    let {
      id
    } = this.data;
    http.get('/competition/team/queryAppliedTeam', {
      tid: id
    }).then(function (res) {
      console.log(res);
      let member = res.data.message.members;
      let memberIds = member.map(item =>{
        return item.id
      })
      let form = {
        ...res.data.message.team,
        member: res.data.message.members,
        memberIds
      }
      self.setData({
        form,
        prolenght:memberIds.length
      })
      console.log(form)
      // let message = res.data.message;
      // let text1 = message[0].textVos;
      // let text2 = message[1].textVos;
      // console.log(text1)
      // text1.forEach(item =>{
      //   item.information = item.name;
      // })
      // message[0].otherMsg = JSON.parse(message[0].otherMsg)
      // message[1].otherMsg = JSON.parse(message[1].otherMsg)

      // self.setData({
      //   form: message,
      //   ['message.num']: message.length,
      //   ['message.text']: text1
      // })
      // console.log(self.data.form)
    })
  },
  getForm: function () {
    let self = this;
    let {
      id,
      type
    } = this.data;

    http.get('/competition/information/queryByCid', {
      id,
      type
    }).then(function (res) {
      console.log(res);
      self.setData({
        message: res.data.message
      })

    })
  },

  toAdd: function (e) {
    console.log(e);
    let key = e.currentTarget.dataset.key;
    let {
      message,
      id
    } = this.data;
    console.log(message, id)
    wx.navigateTo({
      url: '/gamePages/pages/addTeamMember/addTeamMember?otherMsg=' + JSON.stringify(message.text) + '&needLead=' + message.needLead + '&needCoach=' + message.needCoach + '&eid=' + id + "&edits=" + key
    })
  },
  delTeamMember: function (e) {
    let index = e.currentTarget.dataset.index;
    let member = this.data.form.member;
    let memberIds = this.data.form.memberIds;
    member.splice(index, 1);
    memberIds.splice(index, 1);
    this.setData({
      ['form.member']: member,
      ['form.memberIds']: memberIds
    })

  },
  submit: function () {
    let self = this;
    let {
      form,
      id,
      edits
    } = this.data;
    let {
      teamName,
      name,
      phone,
      member,
      memberIds
    } = form;
    let {
      minMum,
      maxNum,
      isFree,
      priceType
    } = this.data.message;
    let memlength = member.length;
    if (App.isNull(teamName)) {
      return wx.showToast({
        title: '队伍名称不能为空',
        icon: 'none'
      })
    }
    if (App.isNull(name)) {
      return wx.showToast({
        title: '联系人名称不能为空',
        icon: 'none'
      })
    }
    if (App.isNull(phone)) {
      return wx.showToast({
        title: '联系人电话不能为空',
        icon: 'none'
      })
    }
    if (memlength < minMum || memlength > maxNum) {
      return wx.showToast({
        title: minMum + '< 报名的队员数量 <' + maxNum,
        icon: 'none'
      })
    }
    // console.log(isFree)
    // console.log(App.isNull(isFree))
    let {prolenght} = self.data;
    let inlength = memberIds.length;
    console.log(prolenght)
    console.log(inlength)
    console.log(!isFree);
    console.log(inlength > prolenght);
    console.log( (priceType == '0' && edits != '1') || (priceType == '1') );
    console.log((priceType == '0' && edits != '1'));
    console.log((priceType == '1') );

    self.setData({
      disabled:true
    })
    setTimeout(() => {
      self.setData({
        disabled:false
      })
    }, 2000);

    if (!isFree && inlength > prolenght &&( (priceType == '0' && edits != '1') || (priceType == '1')  )) {
      http.creat('/competition/apply/payTeam', {
        memberIds,
        id
      }).then(function (res) {
        console.log(res);
        if (res.data.status != 200) {
          return wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000
          });
        }
        let {
          timeStamp,
          paySign,
          signType,
          nonceStr
        } = res.data.message;
        let package1 = res.data.message.package
        wx.requestPayment({
          timeStamp: timeStamp,
          nonceStr: nonceStr,
          package: package1,
          signType: signType,
          paySign: paySign,
          success(res) {
            console.log(res);
            self.save('/competition/apply/applyTeam',form, id);
          },
          fail(res) {
            console.log(res);
            wx.showToast({
              title: '订单未支付',
              icon: 'none',
              duration: 1000
            });
            // that.initData();
          },
        })
      })
    } else {
      if (self.data.edits == '1') {
        self.save('/competition/apply/updateApplyTeam',form, id);
        console.log(form);
        console.log(id);
        return;
      }else{
        self.save('/competition/apply/applyTeam',form, id);
      }
      // self.save(form, id);
    }
  },
  cancelr:function(){
    let {id} = this.data;
    http.get('/competition/apply/cancelApplyTeam',{tid:id}).then(function(res){
      console.log(res);
      if(res.data.status == 200){
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
        })
      }

    })
  },
  save: function (url,form, eid) {
    http.creat(url, {
      ...form,
      eid
    }).then(function (data) {
      if (data.data.status != 200) {
        wx.showToast({
          title: data.data.status + data.data.message,
          icon: 'none',
          duration: 3000
        })
        return;
      };
      wx.navigateBack({
        delta: 1, // 回退前 delta(默认为1) 页面
      })
    })
  },
  bindDate: function (e) {
    let key = e.currentTarget.dataset.key;
    let value = e.detail;
    if (key == 'phone') {
      value = this.validateNumber(value);
    }
    let ks = 'form.' + key;
    this.setData({
      [ks]: value
    })
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
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
  // onShareAppMessage: function () {

  // }
})