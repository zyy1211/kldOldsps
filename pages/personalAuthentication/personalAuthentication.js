// pages/personalAuthentication/personalAuthentication.js
let app = getApp();
let util = require('../../utils/util');
let http = require('../../utils/request');
let API = require('../../utils/config.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    startShow: false,
    endShow: false,
    certificationType: 0,
    label0: {
      enterpriseName: '企业全称',
      licenseNum: '企业营业执照号码',
      legalPersonName: '企业法人姓名',
      licenseTerm: '营业执照有效期',
      licenseTermStart1: '开始时间',
      licenseTermEnd1: '结束时间',
      idcard: '企业法人',
      authCard: '企业'
    },
    label1: {
      enterpriseName: '个体工商户企业名称',
      licenseNum: '个体营业执照号码',
      legalPersonName: '法人姓名',
      licenseTerm: '营业执照有效期',
      licenseTermStart1: '开始时间',
      licenseTermEnd1: '结束时间',
      idcard: '个体',
      authCard: '个体'
    },
    label: {},
    idCardFront: '',
    idCardContrary: '',
    licenseImage: '',
    status: '',
    img_host: API.img_host,
    cause: ''
  },
  onChange(event) {

    let value = 'label' + event.detail.index;
    this.setData({
      label: this.data[value],
      certificationType: event.detail.index
    })
  },
  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]]
    })
  },

  clearEnd: function () {
    // console.log('fsfsf')
    this.setData({
      licenseTermEnd1: '',
      licenseTermEnd: -1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let self = this;
    this.setData({
      label: this.data.label0,
      status: options.status,
      cause: app.globalData.cause
    })
    console.log(app.globalData.cause)
  },
  onShow: function () {
    let self = this;
    app.getAuth(function (isAuth) {
      console.log(isAuth)
      if (isAuth != 2) {
        self.getDetail();
      }
    });

  },
  onClickIcon: function (e) {
    console.log(e);
    let key = e.currentTarget.dataset.key;
    this.setData({
      [key]: e.detail
    })

  },
  getDetail: function () {
    let self = this;
    http.get('/certification/queryById').then(function (data) {
      console.log(data);
      if (data.data.message != null) {
        let {
          enterpriseName,
          licenseNum,
          legalPersonName,
          licenseTermStart,
          licenseTermEnd,
          auditStatus,
          idCardFront,
          idCardContrary,
          licenseImage
        } = data.data.message;
        let licenseTermStart1 = util.formatStamp(licenseTermStart).date;
        let licenseTermEnd1 = '';
        if (licenseTermEnd != -1) {
          licenseTermEnd1 = util.formatStamp(licenseTermEnd).date;
        }

        self.setData({
          enterpriseName,
          licenseNum,
          legalPersonName,
          licenseTermStart,
          licenseTermEnd,
          licenseTermStart1,
          licenseTermEnd1,
          auditStatus,
          idCardFront,
          idCardContrary,
          licenseImage
        })
      }
    })
  },
  getUserInfo: function (e) {
    console.log(e);
    let self = this;
    if (e.detail.userInfo === undefined) {
      return;
    }
    wx.login({
      success: function (res) {
        // console.log(res);
        let userInfo = app.getUserInfo();
        // console.log(userInfo.id)
        self.saveuid(e.detail, res.code, userInfo.id);
      },
    })

  },
  saveuid: function (res, code, uid) {
    let self = this;
    let {
      encryptedData,
      iv,
    } = res;
    let params = {
      encryptedData,
      iv,
      code,
      uid
    }

    http.post('/stadium/saveUnionId', params).then(function (res) {
      self.submit();
    })
  },
  submit: function () {
    let self = this;
    let {
      enterpriseName,
      licenseNum,
      legalPersonName,
      licenseTermStart,
      licenseTermEnd,
      idCardFront,
      idCardContrary,
      licenseImage,
      certificationType,

    } = this.data;
    if (app.isNull(enterpriseName)) {
      return this.validateDate('enterpriseName');
    }
    if (app.isNull(licenseNum)) {
      return this.validateDate('licenseNum');
    }
    if (app.isNull(legalPersonName)) {
      return this.validateDate('legalPersonName');
    }
    if (app.isNull(licenseTermStart)) {
      return this.validateDate('licenseTermStart');
    }
    // if (app.isNull(licenseTermEnd)) {
    //   return this.validateDate('licenseTermEnd');
    // }
    // if (licenseTermStart > licenseTermEnd) {
    //   return wx.showToast({
    //     title: '开始时间不能晚于结束时间',
    //     icon: 'none',
    //     duration: 3000
    //   })
    // }
    if (app.isNull(idCardFront) || app.isNull(idCardContrary) || app.isNull(licenseImage)) {
      return wx.showToast({
        title: '身份证照片和经营许可证照片不能为空',
        icon: 'none',
        duration: 3000
      })
    }
    if (app.isNull(licenseTermEnd)) {
      licenseTermEnd = -1;
    }
    self.showLoading();
    http.creat('/certification/information', {
      enterpriseName,
      licenseNum,
      legalPersonName,
      licenseTermStart,
      licenseTermEnd,
      certificationType,
    }).then(function (data) {
      console.log(data);
      if (data.data.status != 200) {
        self.hideLoading();
        wx.showToast({
          title: data.data.status + data.data.message,
          icon: 'none',
          duration: 3000
        })
        return;
      }
      let id = data.data.message;
      self.upLoadImage(id, 0, idCardFront, 0);
    })

  },
  upLoadImage: function (id, imageType, file, num) {
    let self = this;
    let token = wx.getStorageSync('token');
    wx.uploadFile({
      url: API.API_HOST + '/certification/upLoadImages',
      header: {
        'token': token,
      },
      formData: {
        'id': id,
        imageType: imageType,
        image: 'image'
      },
      filePath: file,
      name: 'image',
      success() {},
      complete() {
        if (num > 2 || num == 2) {
          self.hideLoading();
          app.globalData.isAuth = -1;
          wx.switchTab({
            url: '../mine/mine',
          });

        } else {
          if (num == 0) {
            let idCardContrary = self.data.idCardContrary;
            self.upLoadImage(id, num + 1, idCardContrary, num + 1);
          } else if (num == 1) {
            let licenseImage = self.data.licenseImage;
            self.upLoadImage(id, num + 1, licenseImage, num + 1);
          }

        }
      }
    })
  },

  validateDate: function (key) {
    let self = this;
    wx.showToast({
      title: self.data.label[key] + '不能为空',
      icon: 'none',
      duration: 3000
    })
  },
  chooseImage: function (e) {
    if (this.data.status == 0) {
      return;
    }
    let self = this;
    let key = e.currentTarget.dataset.key;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res);
        wx.compressImage({
          src: res.tempFilePaths[0],
          quality: 80,
          success: function (tpm) {

            console.log(tpm.tempFilePath);
            self.setData({
              [key]: tpm.tempFilePath
            })

          },
          fail: function (res) {
            console.log(res)
          }
        })
      },
      fail: function (res) {
        console.log(res)
        // fail
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  showLoading: function () {
    wx.showLoading({
      title: "提交中",
      mask: true
    });
  },
  hideLoading: function () {
    wx.hideLoading();
  },
  // 防止穿透
  _touchmove: function () {},
  showStart: function (event) {
    if (this.data.status == 0) {
      return;
    }
    this.setData({
      startShow: !this.data.startShow,
    })
  },
  showEnd: function (event) {
    if (this.data.status == 0) {
      return;
    }
    this.setData({
      endShow: !this.data.endShow,
    })
  },
  onConfig: function (e) {
    let key = e.currentTarget.dataset.key;
    let keyvalue = e.currentTarget.dataset.keyvalue;
    console.log(e)
    let value = util.formatStamp(e.detail);
    console.log(value);
    this.setData({
      [key]: value.date,
      [keyvalue]: e.detail,
      endShow: false,
      startShow: false
    })

  }

})