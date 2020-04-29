// pages/pageTemplate/cropper/cropper.js
import WeCropper from './we-cropper.min.js'
const device = wx.getSystemInfoSync(); // 获取设备信息
const width = device.windowWidth; 
const height = device.windowHeight -100;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rotateI: 0,
    cropperOpt: {
      id: 'cropper', // 用于手势操作的canvas组件标识符
      rotateI: 0,
      targetId: 'targetCropper', // 用于用于生成截图的canvas组件标识符
      pixelRatio: device.pixelRatio, // 传入设备像素比
      width,  // 画布宽度
      height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x:  0, // 裁剪框x轴起点
        y:100, // 裁剪框y轴期起点
        width: width, // 裁剪框宽度
        height: width / (375/147) // 裁剪框高度
      }
    },
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    const { cropperOpt } = this.data
    this.cropper = new WeCropper(cropperOpt).on('ready', (ctx) => {
            console.log(`wecropper is ready for work!`);
            setTimeout(() => {
              this.uploadTap(options.url);
            });
        })
  },
  uploadTap (src) {
    const self = this
    self.cropper.pushOrign(src)
  },
  getCropperImage () {
    this.wecropper.getCropperImage((tempFilePath) => {
      console.log(tempFilePath);
      let pages = getCurrentPages();
      let prevPage = pages[pages.length - 2];
      prevPage.setData({
        imagePath: tempFilePath,
        file: tempFilePath,
        isImg: true,
      })
      wx.navigateBack({
        delta: 1,
      })
    })
   },
   toback(){
    wx.navigateBack({
      delta: 1,
    })
   },
  touchStart (e) {
    this.cropper.touchStart(e)
  },
  touchMove (e) {
    this.cropper.touchMove(e)
  },
  touchEnd (e) {
    this.cropper.touchEnd(e)
  }

})