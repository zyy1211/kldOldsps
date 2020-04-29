// pages/settledIn.js
let app = getApp();
let util = require('../../utils/util');
let http = require('../../utils/request');
let API = require('../../utils/config.js');
let QQMapWX = require('../../utils/qqmap-wx-jssdk.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    typeShow: false,
    venueShow: false,
    edit: false,
    editId: -1,
    img_host: API.img_host,
    typeActions: [{
        name: '国营',
        id: 1
      },
      {
        name: '民营',
        id: 2
      },
      {
        name: '民办非企业',
        id: 3
      },
      {
        name: '个体工商户',
        id: 4
      },
      {
        name: '其他',
        id: 5
      }
    ],
    venueActions: [{
        name: '体育馆',
        id: 1
      },
      {
        name: '活动健身场馆',
        id: 2
      },
      {
        name: '社区多功能运动场',
        id: 3
      },
      {
        name: '青少年运动活动中心',
        id: 4
      },
      {
        name: '其他',
        id: 5
      }
    ],
    matching: [{
        name: '柜子租凭',
        id: 1,
        checked: false
      },
      {
        name: '洗浴设施',
        id: 1,
        checked: false
      },
      {
        name: '有热水',
        id: 1,
        checked: false
      },
      {
        name: '装备租赁',
        id: 1,
        checked: false
      },
      {
        name: 'wifi',
        id: 1,
        checked: false
      },
      {
        name: '医疗服务',
        id: 1,
        checked: false
      },
      {
        name: '饮料售卖',
        id: 1,
        checked: false
      },
      {
        name: '停车场',
        id: 1,
        checked: false
      },
      {
        name: '休息区域',
        id: 1,
        checked: false
      },
    ],
    sportEvent: [{
        name: '羽毛球',
        id: 1,
        checked: false
      },
      {
        name: '篮球',
        id: 1,
        checked: false
      },
      {
        name: '足球',
        id: 1,
        checked: false
      },
      {
        name: '网球',
        id: 1,
        checked: false
      },
      {
        name: '乒乓球',
        id: 1,
        checked: false
      },
      {
        name: '桌球',
        id: 1,
        checked: false
      },
      {
        name: '高尔夫球',
        id: 1,
        checked: false
      },
      {
        name: '排球',
        id: 1,
        checked: false
      },
      {
        name: '游泳',
        id: 1,
        checked: false
      },
      {
        name: '健身',
        id: 1,
        checked: false
      },
      {
        name: '旱冰',
        id: 1,
        checked: false
      },
      {
        name: '舞蹈',
        id: 1,
        checked: false
      },
      {
        name: '瑜伽',
        id: 1,
        checked: false
      },
      {
        name: '攀岩',
        id: 1,
        checked: false
      },
      {
        name: '跆拳道',
        id: 1,
        checked: false
      },
      {
        name: '击剑',
        id: 1,
        checked: false
      },
      {
        name: '壁球',
        id: 1,
        checked: false
      },
      {
        name: '武术',
        id: 1,
        checked: false
      },
      {
        name: '滑雪',
        id: 1,
        checked: false
      },
      {
        name: '保龄球',
        id: 1,
        checked: false
      },
      {
        name: '射箭',
        id: 1,
        checked: false
      },
    ],
    training: [],
    workDay1: '07:00',
    workDay2: '18:00',
    dayOff1: '07:00',
    dayOff2: '18:00',
    imagesPath: ['', '', '', '', ''],
    expand: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      training: this.data.sportEvent,
      businessNature: this.data.typeActions[0].name,
      stadiumType: this.data.venueActions[0].name,
    })
    this.getDetail();
  },
  getDetail: function () {
    let self = this;
    let matching = self.data.matching;
    let sportEvent = self.data.sportEvent;
    let training = self.data.training;
    http.post('/stadium/queryDetailsByUid', '').then(function (result) {
      console.log(result);
      if (!app.isNull(result.data.message)) {
        let {
          sName,
          sAddr,
          sAddrDesc,
          sAddrLongitude,
          sAddrLatitude,
          contactName,
          contactPhone,
          workDay,
          dayOff,
          businessNature,
          stadiumType,
          facility,
          sportType,
          cultivateName,
          imagesPath,
          expand
        } = result.data.message;
        let workDay1 = workDay.split('-')[0];
        let workDay2 = workDay.split('-')[1];
        let dayOff1 = dayOff.split('-')[0];
        let dayOff2 = dayOff.split('-')[1];
        facility = facility.split(',');
        sportType = sportType.split(',');
        cultivateName = cultivateName.split(',');
        imagesPath = [...imagesPath, ...['', '', '', '', '']].slice(0, 5);
        console.log(imagesPath)
        // imagesPath = imagesPath.map((item) =>{
        //   return self.data.img_host+item;
        // })
        // facility,sportType,cultivateName,imagesPath

        let matching1 = self.reviceCheck(matching, facility);
        let sportEvent1 = self.reviceCheck(sportEvent, sportType);
        let training1 = self.reviceCheck(training, cultivateName);
        self.setData({
          editId: result.data.message.id,
          sName,
          sAddr,
          sAddrDesc,
          sAddrLongitude,
          sAddrLatitude,
          contactName,
          contactPhone,
          workDay1,
          workDay2,
          dayOff1,
          dayOff2,
          businessNature,
          stadiumType,
          matching: matching1,
          sportEvent: sportEvent1,
          training: training1,
          imagesPath,
          expand
        })
      } else {
        self.setData({
          editId: -1,
        })
      }
    })
  },
  reviceCheck: function (oldarr, arr) {
    oldarr.forEach((item) => {
      let indexof = arr.indexOf(item.name);
      if (indexof == -1) {
        item.checked = false;
      } else {
        item.checked = true;
      }
    })
    return oldarr;
  },
  showSheet: function (e) {
    console.log(e);
    let key = e.currentTarget.dataset.key;
    console.log(key);
    this.setData({
      [key]: true
    })
  },
  closeTypeSheet: function () {
    this.setData({
      typeShow: false
    })
  },
  closeVenueSheet: function () {
    this.setData({
      typeShow: false
    })
  },
  closeVenueSheet: function () {
    this.setData({
      venueShow: false
    })
  },
  selectTypeSheet: function (e) {
    console.log(e);
    let key = e.currentTarget.dataset.key;
    this.setData({
      [key]: e.detail.name
    })
  },

  chooseDefalutTab: function (e) {
    let index = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.type;
    let value = this.data[type][index].checked;
    let key = type + '[' + index + '].checked';
    this.setData({
      [key]: !value
    })
  },
  bindChooseLocation: function () {
    let self = this;
    self.selectComponent("#authorize").getAuthorizeLocation(function (a) {
      // console.log(self.data.editId);
      console.log(a);
      if (self.data.editId != -1) {
        let latitude = self.data.addressLatitude;
        let longitude = self.data.addressLongitude;
        wx.chooseLocation({
          type: "gcj02",
          sAddrLatitude: latitude,
          sAddrLongitude: longitude,
          success: function (a) {
            // console.log(a);
            self.setData({
              sAddr: a.name,
              sAddrLongitude: a.longitude,
              sAddrLatitude: a.latitude
            })
            self.getArea();
          }
        });
        return;
      } else {
        wx.chooseLocation({
          type: "gcj02",
          success: function (a) {
            console.log(a);
            self.setData({
              sAddr: a.name,
              sAddrLongitude: a.longitude,
              sAddrLatitude: a.latitude
            })
            self.getArea();
          }
        });
      }
    });
  },
  getArea: function () {
    let self = this;
    let {
      sAddrLongitude,
      sAddrLatitude
    } = self.data;

    let map = new QQMapWX({
      key: API.QQmapsdkKey
    });
    map.reverseGeocoder({
      location: {
        latitude: sAddrLatitude,
        longitude: sAddrLongitude
      },
      success: function (t) {
        console.log(t);
        // let address = t.result.formatted_addresses.recommend;
        self.setData({
          expand: t.result.address_component.district
        })
      },fail:function(t){ console.log(t) }
    });
  },
  bindDate: function (e) {
    console.log(e)
    let key = e.currentTarget.dataset.key;
    this.setData({
      [key]: e.detail.value
    })
  },
  formatNumber: function (e) {
    let value = this.validateNumber(e.detail.value);
    let key = e.currentTarget.dataset.key;
    this.setData({
      [key]: value
    })
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  submit: function () {
    let self = this;

    let {
      sName,
      sAddr,
      sAddrDesc,
      sAddrLongitude,
      sAddrLatitude,
      contactName,
      contactPhone,
      workDay1,
      workDay2,
      dayOff1,
      dayOff2,
      businessNature,
      stadiumType,
      matching,
      sportEvent,
      training,
      imagesPath,
      expand
    } = this.data;
    let facility = this.checkedArray(matching);
    let sportType = this.checkedArray(sportEvent);
    let cultivateName = this.checkedArray(training);
    if (app.isNull(sName)) {
      return this.validateDate('场馆名称');
    }
    if (app.isNull(sAddr)) {
      return this.validateDate('场馆地址');
    }
    if (app.isNull(sAddrDesc)) {
      return this.validateDate('场馆详情地址');
    }
    if (app.isNull(contactName)) {
      return this.validateDate('联系人姓名');
    }
    if (app.isNull(contactPhone)) {
      return this.validateDate('联系人电话');
    }
    if (app.isNull(workDay1) || app.isNull(workDay2)) {
      return this.validateDate('工作日营业时间');
    }
    if (app.isNull(dayOff1) || app.isNull(dayOff2)) {
      return this.validateDate('周六周日营业时间');
    }
    if (app.isNull(facility)) {
      return this.validateDate('配套设备');
    }
    if (app.isNull(sportType)) {
      return this.validateDate('运动项目');
    }
    if (app.isNull(cultivateName)) {
      return this.validateDate('培训项目');
    }
    let workDay = workDay1 + '-' + workDay2;
    let dayOff = dayOff1 + '-' + dayOff2;
    console.log(sName, sAddr, sAddrDesc, sAddrLongitude, sAddrLatitude, contactName, contactPhone, workDay, dayOff, businessNature, stadiumType, facility, sportType, cultivateName);
    self.showLoading();
    let params = {
      sName,
      sAddr,
      sAddrDesc,
      sAddrLongitude,
      sAddrLatitude,
      contactName,
      contactPhone,
      workDay,
      dayOff,
      businessNature,
      stadiumType,
      facility,
      sportType,
      cultivateName,
      expand
    }
    let url = "/stadium/addDetails";
    if (self.data.editId != -1) {
      url = '/stadium/updateDetails';
      params.id = self.data.editId;

      let imagesUrl = [];
      imagesPath = imagesPath.map((item) => {
        let indexof = item.indexOf('tmp');
        if (indexof == -1) {
          imagesUrl.push(item);
        }
        if (indexof != -1) {
          return item;
        } else {
          return ''
        }
      });
      params.imagesPath = imagesUrl;
      console.log(imagesPath);
    }

    http.creat(url, params).then(function (data) {
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
      // self.upLoadImage(id,0,idCardFront,0);
      // console.log(imagesPath)
      for (let i = 0; i < imagesPath.length; i++) {
        console.log(imagesPath[i]);
        self.upLoadImage(id, i + 3, imagesPath[i], i);
      };
      

    })
  },

  upLoadImage: function (id, imageType, file, num) {
    console.log(id, imageType, file, num)
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
        console.log(num);
        if (num > 3) {
          self.hideLoading();
          wx.navigateToMiniProgram({
            appId: 'wxeaec887eafb26fca',//小程序appid
            path: 'pages/index/index',//跳转关联小程序app.json配置里面的地址
            extraData: {},
            envVersion: 'release',
          })
          // wx.navigateBack({
          //   delta: 1,
          // })
        }
      }
    })
  },
  validateDate: function (key) {
    let self = this;
    wx.showToast({
      title: key + '不能为空',
      icon: 'none',
      duration: 3000
    })
  },
  checkedArray: function (arr) {
    // console.log(arr)
    let checked = [];
    arr.map((item) => {
      if (item.checked == true) {
        checked.push(item.name)
      }
    })
    return checked;
  },
  chooseImage: function (e) {
    let indexof = e.currentTarget.dataset.index;
    let key = 'imagesPath[' + indexof + ']'
    let self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res);
        console.log(res.tempFilePaths[0]);
        self.setData({
          [key]: res.tempFilePaths[0]
        })
        console.log(self.data.imagesPath)
      },
      fail: function (res) {
        console.log(res)
        // fail
      }
    })
  },
  delImg: function (e) {
    console.log(e);
    let imagesPath = this.data.imagesPath;
    let indexof = e.currentTarget.dataset.index;
    imagesPath.splice(indexof, 1);
    this.setData({
      imagesPath: imagesPath
    });
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
})