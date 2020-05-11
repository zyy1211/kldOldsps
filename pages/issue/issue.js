// pages/issue/issue.js
let util = require('../../utils/util');
let http = require('../../utils/request');
let API = require('../../utils/config.js');
let App = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {

    minDate:new Date().getTime() + (15*60*1000 - ((new Date().getTime()) % (15*60*1000))),
    registrationUptoTime: '',
    registrationUptoTimeStr:'',
    registrationCancelTime:'',
    registrationCancelTimeStr:'',
    activityStartTime:'',
    activityStartTimeStr:'',
    activityEndTime:'',
    activityEndTimeStr:'',
    filter(type, options) {
      if (type === 'minute') {
      // console.log(options)
        return options.filter(option => option % 15 === 0)
      }
      return options;
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      }else if(type === 'day'){
        return `${value}日`;
      }else if(type === 'hour'){
        return `${value}时`;
      }else if(type === 'minute'){
        return `${value}分`;
      }
      return value;
    },
    currentPick:'',
    pickerShow:false,
    dialogAgree: true,
    agree: false,
    defalutTab: [{
        name: '免费提供热茶水',
        checked: false
      },
      {
        name: '免费停车',
        checked: false
      },
      {
        name: '免费提供球',
        checked: false
      },
      {
        name: '免费提供饮用水',
        checked: false
      },
      {
        name: '免费零食',
        checked: false
      }
    ],
    defalutTabName: [
      '免费提供热茶水',
      '免费停车',
      '免费提供球',
      '免费提供饮用水',
      '免费零食',
    ],
    tabActivity: [],
    detailData: '',
    type: '',
    isHidden: true,
    file: '',
    title: '',
    tag: [],

    registrationCancelTime: '',
    activityStartTime: '',
    activityEndTime: '',
    location: '',
    clubName: '',
    specificLocation: '',
    participantsNum: '',
    withPeople: true,
    signIn: false,
    isOpen:true,
    description: 0,
    descDetails: '',
    descImages: [],
    priceMan: '',
    priceWoman: '',

    penalSum: 30,
    initiator: '',
    phoneNum: '',
    vxNum: '',
    isImg: false,
    imagePath: '',
    dialogShow: true,
    buttons: [{
      text: '取消'
    }, {
      text: '确定'
    }],
    tagName: '',
    isVip:false,
    // date1: '',
    // time1: '18:00',
    // date2: '',
    // time2: '18:00',
    // date3: '',
    // time3: '20:00',
    // date4: '',
    // time4: '22:00',
    isPenal: false,
    chargeMode: 1,
    penalList: [...Array(31 - 1).keys()].map(item => 1 + item),
    items: [{
        name: '报名时收费',
        checked: true,
        value: 1
      },
      {
        name: '活动后线下收取',
        checked: false,
        value: 2
      },
      {
        name: '免费',
        checked: false,
        value: 0
      }
    ]
  },
  toActiveType: function () {
    wx.navigateTo({
      url: '../activeType/activeType'
    })
  },
  revice_desc: function () {
    let description = this.data.description === 0 ? 1 : 0;
    this.setData({
      description: description
    })
  },
  chooseImage: function (e) {
    // console.log(e);
    let type = e.currentTarget.dataset.type;
    let count = type === "1" ? 1 : 9;
    let self = this;
    wx.chooseImage({
      count: count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // console.log(res);
        // console.log(type);
        if (type == 1) {
          wx.compressImage({
            src:res.tempFilePaths[0],
            quality: 80,
            success:function(tpm){
              // console.log(tpm.tempFilePath)
              wx.navigateTo({
                // url: '../pageTemplate/cropper/cropper?url=' + res.tempFilePaths[0]
                url: '../pageTemplate/cropper/cropper?url=' +tpm.tempFilePath
              })
            }
          })

          // self.setData({
          //   imagePath: res.tempFilePaths[0],
          //   isImg: true,
          //   file: res.tempFilePaths[0],
          // })
        } else {
          let descImages = self.data.descImages;
          descImages = descImages.concat(res.tempFilePaths);
          // console.log(descImages);
          self.setData({
            descImages: descImages
          })
        };

        // success
      },
      fail: function (res) {
        // console.log(res)
        // fail
      }
    })
  },
  delImages: function (e) {
    let descImages = this.data.descImages;
    let indexof = e.currentTarget.dataset.key;
    descImages.splice(indexof, 1);
    this.setData({
      descImages: descImages
    });
  },
  bindgetphonenumber: function (e) {
    // console.log(e)
    if (e.detail.errMsg == "getPhoneNumber:ok") {

    }
  },
  chooseDefalutTab: function (e) {
    let index = e.currentTarget.dataset.index;
    let value = this.data.defalutTab[index].checked;
    let key = 'defalutTab[' + index + '].checked';
    this.setData({
      [key]: !value
    })
  },
  addtag: function () {
    let self = this;
    self.setData({
      dialogShow: false,
    })
  },
  closeAddModal: function () {
    let self = this;
    self.setData({
      dialogShow: true,
    })
  },
  delTag: function (e) {
    let item = e.currentTarget.dataset.item;
    let tag = this.data.tag;
    let indexof = tag.indexOf(item);
    tag.splice(indexof, 1);
    this.setData({
      tag: tag
    })
  },
  tapDialogButton(e) {
    let self = this;
    let tag = self.data.tag;
    // console.log(self.data.tagName)
    if (self.data.tagName == "") {
      return wx.showToast({
        title: '标签内容不能为空',
        icon: 'none'
      })
    }
    tag.push(self.data.tagName);
    self.setData({
      tag: tag,
    })
    self.setData({
      dialogShow: true,
      tagName: ''
    })
  },

  usernameInput: function (e) {
    this.setData({
      tagName: e.detail.value
    })
    // console.log(e)
  },

  switchChange: function (e) {
    let key = e.currentTarget.dataset.key;
    this.setData({
      [key]: e.detail.value
    })
    // console.log(this.data.signIn, this.data.withPeople,this.data.isOpen)
  },
  bindDate: function (e) {
    let key = e.currentTarget.dataset.key;
    if (key == "title") {
      let value = e.detail.value;
      this.setData({
        [key]: value
      });
      return;
    }
    if (key == 'participantsNum' || key == 'phoneNum') {
      let value = this.validateNumber(e.detail.value);
      this.setData({
        [key]: value
      })
      return;
    }
    if (key == 'priceMan' || key == 'priceWoman' || key == 'vipPriceMan' || key == 'vipPriceWoman') {
      console.log('fsfsfsf')
      let value = this.validateFixed(e.detail.value);
      this.setData({
        [key]: value
      })
      return;
    }
    this.setData({
      [key]: e.detail.value
    })
  },
  bindSelect: function (e) {
    let penalSum = this.data.penalList[e.detail.value]
    this.setData({
      penalSum: penalSum
    })
  },

  bindChooseLocation: function () {
    let self = this;
    self.selectComponent("#authorize").getAuthorizeLocation(function (a) {
      // console.log(self.data.editId);
      if (self.data.editId != -1) {
        let latitude = self.data.addressLatitude;
        let longitude = self.data.addressLongitude;
        wx.chooseLocation({
          type: "gcj02",
          latitude: latitude,
          longitude: longitude,
          success: function (a) {
            // console.log(a);
            self.setData({
              location: a.name,
              addressLongitude: a.longitude,
              addressLatitude: a.latitude
            })
          }
        });
        return;
      } else {
        wx.chooseLocation({
          type: "gcj02",
          success: function (a) {
            // console.log(a);
            self.setData({
              location: a.name,
              addressLongitude: a.longitude,
              addressLatitude: a.latitude
            })
          }
        });
      }
    });
  },

  radioChange: function (e) {
    this.setData({
      chargeMode: e.detail.value
    })
    // console.log(e)
  },
  submit: function () {
    let self = this;
    let agree = self.data.agree;
    if (!agree) {
      return wx.showToast({
        title: '请阅读本平台协议，勾选同意后方可发布活动',
        icon: 'none',
      })
    }
    let {
      type,
      file,
      tag,
      title,
      // date1,
      // date2,
      // date3,
      // date4,
      // time1,
      // time2,
      // time3,
      // time4,
      registrationUptoTime,
      registrationCancelTime,
      activityStartTime,
      activityEndTime,

      location,
      addressLongitude,
      addressLatitude,
      clubName,
      specificLocation,
      participantsNum,
      withPeople,
      signIn,
      isOpen,
      chargeMode,
      description,
      descDetails,
      descImages,
      initiator,
      phoneNum,
      vxNum,
      priceMan,
      priceWoman,
      isPenal,
      penalSum,
      vipPriceMan,
      vipPriceWoman,
      isVip
    } = this.data;
    let expand = type.sportName;
    let editId = self.data.editId;
    type = type.id;
    if (App.isNull(type)) {
      return wx.showToast({
        title: '活动类型不能为空',
        icon: 'none'
      })
    } else if (file === '' && editId == -1) {
      return wx.showToast({
        title: '图片不能为空',
        icon: 'none'
      })
    } else if (title === '') {
      return wx.showToast({
        title: '标题不能为空',
        icon: 'none'
      })
    } else if (App.isNull(registrationUptoTime)) {
      return wx.showToast({
        title: '报名截止时间不能为空',
        icon: 'none'
      })
    } else if (App.isNull(registrationCancelTime)) {
      return wx.showToast({
        title: '取消报名截止时间不能为空',
        icon: 'none'
      })
    } else if (App.isNull(activityStartTime)) {
      return wx.showToast({
        title: '活动开始时间不能为空',
        icon: 'none'
      })
    } else if (App.isNull(activityEndTime)) {
      return wx.showToast({
        title: '活动结束时间不能为空',
        icon: 'none'
      })
    } else if (location === '') {
      return wx.showToast({
        title: '活动地址不能为空',
        icon: 'none'
      })
    } else if (clubName === '') {
      return wx.showToast({
        title: '场馆名称不能为空',
        icon: 'none'
      })
    } else if (specificLocation === '') {
      return wx.showToast({
        title: '场地号不能为空',
        icon: 'none'
      })
    } else if (participantsNum === '') {
      return wx.showToast({
        title: '活动总人数不能为空',
        icon: 'none'
      })
    } else if ((description == 0 && descDetails == '') || (description == 1 && descImages.length == 0)) {

      return wx.showToast({
        title: '活动详情不能为空',
        icon: 'none'
      })
    } else if (initiator === '') {
      return wx.showToast({
        title: '发起人姓名不能为空',
        icon: 'none'
      })
    } else if (phoneNum === '' || phoneNum.length != 11) {
      return wx.showToast({
        title: '请输入正确的联系电话',
        icon: 'none'
      })
    } else if (chargeMode != 0) {
      if(isVip && (priceWoman == '' || priceMan == '' || App.isNull(vipPriceWoman) || App.isNull(vipPriceMan))){
        return wx.showToast({
          title: '非会员金额、会员金额不能为空',
          icon: 'none'
        })
      }
      if(!isVip && (priceWoman == '' || priceMan == '')){
        return wx.showToast({
          title: '收费金额不能为空',
          icon: 'none'
        })
      }
    }
    let {
      isvali
      // registrationUptoTime,
      // registrationCancelTime,
      // activityStartTime,
      // activityEndTime
    } = self.validateDate(registrationUptoTime, registrationCancelTime, activityStartTime, activityEndTime);

    // console.log(isvali)
    if (!isvali) {
      return;
    }
    self.data.defalutTab.forEach(item => {
      // console.log(item);
      if (item.checked) {
        tag.push(item.name);
      }
    })
    let params = {
      type,
      expand,
      file,
      tag,
      title,
      registrationUptoTime,
      registrationCancelTime,
      activityStartTime,
      activityEndTime,
      location,
      addressLongitude,
      addressLatitude,
      clubName,
      specificLocation,
      participantsNum,
      withPeople,
      signIn,
      isOpen,
      chargeMode,
      description,
      descDetails,
      descImages,
      initiator,
      phoneNum,
      vxNum,
      priceMan,
      priceWoman,
      isPenal,
      penalSum,
      vipPriceMan,
      vipPriceWoman,
      isVip
    };
    let url = '/activities/create';
    let modalContent = '发布后的活动经过审核后可以在首页展示，用户可在我的发布中追踪审核状态。确定要发布活动？'
    let uploadDescImages = [];
    let urlDescImages = [];
    if (self.data.editId != -1) {
      modalContent = '确定要重新发布活动？';
      // console.log(self.data.draft)
      // console.log(self.data.draft != "true")
      if(self.data.draft != "true"){
        url = "/activities/updateActivities";
        modalContent = '确定要修改活动？'
      }
      descImages.forEach(item => {
        if (item.indexOf('tmp/') != -1 || item.indexOf('wxfile') != -1) {
          uploadDescImages.push(item)
        } else {
          let itemed = item.split('/images');
          urlDescImages.push(itemed[1])
        }
      })
      if(self.data.draft != "true"){
        params.id = self.data.editId;
      }
      params.descImages = urlDescImages;
    }
    // console.log(params);
    wx.showModal({
      title: '提示',
      content: modalContent,
      success(res) {
        if (res.confirm) {
          // console.log('用户点击确定');
          // console.log(params);
          self.showLoading();
          if (self.data.editId != -1) {
            let imagePath = self.data.imagePath;
            if (file.indexOf('tmp/') == -1 || file.indexOf('wxfile') != -1) {
              params.imageUri = imagePath.split('/images')[1];
            } else {
              params.imageUri = '';
            }
          }
          http.creat(url, params).then(function (data) {
            if (data.data.status != 200) {
              self.hideLoading();
              wx.showToast({
                title: data.data.status + data.data.message,
                icon: 'none',
                duration: 3000
              })
              return;
            };
            let token = wx.getStorageSync('token');
            let message = data.data.message;
            if (self.data.editId == -1) {
              wx.uploadFile({
                url: API.API_HOST + '/activities/upLoadImages/' + message + '/0/0',
                header: {
                  'token': token,
                },
                filePath: file,
                name: 'image',
                success(res) {
                  // console.log(res);
                  if (params.description == 1) {
                    self.uploading({
                      url: API.API_HOST + '/activities/upLoadImages/' + message + '/1',
                      path: descImages,
                    })
                  } else {
                    self.hideLoading();
                    var pages = getCurrentPages();
                    var prevPage = pages[pages.length - 2];
                    prevPage.reloadPage();
                    wx.navigateBack({
                      delta: 1,
                    })
                  }
                }
              })
            } else {
              if (file == '') {
                if (params.description == 1 && uploadDescImages.length > 0) {
                  self.uploading({
                    url: API.API_HOST + '/activities/upLoadImages/' + message + '/1',
                    path: uploadDescImages,
                  })
                } else {
                  self.hideLoading();
                  var pages = getCurrentPages();
                  var prevPage = pages[pages.length - 3];
                  if(self.data.draft == "true" ){
                    prevPage = pages[pages.length - 2];
                  }
                  prevPage.reloadPage();
                  wx.navigateBack({
                    delta: 2,
                  })
                }
              } else {
                wx.uploadFile({
                  url: API.API_HOST + '/activities/upLoadImages/' + message + '/0/0',
                  header: {
                    'token': token,
                  },
                  filePath: file,
                  name: 'image',
                  success(res) {
                    if (params.description == 1 && uploadDescImages.length > 0) {
                      self.uploading({
                        url: API.API_HOST + '/activities/upLoadImages/' + message + '/1',
                        path: uploadDescImages,
                      })
                    } else {
                      self.hideLoading();
                      var pages = getCurrentPages();
                      var prevPage = pages[pages.length - 3];
                      if(self.data.draft == "true" ){
                        prevPage = pages[pages.length - 2];
                      }
                      prevPage.reloadPage();
                      wx.navigateBack({
                        delta: 2,
                      })
                    }
                  }
                })
              }
            }
          });
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  uploading: function (data) {
    let self = this;
    let token = wx.getStorageSync('token');
    let that = this;
    let isLast = i == (data.path.length - 1) ? 1 : 0;
    let i = data.i ? data.i : 0, //当前上传的哪张图片
      success = data.success ? data.success : 0, //上传成功的个数
      fail = data.fail ? data.fail : 0; //上传失败的个数
      // console.log(data.url + '/' + isLast)
      // console.log(data.path[i])
    wx.uploadFile({
      url: data.url + '/' + isLast,
      header: {
        'token': token,
      },
      filePath: data.path[i],
      name: 'image',
      formData: null,
      success: (resp) => {
        // console.log(resp)
        // console.log(i);
        if (resp.statusCode == 200) {
          success++;
        } else {
          fail++;
        }
      },
      fail: (res) => {
        fail++;
        // console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        this.setData({
          isHidden: false
        });
        i++;
        if (i == data.path.length) {
          // console.log('执行完毕');
          self.hideLoading();
          wx.showToast({
            title: '成功：' + success + " 失败：" + fail,
            icon: 'none',
            duration: 3000
          });
          self.hideLoading();
          var pages = getCurrentPages();

          if (self.data.editId == -1) {
            var prevPage = pages[pages.length - 2];
            prevPage.reloadPage();
            wx.navigateBack({
              delta: 1,
            })
          } else {
            var prevPage = pages[pages.length - 3];
            if(self.data.draft == "true" ){
              prevPage = pages[pages.length - 2];
            }
            prevPage.reloadPage();
            wx.navigateBack({
              delta: 2,
            })
          }

        } else {
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploading(data);
        }
      }
    });
  },
  getDetail: function (callback) {
    let self = this;
    http.get('/activities/selectActivitiesById?id=' + self.data.editId, '').then(function (result) {
      // console.log(result);
      self.setData({
        detailData: result.data
      })
      self.editData();
      callback();
    })
  },
  editData: function () {
    let self = this;
    let {
      type,
      expand,
      imageUri,
      title,
      tag,
      location,
      addressLongitude,
      addressLatitude,
      clubName,
      specificLocation,
      participantsNum,
      initiator,
      phoneNum,
      vxNum,
      description,
      descDetails,
      descImages,
      registrationUptoTime,
      registrationCancelTime,
      activityStartTime,
      activityEndTime,
      isOpen,

    } = this.data.detailData.message.Activities;
    let {
      chargeMode,
      priceMan,
      priceWoman,
      isVip,
      vipPriceMan,
      vipPriceWoman,
      isPenal,
      penalSum,
      signIn,
      withPeople,
    } = this.data.detailData.message.ActivitiesCondition;
    isVip = App.isNull(isVip) ? false : isVip;
    console.log(vipPriceMan);
    vipPriceMan = App.isNull(vipPriceMan) ? 0 : vipPriceMan;
    vipPriceWoman = App.isNull(vipPriceWoman) ? 0 : vipPriceWoman;
  
    type = {
      id: type,
      sportName: expand
    }
    descImages = descImages.map(element => {
      // console.log(API.img_host + element);
      return element = API.img_host + element;
    });
    let isImg = true;
    let imagePath = API.img_host + imageUri;
    let chargeKey;
    if (chargeMode == 0) {
      // console.log(0);
      chargeKey = 'items[2].checked'
    } else if (chargeMode == 2) {
      chargeKey = 'items[1].checked'
    } else {
      chargeKey = 'items[0].checked'
    }
    this.setData({
      [chargeKey]: true
    });
    let tagList = tag.split(',');
    if (tagList[0] == '') {
      tagList = [];
    }
    tag = [];
    let defalutTabName = self.data.defalutTabName;
    let defalutTab = self.data.defalutTab;
    tagList.forEach((item) => {
      let indexOf = defalutTabName.indexOf(item)
      if (indexOf != -1) {
        defalutTab[indexOf].checked = true;
      } else {
        tag.push(item)
      }
    })
    // let date1 = registrationUptoTime.split(' ')[0];
    // let time1 = registrationUptoTime.split(' ')[1];
    // let date2 = registrationCancelTime.split(' ')[0];
    // let time2 = registrationCancelTime.split(' ')[1];
    // let date3 = activityStartTime.split(' ')[0];
    // let time3 = activityStartTime.split(' ')[1];
    // let date4 = activityEndTime.split(' ')[0];
    // let time4 = activityEndTime.split(' ')[1];

    let registrationUptoTimeStr = util.formatStamp(registrationUptoTime).time;
    let registrationCancelTimeStr = util.formatStamp(registrationCancelTime).time;
    let activityStartTimeStr = util.formatStamp(activityStartTime).time;
    let activityEndTimeStr = util.formatStamp(activityEndTime).time;
    this.setData({
      defalutTab,
      type,
      isImg,
      imagePath,
      title,
      tag,
      registrationUptoTime,
      registrationCancelTime,
      activityStartTime,
      activityEndTime,
      registrationUptoTimeStr,
      registrationCancelTimeStr,
      activityStartTimeStr,
      activityEndTimeStr,
      // date1,
      // time1,
      // date2,
      // time2,
      // date3,
      // time3,
      // date4,
      // time4,
      location,
      addressLongitude,
      addressLatitude,
      clubName,
      specificLocation,
      participantsNum,
      withPeople,
      signIn,
      isOpen,
      chargeMode,
      priceMan,
      priceWoman,
      isPenal,
      penalSum,
      initiator,
      phoneNum,
      vxNum,
      description,
      descDetails,
      descImages,
      agree:true,
      vipPriceMan,
      vipPriceWoman,
      isVip
    })
  },
  touchHandler: function () {
    // console.log('fs')
    return;
  },
  showLoading: function () {
    this.setData({
      isHidden: false
    });
    wx.showLoading({
      title: "提交中",
      mask: true
    });
  },
  hideLoading: function () {
    this.setData({
      isHidden: true
    });
    wx.hideLoading();
  },
  validateNumber(val) {
    return val.replace(/\D/g, '')
  },
  validateFixed(val) {
    let value;
    value = val.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
    value = value.replace(/^\./g, ""); //验证第一个字符是数字
    value = value.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
    value = value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    return value;
  },
  validateDate: function (rgs, rge, ats, ate) {
    // let registrationUptoTime = date1 + ' ' + time1; 
    // let registrationCancelTime = date2 + ' ' + time2; 
    // let activityStartTime = date3 + ' ' + time3; 
    // let activityEndTime = date4 + ' ' + time4;
    // if(time1.length < 6){
    //   registrationUptoTime = registrationUptoTime + ':00';
    //   registrationCancelTime = registrationCancelTime + ':00';
    //   activityStartTime = activityStartTime + ':00';
    //   activityEndTime = activityEndTime + ':00';
    // }
    // let ats = toParse(activityStartTime);
    // let ate = toParse(activityEndTime);
    // let rgs = toParse(registrationUptoTime);
    // let rge = toParse(registrationCancelTime);
    let datestr = Date.parse(new Date());
    // console.log(activityStartTime);
    // console.log(ats);
    // console.log(new Date());
    // console.log(datestr);
    if (datestr > ats) {
      wx.showToast({
        title: '活动开始时间一定要晚于当前时间',
        icon: 'none'
      })
      return {
        isvali: false
      }
    }else if(ats > ate) {
      wx.showToast({
        title: '活动开始时间不能晚于结束时间',
        icon: 'none'
      })
      return {
        isvali: false
      }
    } else if (rgs > ats) {
      wx.showToast({
        title: '活动报名截止时间不能晚于活动开始时间',
        icon: 'none'
      })
      return {
        isvali: false
      }
    } else if (rge > rgs) {
      wx.showToast({
        title: '取消报名截止时间不能晚于活动报名截止时间',
        icon: 'none'
      })
      return {
        isvali: false
      }
    }

    // function toParse(date) {
    //   let newDate = date.replace(/-/g, '/');
    //   return Date.parse(newDate);
    // }
    return {
      isvali: true,
    };
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(new Date().getTime() + (15*60*1000 - ((new Date().getTime()) % (15*60*1000))))
    let self = this;
    let userInfo = App.getUserInfo();
    self.setData({
      editId: options.id,
      draft:options.draft,
      phoneNum:userInfo.phoneNum,
      initiator:userInfo.nickName
    })
    if (options.id != -1) {
      wx.setNavigationBarTitle({
        title: '编辑活动'
      })
      self.getDetail(function(){  });
    }
  },

  onChange: function () {
    let isPenal = this.data.isPenal;
    this.setData({
      isPenal: !isPenal
    })
  },
  getphonenumber: function (e) {
    let self = this;
    let params = {
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv
    }
    http.post('/member/getPhone', params).then(function (res) {
      console.log(res)
      let phone = JSON.parse(res.data.message).phoneNumber;
      self.setData({
        phoneNum:phone
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
  _touchmove: function () {},
  showPicker:function(event){
    // console.log(event);
    let key = '';
    if(!App.isNull(event)){
      key = event.currentTarget.dataset.key;
    }
    this.setData({
      pickerShow:!this.data.pickerShow,
      currentPick:key
    })
  },
  onConfirm:function(event){
    let key = this.data.currentPick;
    let keyStr = key + 'Str';
    let self = this;
    self.showPicker();
    console.log(event.detail)
    let time = util.formatStamp(event.detail);
    this.setData({
      [key]:event.detail,
      [keyStr]:time.time
    })
  }
})