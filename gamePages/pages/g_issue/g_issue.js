let util = require('../../../utils/util');
let http = require('../../../utils/request');
let API = require('../../../utils/config.js');
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    isImg: false,
    imagePath: '',
    id: -1,
    edit:-1,
    singleName: [], //自定义单项赛
    single: [],
    teamName: [], //自定义团体赛
    team: [],
    dialogShow: true,
    info: [], //自定义标签
    infoName: [],
    file: '',
    freeList: [{
        name: '姓名',
        id: 1
      },
      {
        name: '证件类型',
        id: 2
      },
      {
        name: '证件号码',
        id: 3
      },
      {
        name: '性别',
        id: 4
      },
      {
        name: '手机号',
        id: 5
      }
    ],
    detailsType: "0",
    detailsDesc: '',
    descImagesPath: [],
    penalSum: 15,
    isHidden: true,

    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),

    hidden_date: true,
    value1: '添加项目',
    option_type: [{
        text: '校园联赛',
        value: "0"
      },
      {
        text: '企业联赛',
        value: "1"
      },
      {
        text: '民间联赛',
        value: "2"
      },
      {
        text: '官方联赛',
        value: "3"
      },
      {
        text: '机构联赛',
        value: "4"
      },
      {
        text: '业余联赛',
        value: "5"
      }
    ],
    competitionRule: "3",
    isOpen: false,
    isSignIn: false,
    isVisibleList: false,
    canCancel: false,
    isPenal: false,

  },

  submit: function () {
    let self = this;
    let {
      competitionTypeObj,
      file,
      name,
      competitionRule,
      sponsor,
      organizer,
      registrationDeadline,
      listPublicityTime,
      drawTime,
      drawPublicityTime,
      beginTime,
      endTime,
      isOpen,
      isSignIn,
      isVisibleList,
      canCancel,
      isPenal,
      penalSum,
      cancelTime,
      longitude,
      latitude,
      location,
      stadiumName,
      detailsType,
      detailsDesc,
      linkmanName,
      linkmanPhone,
      linkmanVx,
      info,
      team,
      single,
      descImagesPath,
      image

    } = this.data;

    if (App.isNull(competitionTypeObj)) {
      return wx.showToast({
        title: '赛事类型不能为空',
        icon: 'none'
      })
    } else if (App.isNull(file) && App.isNull(image)) {
      return wx.showToast({
        title: '图片不能为空',
        icon: 'none'
      })
    } else if (App.isNull(name)) {
      return wx.showToast({
        title: '标题不能为空',
        icon: 'none'
      })
    } else if (App.isNull(sponsor)) {
      return wx.showToast({
        title: '主办方不能为空',
        icon: 'none'
      })
    } else if (App.isNull(registrationDeadline)) {
      return wx.showToast({
        title: '报名截至时间不能为空',
        icon: 'none'
      })
    } else if (App.isNull(listPublicityTime)) {
      return wx.showToast({
        title: '名单公布时间不能为空',
        icon: 'none'
      })
    } else if (App.isNull(drawTime)) {
      return wx.showToast({
        title: '抽签日期时间不能为空',
        icon: 'none'
      })
    } else if (App.isNull(drawPublicityTime)) {
      return wx.showToast({
        title: '抽签公布时间不能为空',
        icon: 'none'
      })
    } else if (App.isNull(beginTime)) {
      return wx.showToast({
        title: '比赛开始时间不能为空',
        icon: 'none'
      })
    } else if (App.isNull(endTime)) {
      return wx.showToast({
        title: '比赛结束时间不能为空',
        icon: 'none'
      })
    } else if (App.isNull(cancelTime)) {
      return wx.showToast({
        title: '退款(退赛)截止时间不能为空',
        icon: 'none'
      })
    } else if (App.isNull(location)) {
      return wx.showToast({
        title: '举办地址不能为空',
        icon: 'none'
      })
    } else if (App.isNull(stadiumName)) {
      return wx.showToast({
        title: '场馆名称不能为空',
        icon: 'none'
      })
    } else if (App.isNull(linkmanName)) {
      return wx.showToast({
        title: '联系人姓名不能为空',
        icon: 'none'
      })
    } else if (App.isNull(linkmanPhone)) {
      return wx.showToast({
        title: '联系人电话不能为空',
        icon: 'none'
      })
    } else if (App.isNull(linkmanVx)) {
      return wx.showToast({
        title: '联系人微信号码不能为空',
        icon: 'none'
      })
    } else if ((detailsType == "0" && detailsDesc == '') || (detailsType == "1" && descImagesPath.length == 0)) {
      return wx.showToast({
        title: '赛事详情不能为空',
        icon: 'none'
      })
    } else if (team.length == 0 && single.length == 0) {
      return wx.showToast({
        title: '请添加单项赛或团体赛',
        icon: 'none'
      })
    }
    let {
      isvali
    } = self.validateDate(registrationDeadline, listPublicityTime, drawTime, drawPublicityTime, beginTime, endTime);
    if (!isvali) {
      return;
    }
    let competitionType = competitionTypeObj.sportName;
    let params = {
      competitionType,
      file,
      name,
      competitionRule,
      sponsor,
      organizer,
      registrationDeadline,
      listPublicityTime,
      drawTime,
      drawPublicityTime,
      beginTime,
      endTime,
      isOpen,
      isSignIn,
      isVisibleList,
      canCancel,
      isPenal,
      penalSum,
      cancelTime,
      longitude,
      latitude,
      location,
      stadiumName,
      detailsType,
      detailsDesc,
      linkmanName,
      linkmanPhone,
      linkmanVx,
      info,
      team,
      single,
      descImagesPath,
      image
    }
    console.log(params);
    let url = '/competition/save';
    let modalContent = '发布后的赛事经过审核后可以在首页展示，用户可在我的发布中追踪审核状态。确定要发布赛事？'
    let uploadDescImages = [];
    let urlDescImages = [];
    descImagesPath.forEach(item => {
      if (item.indexOf('tmp/') != -1 || item.indexOf('wxfile') != -1) {
        uploadDescImages.push(item)
      } else {
        let itemed = item.split('/images');
        urlDescImages.push(itemed[1])
      }
    })
    wx.showModal({
      title: '提示',
      content: modalContent,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          console.log(params);
          self.showLoading();
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
            if (!App.isNull(file)) {
              wx.uploadFile({
                url: API.API_HOST + '/competition/upLoadImages/' + message + '/0',
                header: {
                  'token': token,
                },
                filePath: file,
                name: 'image',
                success(res) {}
              })
            }
            if (uploadDescImages.length != 0) {
              self.uploading({
                url: API.API_HOST + '/competition/upLoadImages/' + message + '/1',
                path: uploadDescImages,
              })
            } else {
              self.hideLoading();
              self.back();
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 1,
    })
    
  },
  submit_soft: function (e) {
    let self = this;
    let key = e.currentTarget.dataset.key;
    let {
      competitionTypeObj,
      name,
      competitionRule,
      sponsor,
      organizer,
      registrationDeadline,
      listPublicityTime,
      drawTime,
      drawPublicityTime,
      beginTime,
      endTime,
      isOpen,
      isSignIn,
      isVisibleList,
      canCancel,
      isPenal,
      penalSum,
      cancelTime,
      longitude,
      latitude,
      location,
      stadiumName,
      detailsType,
      detailsDesc,
      linkmanName,
      linkmanPhone,
      linkmanVx,
      info,
      team,
      single,
      id,
      descImagesPath,
      file,

    } = this.data;
    let competitionType = App.isNull(competitionTypeObj) ? '' : competitionTypeObj.sportName;
    let params = {
      competitionType,
      name,
      competitionRule,
      sponsor,
      organizer,
      registrationDeadline,
      listPublicityTime,
      drawTime,
      drawPublicityTime,
      beginTime,
      endTime,
      isOpen,
      isSignIn,
      isVisibleList,
      canCancel,
      isPenal,
      penalSum,
      cancelTime,
      longitude,
      latitude,
      location,
      stadiumName,
      detailsType,
      detailsDesc,
      linkmanName,
      linkmanPhone,
      linkmanVx,
      info,
      team,
      single,
      id,
      descImagesPath,
      file
    }
    console.log(detailsType);
    console.log(params);


    for (let it in params) {
      if (App.isNull(params[it])) {
        params[it] = '';
      }
    }
    console.log(params);
    // console.log(params);
    let url = '/competition/draft';
    let modalContent = '确定要将赛事保存为草稿？';
    if(key != -1){
      url = '/competition/updateCompetition';
      modalContent = '确定要修改赛事？';
    }

    let uploadDescImages = [];
    let urlDescImages = [];
    descImagesPath.forEach(item => {
      console.log(item);
      if (item.indexOf('tmp/') != -1 || item.indexOf('wxfile') != -1) {
        uploadDescImages.push(item)
      } else {
        let itemed = item.split('/images');
        urlDescImages.push(itemed[1])
      }
    })
    params.descImagesPath = urlDescImages;
    wx.showModal({
      title: '提示',
      content: modalContent,
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          console.log(params);
          self.showLoading();
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
            if (!App.isNull(file)) {
              wx.uploadFile({
                url: API.API_HOST + '/competition/upLoadImages/' + message + '/0',
                header: {
                  'token': token,
                },
                filePath: file,
                name: 'image',
                success(res) {
                  console.log('上传' + JSON.stringify(res))
                }
              })
            }
            if (uploadDescImages.length != 0) {
              console.log('不为0')
              self.uploading({
                url: API.API_HOST + '/competition/upLoadImages/' + message + '/1',
                path: uploadDescImages,
              })
            } else {
              console.log('为0')
              self.hideLoading();
              self.back();
            }
          });
        } else if (res.cancel) {
          console.log('用户点击取消')
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

      console.log('上传图片')

    wx.uploadFile({
      // url: data.url + '/' + isLast,
      url: data.url,
      header: {
        'token': token,
      },
      filePath: data.path[i],
      name: 'image',
      formData: null,
      success: (resp) => {
        console.log('上传成功')
        console.log(resp)
        console.log(i);
        if (resp.statusCode == 200) {
          success++;
        } else {
          fail++;
        }
      },
      fail: (res) => {
        fail++;
        console.log('fail:' + i + "fail:" + fail);
      },
      complete: () => {
        this.setData({
          isHidden: false
        });
        i++;
        if (i == data.path.length) {
          console.log('执行完毕');
          self.hideLoading();
          wx.showToast({
            title: '成功：' + success + " 失败：" + fail,
            icon: 'none',
            duration: 3000
          });
          self.hideLoading();
          var pages = getCurrentPages();
          self.back();
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
  bindDateFile: function (e) {
    let key = e.currentTarget.dataset.key;
    let value = e.detail.value;
    this.setData({
      [key]: e.detail.value
    })
  },
  bindDate: function (e) {
    console.log(e);
    let key = e.currentTarget.dataset.key;
    let value = e.detail
    this.setData({
      [key]: value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    let userInfo = App.getUserInfo();
    console.log(userInfo)
    self.setData({
      id: options.id,
      edit:options.id,
      able: options.able,
      linkmanPhone: userInfo.phoneNum,
      linkmanName: userInfo.nickName
    })
    console.log(options)
    if (self.data.edit != -1) {
      self.getDetail();
      wx.setNavigationBarTitle({
        title: '编辑赛事'
      })
    } else {
      self.getSoft();
    }
  },
  // 获取详情
  getDetail: function (callback) {
    let self = this;
    http.get('/competition/queryDescById?id=' + self.data.id, '').then(function (result) {
      console.log(result);
      let message = result.data.message;
      self.editData(message);
    })
  },
  getSoft: function () {
    let self = this;
    http.get('/competition/queryDraft', '').then(function (result) {
      // console.log(result);
      let message = result.data.message;
      self.editData(message);
    })
  },
  editData: function (message) {
    let self = this;
    if (!App.isNull(message)) {
      let {
        id,
        competitionType,
        image,
        name,
        competitionRule,
        sponsor,
        organizer,
        registrationDeadline,
        listPublicityTime,
        drawTime,
        drawPublicityTime,
        beginTime,
        endTime,
        isOpen,
        isSignIn,
        isVisibleList,
        canCancel,
        isPenal,
        penalSum,
        cancelTime,
        longitude,
        latitude,
        location,
        stadiumName,
        detailsType,
        detailsDesc,
        linkmanName,
        linkmanPhone,
        linkmanVx,

      } = message.competition;
      let competitionTypeObj = {
        id: competitionType,
        sportName: competitionType
      };

      if (!App.isNull(image)) {
        self.setData({
          isImg: true
        })
      }
      let imagePath = API.img_host + image;
      let team = [],
        teamName = [],
        single = [],
        singleName = [],
        info = [],
        infoName = [],
        descImagesPath = [];

      let registrationDeadlineName = '';
      let listPublicityTimeName  = '';
      let drawTimeName = '';
      let drawPublicityTimeName = '';
      let beginTimeName = '';
      let endTimeName = '';
      let cancelTimeName = '';
      if(!App.isNull(registrationDeadline)){
        registrationDeadlineName = util.formatStamp(registrationDeadline).time;
      }
      if(!App.isNull(listPublicityTime)){
        listPublicityTimeName = util.formatStamp(listPublicityTime).time;
      }
      if(!App.isNull(drawTime)){
        drawTimeName = util.formatStamp(drawTime).time;
      }
      if(!App.isNull(drawPublicityTime)){
        drawPublicityTimeName = util.formatStamp(drawPublicityTime).time;
      }
      
      if(!App.isNull(beginTime)){
        beginTimeName = util.formatStamp(beginTime).time;
      }
      if(!App.isNull(endTime)){
        endTimeName = util.formatStamp(endTime).time;
      }
      if(!App.isNull(cancelTime)){
        cancelTimeName = util.formatStamp(cancelTime).time;
      }
      
      message.teamEvents.forEach(item => {
        team.push(item.id);
        teamName.push({
          id: item.id,
          name: item.eventName,
          eventType:item.eventType,
          minAge:item.minAge,
          maxAge:item.maxAge
        });
      });
      message.singleEvents.forEach(item => {
        single.push(item.id)
        singleName.push({
          id: item.id,
          name: item.eventName,
          eventType:item.eventType,
          minAge:item.minAge,
          maxAge:item.maxAge
        })
      })
      message.informations.forEach(item => {
        info.push(item.id)
        infoName.push({
          id: item.id,
          name: item.information
        })
      })
      message.images.forEach(item => {
        descImagesPath.push(API.img_host + item.descImagesPath)
      })
      self.setData({
        competitionType,
        competitionTypeObj,
        image,
        imagePath,
        name,
        competitionRule,
        sponsor,
        organizer,
        registrationDeadline,
        listPublicityTime,
        drawTime,
        drawPublicityTime,
        beginTime,
        endTime,
        cancelTime,
        registrationDeadlineName,
        listPublicityTimeName,
        drawTimeName,
        drawPublicityTimeName,
        beginTimeName,
        endTimeName,
        cancelTimeName,

        isOpen,
        isSignIn,
        isVisibleList,
        canCancel,
        isPenal,
        penalSum,

        longitude,
        latitude,
        location,
        stadiumName,
        detailsType,
        detailsDesc,
        linkmanName,
        linkmanPhone,
        linkmanVx,
        id,
        team,
        single,
        info,
        teamName,
        singleName,
        infoName,
        descImagesPath,

      });
      console.log(self.data);
    }
  },

  // 类型页面
  toActiveType: function () {
    wx.navigateTo({
      url: '/pages/activeType/activeType?type=game'
    })
  },
  onChange: function (e) {
    let key = e.currentTarget.dataset.key;
    let value = e.detail;
    this.setData({
      [key]: value
    })
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
    // console.log(hidden_date)
    if (hidden_date) {
      // console.log('fsfs')
      let key = e.currentTarget.dataset.key;
      // console.log(key)

      this.setData({
        currentKey: key
      })
    }
  },
  confirm: function (e) {
    this.showDate();
    let currentKey = this.data.currentKey;
    let value = (util.formatStamp(e.detail)).time;
    this.setData({
      [currentKey]: e.detail,
      [currentKey + 'Name']: value,
    })

  },
  // 选择图片
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
            src: res.tempFilePaths[0],
            quality: 80,
            success: function (tpm) {
              // console.log(tpm.tempFilePath)
              wx.navigateTo({
                // url: '../pageTemplate/cropper/cropper?url=' + res.tempFilePaths[0]
                url: '/pages/pageTemplate/cropper/cropper?url=' + tpm.tempFilePath
              })
            }
          })
        } else {
          let descImagesPath = self.data.descImagesPath;
          descImagesPath = descImagesPath.concat(res.tempFilePaths);
          console.log(descImagesPath);
          self.setData({
            descImagesPath: descImagesPath
          })
        };

        // success
      },
      fail: function (res) {
        console.log(res)
        // fail
      }
    })
  },
  // 地址
  bindChooseLocation: function () {
    let self = this;
    self.selectComponent("#authorize").getAuthorizeLocation(function (a) {
      // console.log(self.data.id);
      if (self.data.id != -1) {
        let latitude = self.data.latitude;
        let longitude = self.data.longitude;
        wx.chooseLocation({
          type: "gcj02",
          latitude: latitude,
          longitude: longitude,
          success: function (a) {
            console.log(a);
            self.setData({
              location: a.name,
              longitude: a.longitude,
              latitude: a.latitude
            })
          }
        });
        return;
      } else {
        wx.chooseLocation({
          type: "gcj02",
          success: function (a) {
            console.log(a);
            self.setData({
              location: a.name,
              longitude: a.longitude,
              latitude: a.latitude
            })
          }
        });
      }
    });
  },
  // 详情转换
  revice_desc: function () {
    let detailsType = this.data.detailsType == "0" ? "1" : "0";
    this.setData({
      detailsType: detailsType
    })
  },
  // 删除图片
  delImages: function (e) {
    let descImagesPath = this.data.descImagesPath;
    let indexof = e.currentTarget.dataset.key;
    descImagesPath.splice(indexof, 1);
    this.setData({
      descImagesPath: descImagesPath
    });
  },
  // 添加标签
  addtag: function () {
    wx.navigateTo({
      url: '/gamePages/pages/component/addTag/addTag'
    })
  },
  deltag: function (e) {
    let index = e.currentTarget.dataset.index;
    let {
      infoName,
      info
    } = this.data;
    infoName.splice(index, 1)
    info.splice(index, 1)
    this.setData({
      infoName,
      info
    })
  },
  delSingle:function(e){
    let index = e.currentTarget.dataset.index;
    let {
      singleName,
      single
    } = this.data;
    singleName.splice(index, 1)
    single.splice(index, 1)
    this.setData({
      singleName,
      single
    })
  },
  delTeam:function(e){
    let index = e.currentTarget.dataset.index;
    let {
      teamName,
      team
    } = this.data;
    teamName.splice(index, 1)
    team.splice(index, 1)
    this.setData({
      teamName,
      team
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
      let linkmanPhone = JSON.parse(res.data.message).phoneNumber;
      self.setData({
        linkmanPhone: linkmanPhone
      });
      App.setPhone(linkmanPhone);
    })
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
  toSingle: function (e) {
    let key = e.currentTarget.dataset.key;
    let id = e.currentTarget.dataset.id;
    let pas = '';
    if(key == "1"){
      pas = '?id=' + id
    }
    wx.navigateTo({
      url: '../add_single/add_single' + pas,
    })
  },
  toGroup: function (e) {
    let key = e.currentTarget.dataset.key;
    let id = e.currentTarget.dataset.id;
    let pas = '';
    if(key == "1"){
      pas = '?id=' + id
    }
    wx.navigateTo({
      url: '../add_group/add_group' + pas,
    })
  },
  touchHandler: function () {
    // console.log('fs')
    return;
  },
  validateDate: function (st1, st2, st3, st4, st5, st6) {
    console.log(st1, st2, st3, st4, st5, st6);
    if (st1 < st2 < st3 < st4 < st5 < st6) {
      return {
        isvali: true,
      };
    } else {
      wx.showToast({
        title: '时间点顺序应该为：比赛结束时间>比赛开始时间>抽签公示>比赛抽签>名单公示>截止报名',
        icon: 'none'
      })
    }
  }
})