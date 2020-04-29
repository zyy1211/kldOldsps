let util = require('../../../utils/util');
let http = require('../../../utils/request');
let API = require('../../../utils/config.js');
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden_date: true,
    currentDate: new Date().getTime(),
    minDate: new Date().getTime(),
    isDecline: false,
    coachPlayer: true,
    leadPlayer: true,
    isFree: false,
    applyType: '0',
    genderType: "2",
    sid: -1,
    option_type: [{
        text: '女',
        value: '0'
      },
      {
        text: '男',
        value: '1'
      },
      {
        text: '不限',
        value: '2'
      },
    ],
    needLead: true,
    needCoach: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    console.log(options)
    if (options.id) {
      wx.setNavigationBarTitle({
        title: '编辑团体赛'
      })
      self.setData({
        sid: options.id
      })
      self.getDetail();
    }
  },

  getDetail: function () {
    let self = this;
    let {
      sid
    } = this.data;
    http.get('/competition/teamEvent/queryById', {
      id: sid
    }).then(function (res) {
      let data = res.data.message;
      let {
        eventName,
        genderType,
        minAge,
        maxAge,
        applyType,
        applyNumTeam,
        applyNumPeople,
        priceNumTeam,
        priceNumPeople,
        minNum,
        maxNum,
        isDecline,
        needLead,
        needCoach,
        coachPlayer,
        leadPlayer,
        isFree
      } = data;
      self.setData({
        eventName,
        genderType,
        minAge,
        maxAge,
        applyType,
        applyNumTeam,
        applyNumPeople,
        priceNumTeam,
        priceNumPeople,
        minNum,
        maxNum,
        isDecline,
        needLead,
        needCoach,
        coachPlayer,
        leadPlayer,
        isFree
      })
      // console.log(res)
    })
  },
  submit: function () {
    let self = this;
    let {
      eventName,
      genderType,
      minAge,
      maxAge,
      applyType,
      applyNumTeam,
      applyNumPeople,
      priceNumTeam,
      priceNumPeople,
      minNum,
      maxNum,
      isDecline,
      needLead,
      needCoach,
      coachPlayer,
      leadPlayer,
      isFree,
      sid
    } = this.data;
    if (App.isNull(eventName)) {
      return wx.showToast({
        title: '组别名称不能为空',
        icon: 'none'
      })
    }
    if (App.isNull(minAge) || App.isNull(maxAge)) {
      return wx.showToast({
        title: '年龄区间不能为空',
        icon: 'none'
      })
    }
    if (applyType == "0" && (App.isNull(applyNumTeam) || applyNumTeam == 0)) {
      return wx.showToast({
        title: '请填写总队数，总队数不能为0',
        icon: 'none'
      })
    }
    if (applyType == "0" && App.isNull(priceNumTeam) && !isFree) {
      return wx.showToast({
        title: '请填写每项收费金额',
        icon: 'none'
      })
    }
    if (applyType == "1" && (App.isNull(applyNumPeople) || applyNumPeople == 0)) {
      return wx.showToast({
        title: '请填写总人数,总人数不能为0',
        icon: 'none'
      })
    }

    if (applyType == "1" && App.isNull(priceNumPeople) && !isFree) {
      return wx.showToast({
        title: '请填写每人收费金额',
        icon: 'none'
      })
    }

    if (App.isNull(minNum) || App.isNull(maxNum)) {
      return wx.showToast({
        title: '每队人数区间不能为空',
        icon: 'none'
      })
    }
    let params = {
      eventName,
      genderType,
      minAge,
      maxAge,
      applyType,
      minNum,
      maxNum,
      isDecline,
      needLead,
      needCoach,
      coachPlayer,
      leadPlayer,
      isFree
    };
    if (applyType == "0") {
      params = {
        ...params,
        applyNumTeam,
        priceNumTeam
      }
    } else if (applyType == "1") {
      params = {
        ...params,
        applyNumPeople,
        priceNumPeople
      }
    };
    let url = '/competition/teamEvent/create';
    if (sid != -1) {
      url = '/competition/teamEvent/update';
      params = {
        ...params,
        id: sid
      }
    }
    http.post(url, params).then(function (res) {
      console.log(res);
      if (res.data.status == 200) {
        self.saveArr(res.data.message)
      }
    })

  },
  saveArr: function (info) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    let {
      team,
      teamName
    } = prevPage.data;
    // console.log(info);
    let indexof = team.indexOf(info.id);

    if (indexof != -1) {
      team.splice(indexof, 1)
      teamName.splice(indexof, 1)
    }

    team.push(info.id);
    teamName.push(info);
    prevPage.setData({
      team,
      teamName
    });
    wx.navigateBack({
      delta: 1,
    })
  },
  changeRadio: function (e) {
    this.setData({
      applyType: e.detail
    })
  },
  bindDateFile: function (e) {
    // console.log(e);
    let key = e.currentTarget.dataset.key;
    let value = e.detail
    this.setData({
      [key]: value
    })
  },
  bindDate: function (e) {
    // console.log(e);
    let key = e.currentTarget.dataset.key;
    let value = e.detail.value;
    if (key == 'applyNumPeople' || key == 'applyNumTeam' || key == 'minNum' || key == 'maxNum' || key == 'minAge' || key == 'maxAge') {
      value = this.validateNumber(value);
    } else if (key == 'priceNumTeam' || key == 'priceNumPeople') {
      value = this.validateFixed(value);
    }
    this.setData({
      [key]: value
    })
  },
  bindBlur: function (e) {
    let value = parseFloat(e.detail.value);
    if (value < 1) {
      return wx.showToast({
        title: '年龄不能小于1',
        icon: 'none'
      })
    }
    if (value > 100) {
      return wx.showToast({
        title: '年龄不能大于100',
        icon: 'none'
      })
    }
  },
  onChange: function (e) {
    let key = e.currentTarget.dataset.key;
    let value = e.detail;
    this.setData({
      [key]: value
    })
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
  onInput: function (event) {
    this.setData({
      currentDate: event.detail
    });
  },
  confirm: function (e) {
    this.showDate();
    let currentKey = this.data.currentKey;
    let value = (util.formatStamp(e.detail)).date;
    console.log(currentKey + 'Time')
    this.setData({
      [currentKey]: e.detail,
      [currentKey + 'Time']: value

    })
  },
  isLeader: function (e) {
    let key = e.currentTarget.dataset.key;
    // console.log(key);
    let value = this.data[key];
    this.setData({
      [key]: !value
    })
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
})