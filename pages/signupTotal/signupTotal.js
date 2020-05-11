let http = require('../../utils/request');
let App = getApp();
let unit = require('../../utils/util')
let Api = require('../../utils/config');
let zyy = 0;
// let filter = require('../filter.wxs')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    agree: false,
    dialogAgree: true,
    gender: '1',
    withPeople: "false",
    takeMan: '',
    takeWoman: '',
    expand: '',
    phone: '',
    name: '',
    isCancel: false,
    registrationStatus: '',
    baseMoney: '',
    disabled: false,
    show: false,
    scanCode: Api.cvs_img + '/20200428/8ec1771a3f39d557fa893d3e22cb25cf.jpg',
    usid: '',
    isVipAble:"false",
    isVip:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    let userInfo = App.getUserInfo();
    this.setData({
      id: options.id,
      withPeople: options.withPeople,
      type: options.type,
      time: options.time,
      max: options.max,
      chargeMode: options.chargeMode,
      priceWoman: options.priceWoman,
      priceMan: options.priceMan,
      registrationStatus: options.registrationStatus,
      needToPay: options.needToPay,
      phone: userInfo.phoneNum,
      name: userInfo.nickName,
      participantsNum: options.participantsNum,
      usid: options.usid,
      isVipAble:options.isVip,
      vipPriceWoman:options.vipPriceWoman,
      vipPriceMan:options.vipPriceMan
    });
    this.getQrCode();
    if (options.type == 1) {
      wx.setNavigationBarTitle({
        title: '修改报名'
      })
      this.setData({
        agree: true
      });
      this.getActivityDetail();
      let isCancel = self.timer(this.data.time);
      if (isCancel > 0) {
        this.setData({
          isCancel: true
        })
        return;
      }
      this.setData({
        isCancel: false,
      })
    }
  },
  switchChange: function (e) {
    let key = e.currentTarget.dataset.key;
    this.setData({
      [key]: e.detail.value
    })
  },
  getQrCode:function(){
    let self = this;
    let id = self.data.id
    http.get('/activities/selectActivitiesByIdImg?id=' + id,'').then(function(res){
      console.log(res);
      if(res.data.status == 200){
        self.setData({qrCodeUrl:res.data.message.qrCodeUrl})
      }
    })
  },
  modalAgree: function () {
    let dialogAgree = this.data.dialogAgree;
    this.setData({
      dialogAgree: !dialogAgree
    })
  },
  closeDialogAgree: function () {
    this.setData({
      dialogAgree: true
    })
  },
  checkBoxChange: function (e) {
    let agree = this.data.agree;
    this.setData({
      agree: !agree
    })
  },
  getActivityDetail: function () {
    let self = this;
    let params = {
      activityId: self.data.id
    }
    http.get('/activities/apply/queryDescByUidAndActivityId', params).then(function (res) {
      // console.log(res);
      let data = res.data.message;
      let baseMoney = unit.totalMoney(data.gender, self.data.priceMan, self.data.priceWoman, data.takeMan, data.takeWoman,data.isVip,self.data.vipPriceMan,self.data.vipPriceWoman);
      // console.log(data.isVip);
      // console.log(self.data.vipPriceMan);
      // console.log(self.data.vipPriceWoman);
      console.log(baseMoney);
      self.setData({
        name: data.name,
        phone: data.phone,
        gender: data.gender,
        expand: data.expand,
        takeMan: data.takeMan,
        takeWoman: data.takeWoman,
        baseMoney: baseMoney,
        isVip:data.isVip
      })
    })
  },
  cancelSelf: function () {
    let self = this;
    wx.showModal({
      title: '提示',
      content: '确定取消报名？',
      success(res) {
        if (res.confirm) {
          let params = {
            activityId: self.data.id
          };
          http.get('/activities/cancel', params).then(function (res) {
            if (res.data.status == 200) {
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];
              prevPage.setData({
                id: self.data.id
              })
              prevPage.reloadPage();
              wx.navigateBack({
                delta: 1,
              })
            }

          })
        }
      }
    })
  },
  
  timer: function (str) {
    str = str.replace(/-/g, '/');
    let date = new Date(str)
    let time = date.getTime();
    // console.log(str)
    // console.log(time)
    let diff = '';
    let time_diff = time - new Date().getTime();
    console.log(time_diff);
    return time_diff;
  },
  chosed: function (e) {

    let key = e.currentTarget.dataset.key;
    this.setData({
      gender: key
    })
  },
  bindDate: function (e) {
    let key = e.currentTarget.dataset.key;
    console.log(key)
    if (key == 'phone' || key == 'takeMan' || key == 'takeWoman') {
      let value = this.validateNumber(e.detail.value);
      this.setData({
        [key]: value
      })
      return;
    }
    this.setData({
      [key]: e.detail.value
    })
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  submit(e, edt) {
    let money = 0;
    let edit = 0
    if (e != 0) {
      money = parseFloat(e.currentTarget.dataset.key);
      edit = e.currentTarget.dataset.edit;
    }
    // console.log(edt);
    if (edt == 1) {
      edit = edt;
    }
    console.log(money);
    console.log(edit);
    let self = this;
    let agree = self.data.agree;
    if (!agree) {
      return wx.showToast({
        title: '请阅读本平台协议，勾选同意后方可报名',
        icon: 'none',
      })
    }
    console.log(self.data.chargeMode);
    console.log(self.data.needToPay);
    console.log(money);
    let url = '/activities/apply';
    if (self.data.chargeMode == 1 && self.data.needToPay == "true" && money > 0) {
      url = '/activities/apply/pay';
    } else if ((edit == '1' && money <= 0) || (edit == '1' && self.data.needToPay == "false")) {
      url = '/activities/updateApply';
    }
    let {
      name,
      phone,
      takeMan,
      takeWoman,
      id,
      gender,
      expand,
      isVip
    } = this.data;

    if (takeMan == '') {
      takeMan = 0
    };
    if (takeWoman == '') {
      takeWoman = 0
    };
    let params = {
      name,
      phone,
      id,
      gender,
      expand,
      isVip
    };
    if (self.data.withPeople != "false") {
      params = {
        name,
        phone,
        takeMan,
        takeWoman,
        id,
        gender,
        expand,
        isVip
      };
    };
    let total = Number(takeMan) + Number(takeWoman);
    let max = Number(self.data.max) - 1;
    if (name === '') {
      return wx.showToast({
        title: '姓名不能为空',
        icon: 'none'
      })
    } else if ( App.isNull(phone) || phone.length != 11) {
      return wx.showToast({
        title: '请输入正确的联系电话',
        icon: 'none'
      })
    } else if (total > max) {
      return wx.showToast({
        title: '活动最多报名人数为' + self.data.max,
        icon: 'none'
      })
    }
    // console.log(url);
    // console.log(params);
    self.setData({
      disabled: true
    })
    setTimeout(() => {
      self.setData({
        disabled: false
      })
    }, 2000);
    http.creat(url, params).then(function (data) {
      console.log(data);
      if (data.data.status == 200) {
        if (self.data.chargeMode == 1 && self.data.needToPay == "true" && money > 0) {
          let msg = data.data.message;
          wx.requestPayment({
            timeStamp: msg.timeStamp,
            nonceStr: msg.nonceStr,
            package: msg.package,
            signType: 'MD5',
            paySign: msg.paySign,
            success(res) {
              console.log(res);
              self.setData({
                chargeMode: !1
              });
              if (edit == 1) {
                self.submit(0, 1);
              } else {
                self.submit(0);
              }
            },
            fail(res) {}
          })
        } else {
          // console.log('fs')
          // let token = wx.getStorageSync('token');
          // console.log('fsfs');
          // let usid = self.data.usid;
          // console.log(usid);
          // console.log(usid == '1204941003936710657');
          // return;
          let qrCodeUrl = self.data.qrCodeUrl;
          console.log(self.data.qrCodeUrl)
          if (!App.isNull(qrCodeUrl)) {
            console.log('fsfsfs');
            self.setData({
              show: true
            });

          } else {
            var pages = getCurrentPages();
            var prevPage = pages[pages.length - 2];
            prevPage.setData({
              id: self.data.id
            })
            prevPage.reloadPage();
            wx.navigateBack({
              delta: 1,
            })
          }
        }
      } else {
        wx.showToast({
          title: data.data.status + data.data.message,
          icon: 'none',
          duration: 3000
        });
      }
    })
  },
  onClose: function () {
    this.setData({
      show: false
    });
    this.back();
  },
  onConfirm: function () {
    let self = this;
    console.log('fsfs')
    // scanCode
    console.log(self.data.qrCodeUrl)
    wx.downloadFile({
      url: self.data.qrCodeUrl,
      success: function (res) {
        console.log(res);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success() {
            self.setData({
              show: false
            });
            return wx.showToast({
              title: '保存成功！',
              icon: 'success',
            })
          },
          complete(res) {
            setTimeout(() => {
              self.back();
            }, 1000);
          }
        })
      }
    });

  },
  back: function () {
    let self = this;
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      id: self.data.id
    })
    prevPage.reloadPage();
    wx.navigateBack({
      delta: 1,
    })
  },
  getphonenumber: function (e) {
    let self = this;
    let params = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }
    http.post('/member/getPhone', params).then(function (res) {
      let phone = JSON.parse(res.data.message).phoneNumber;
      self.setData({
        phone: phone
      });
      App.setPhone(phone);
    })
  },
  // 我同意
  _defaultAgree: function () {
    this.setData({
      agree: true
    })
  },
  // 防止穿透
  _touchmove: function () {}
})