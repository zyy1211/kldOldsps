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
    disabled: false,
    hidden_date: true,
    currentDate: new Date().getTime(),
    minDate: (new Date().getTime() - 80 * 365 * 24 * 3600 * 1000),
    form: [{
      name: '',
      idCardVal: '',
      birthdayName: '',
      birthday: '',
      phone: '',
      gender: '1',
      idCardType: '身份证',
      otherMsg: {},
    }, {
      name: '',
      idCardVal: '',
      birthdayName: '',
      birthday: '',
      phone: '',
      gender: '1',
      idCardType: '身份证',
      otherMsg: {},
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let gameType = App.getGameType();
    // Notify({
    //   message: '组别名称：'+gameType.eventName+'\n赛事项目：' + gameType.eventType +'\n(可报名年龄区间'+gameType.minAge +'--' +gameType.maxAge +'岁)',
    //   color: '#F26746',
    //   background: 'rgba(240, 240, 240, 1)',
    //   duration:'notify'
    // });
    this.setData({
      id: options.id,
      type: options.type,
      edits: options.edits,
      gameType
    })
    // console.log(options.edit)


    if (options.edits == '1') {
      wx.setNavigationBarTitle({
        title: '单项赛修改报名'
      })
      this.getDetail();
    } else {
      this.getForm();
    }

  },
  submit: function () {
    let self = this;
    let {
      form,
      id,
      isFree,
      priceType,
      pricePeople,
      priceTeam,
      edits
    } = this.data;
    // console.log(form);
    let isvalid = this.isvalid(form);
    if (!isvalid) {
      return wx.showToast({
        title: '报名人信息不完整',
        icon: 'none'
      })
    }
    let params = {
      members: JSON.stringify(form),
      id
    }
    console.log(form);

    self.setData({
      disabled: true
    })
    setTimeout(() => {
      self.setData({
        disabled: false
      })
    }, 2000);

    if (!isFree && edits != '1') {
      console.log('fsfs')
      let url = '/competition/apply/paySingle';
      http.creat(url, params).then(function (res) {
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
            self.save('/competition/apply/applySingle', form, id);
          },
          fail(res) {
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
        self.save('/competition/apply/singleUpdate', form, id);
        console.log(form);
        console.log(id);
        return;
      } else {
        self.save('/competition/apply/applySingle', form, id);
      }

    }

  },

  cancelr: function () {
    let {
      id
    } = this.data;
    http.get('/competition/apply/cancelApplySingle', {
      sid: id
    }).then(function (res) {
      console.log(res);
      if (res.data.status == 200) {
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
        })
      }
    })
  },

  save: function (url, form, id) {
    http.creat(url, {
      members: JSON.stringify(form),
      id
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
  getForm: function () {
    let self = this;
    // 单id3 type1 团id2type0
    let {
      id,
      type,
      form
    } = this.data;
    http.get('/competition/information/queryByCid', {
      id,
      type
    }).then(function (res) {
      // console.log(res);
      let message = res.data.message;
      let {
        isFree,
        priceType,
        pricePeople,
        priceTeam
      } = message;
      message.text.forEach(item => {
        let key = item.information;
        form[0]['otherMsg'][key] = '';
        form[1]['otherMsg'][key] = '';
      })
      console.log(form);
      let newform = message.num == 1 ? [form[0]] : form;
      self.setData({
        message,
        form: newform,
        isFree,
        priceType,
        pricePeople,
        priceTeam

      });
      console.log(self.data.message)
      console.log(self.data.form);

    })
  },
  getDetail: function () {
    let self = this;
    let {
      id
    } = this.data;
    http.get('/competition/single/queryAppliedMembers', {
      sid: id
    }).then(function (res) {
      console.log(res);
      let message = res.data.message;
      let text1 = message[0].textVos;
      console.log(text1)
      text1.forEach(item => {
        item.information = item.name;
      })
      message[0].otherMsg = JSON.parse(message[0].otherMsg)
      if (message.length == 2) {
        message[1].otherMsg = JSON.parse(message[1].otherMsg)
      }
      message.forEach(item => {
        if (item.idCardType != '身份证') {
          item.birthdayName = util.formatStamp(item.birthday).date;
        }
      })
      self.setData({
        form: message,
        ['message.num']: message.length,
        ['message.text']: text1
      })

      console.log(self.data.form)
    })
  },
  changeSex: function (e) {
    let key = e.currentTarget.dataset.key;
    let index = e.currentTarget.dataset.index;
    let ks = 'form[' + index + '].gender'
    // console.log(key)
    this.setData({
      [ks]: key
    })
  },
  bindDate: function (e) {
    // console.log(e);
    let key = e.currentTarget.dataset.key;
    let index = e.currentTarget.dataset.index;
    let value = e.detail;
    if (key == 'idCardVal' || key == 'phone') {
      value = this.validateNumber(value);
    }
    let ks = 'form[' + index + '].' + key;
    // console.log(ks)
    // console.log(value)
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
      let index = e.currentTarget.dataset.index;
      let ks = 'form[' + index + '].' + key
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
    return true;
    // console.log(data);
    // data.forEach(item => {
    //   let newobj = {
    //     ...item,
    //     ...item.otherMsg
    //   };
    //   //  console.log(newobj);
    //   item.value = [];
    //   delete newobj.expand;
    //   if (newobj.idCardType == '身份证') {
    //     delete newobj.birthdayName;
    //     delete newobj.birthday;
    //   }
    //   delete newobj.otherMsg;
    //   console.log(newobj);
    //   for (let it in newobj) {
    //     //  console.log(it);
    //     item.value.push(newobj[it])
    //   }
    // })
    // return data.every(item => {
    //   // console.log(item)
    //   let hasnull = item.value.every(key => {
    //     //  console.log(key)
    //     let isnull = App.isNull(key);
    //     // console.log(isnull)
    //     return isnull != true;
    //   })
    //   return hasnull != false;
    // })
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